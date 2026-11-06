// Private: puts the artist pieces in lib/onlineItems.js into Square as their own
// items, for sale on the till and the website. Safe to press again: stock is
// only set when tracking is first switched on, so it never resets after a sale.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';
import { ONLINE_ITEMS, RETIRED_ONLINE_ITEMS, TILL_PIECES } from '../../../lib/onlineItems';
import { tillButtonFor, pieceVariation } from '../../../lib/tillPieces';

const key = () => crypto.randomUUID();
const norm = (t) => String(t || '').trim().toLowerCase();

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  try {
    let items = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      items = items.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);

    const report = [];
    for (const p of ONLINE_ITEMS) {
      const pence = Math.round(Number(p.price) * 100);
      const names = [p.name, ...(p.aka || [])].map(norm);
      const found = items.find(o => names.includes(norm(o.item_data?.name)));
      let item = found ? (await square(`/v2/catalog/object/${found.id}`)).object : null;
      const made = !item;
      if (!item) {
        item = { type: 'ITEM', id: '#item', item_data: { name: p.name, variations: [{ type: 'ITEM_VARIATION', id: '#var', item_variation_data: { name: 'Regular' } }] } };
      }
      const d = item.item_data;
      d.name = p.name; // renames an older version (aka) to the current name
      if (p.description) d.description = p.description;
      const v = d.variations[0];
      const wasTracked = !made && v.item_variation_data.track_inventory === true;
      // Name the variation after the artist so Square's sales reports show whose it is.
      if (p.variation) v.item_variation_data.name = p.variation;
      Object.assign(v.item_variation_data, { pricing_type: 'FIXED_PRICING', price_money: { amount: pence, currency: 'GBP' }, track_inventory: true });
      item.present_at_all_locations = true;
      delete item.present_at_location_ids; delete item.absent_at_location_ids;
      for (const x of d.variations) { x.present_at_all_locations = true; delete x.present_at_location_ids; delete x.absent_at_location_ids; }
      d.ecom_visibility = 'VISIBLE';
      d.available_online = true;

      const saved = (await square('/v2/catalog/batch-upsert', {
        method: 'POST', body: { idempotency_key: key(), batches: [{ objects: [item] }] },
      })).objects.find(o => o.type === 'ITEM');
      const vid = saved.item_data.variations[0].id;

      let photo = '';
      if (!(saved.item_data?.image_ids || []).length && p.img) {
        try {
          const host = req.headers['x-forwarded-host'] || req.headers.host;
          const img = await fetch(`https://${host}${p.img}`);
          if (!img.ok) throw new Error(`photo ${img.status}`);
          const form = new FormData();
          form.append('request', JSON.stringify({ idempotency_key: key(), object_id: saved.id, is_primary: true, image: { type: 'IMAGE', id: '#img', image_data: { name: p.name } } }));
          form.append('image_file', new Blob([Buffer.from(await img.arrayBuffer())], { type: 'image/jpeg' }), 'photo.jpg');
          await square('/v2/catalog/images', { method: 'POST', body: form });
          photo = ', photo added';
        } catch (e) { photo = ', photo not added'; }
      }

      let stock = 'stock kept as it is';
      if (!wasTracked) {
        await square('/v2/inventory/changes/batch-create', { method: 'POST', body: { idempotency_key: key(), changes: [{ type: 'PHYSICAL_COUNT', physical_count: { catalog_object_id: vid, location_id: SQUARE_LOCATION_ID, quantity: String(p.stock || 0), state: 'IN_STOCK', occurred_at: new Date().toISOString() } }] } });
        stock = `stock ${p.stock || 0}`;
      }
      report.push(`${p.name}: ${made ? 'made new' : 'updated'}, £${p.price}, ${stock}${photo}.`);
    }
    // Artists' pieces as choices on their numbered till button (TILL_PIECES).
    for (const a of TILL_PIECES) {
      const btn = tillButtonFor(items, a.artist);
      if (!btn) { report.push(`${a.artist}: no till button found. Press "Make the artist till buttons" first.`); continue; }
      const item = (await square(`/v2/catalog/object/${btn.id}`)).object;
      const d = item.item_data;
      const carry = {}; // piece name → stock to start with
      const oldItems = [];
      const fresh = [];
      for (const p of a.pieces) {
        const pence = Math.round(Number(p.price) * 100);
        let v = pieceVariation(item, p);
        if (!v) {
          v = { type: 'ITEM_VARIATION', id: `#${p.name.replace(/[^a-z0-9]/gi, '')}`, item_variation_data: { item_id: item.id, name: p.name } };
          // Same shops as the button itself.
          for (const k of ['present_at_all_locations', 'present_at_location_ids', 'absent_at_location_ids']) if (item[k] !== undefined) v[k] = item[k];
          d.variations.push(v);
        }
        const vd = v.item_variation_data;
        if (vd.track_inventory !== true) fresh.push(p.name);
        vd.name = p.name;
        Object.assign(vd, { pricing_type: 'FIXED_PRICING', price_money: { amount: pence, currency: 'GBP' }, track_inventory: true });
        // Stock left on an older separate item for this piece carries over.
        const olds = items.filter(o => (p.from || []).map(norm).includes(norm(o.item_data?.name)));
        oldItems.push(...olds.map(o => ({ o, piece: p.name })));
        const oldVars = olds.flatMap(o => (o.item_data?.variations || []).filter(x => x.item_variation_data?.track_inventory).map(x => x.id));
        if (oldVars.length) {
          const counts = (await square('/v2/inventory/counts/batch-retrieve', { method: 'POST', body: { catalog_object_ids: oldVars, location_ids: [SQUARE_LOCATION_ID] } })).counts || [];
          carry[p.name] = counts.reduce((n, c) => n + (c.state && c.state !== 'IN_STOCK' ? 0 : parseInt(c.quantity || 0, 10)), 0);
        }
      }
      const saved = (await square('/v2/catalog/batch-upsert', {
        method: 'POST', body: { idempotency_key: key(), batches: [{ objects: [item] }] },
      })).objects.find(o => o.type === 'ITEM');
      for (const p of a.pieces) {
        const v = pieceVariation(saved, p);
        let stock = 'stock kept as it is';
        if (v && fresh.includes(p.name)) {
          const q = carry[p.name] ?? p.stock ?? 0;
          await square('/v2/inventory/changes/batch-create', { method: 'POST', body: { idempotency_key: key(), changes: [{ type: 'PHYSICAL_COUNT', physical_count: { catalog_object_id: v.id, location_id: SQUARE_LOCATION_ID, quantity: String(q), state: 'IN_STOCK', occurred_at: new Date().toISOString() } }] } });
          stock = `stock ${q}${carry[p.name] != null ? ' (carried over)' : ''}`;
        }
        report.push(`${saved.item_data.name} → ${p.name}: £${p.price}, ${stock}${p.online ? ', also on the website' : ', till only'}.`);
      }
      // The older separate items are replaced by the button's choices.
      for (const { o, piece } of oldItems) {
        await square(`/v2/catalog/object/${o.id}`, { method: 'DELETE' });
        report.push(`Old till item "${o.item_data.name}" removed (now ${saved.item_data.name} → ${piece}). Its past sales stay in your reports.`);
      }
    }

    // Take retired items back off the website (they stay on the till).
    for (const n of RETIRED_ONLINE_ITEMS) {
      const f = items.find(o => norm(o.item_data?.name) === norm(n));
      if (!f || TILL_PIECES.some(a => a.pieces.some(p => (p.from || []).map(norm).includes(norm(n))))) continue;
      const it = (await square(`/v2/catalog/object/${f.id}`)).object;
      it.item_data.ecom_visibility = 'HIDDEN';
      it.item_data.available_online = false;
      await square('/v2/catalog/batch-upsert', { method: 'POST', body: { idempotency_key: key(), batches: [{ objects: [it] }] } });
      report.push(`${n}: taken off the website.`);
    }
    res.status(200).json({ ok: true, report });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
