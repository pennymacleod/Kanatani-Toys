// Private: puts the pieces in lib/restock.js back in stock in Square (till and
// website) when they've wrongly gone to SOLD. See lib/restock.js.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';
import { RESTOCK, RESTOCK_UNTIL, SET_SOLD } from '../../../lib/restock';

const key = () => crypto.randomUUID();
const norm = (s) => String(s || '').toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  if (new Date().toISOString().slice(0, 10) > RESTOCK_UNTIL) {
    return res.status(200).json({ ok: true, notes: ['This list has expired, nothing changed.'] });
  }
  try {
    let objects = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      objects = objects.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);

    // Every choice (variation) with the item name + choice name to match on.
    const vars = [];
    for (const o of objects) {
      const d = o.item_data || {};
      for (const v of d.variations || []) {
        vars.push({ v, item: d.name || '', text: norm(`${d.name} ${v.item_variation_data?.name || ''}`) });
      }
    }
    const counts = {};
    const ids = vars.map(x => x.v.id);
    for (let i = 0; i < ids.length; i += 500) {
      const r = await square('/v2/inventory/counts/batch-retrieve', {
        method: 'POST', body: { catalog_object_ids: ids.slice(i, i + 500), location_ids: [SQUARE_LOCATION_ID] },
      });
      for (const c of r.counts || []) if (c.state === 'IN_STOCK') counts[c.catalog_object_id] = (counts[c.catalog_object_id] || 0) + Number(c.quantity || 0);
    }
    const soldOutSwitch = (v) => (v.item_variation_data?.location_overrides || []).some(o => o.location_id === SQUARE_LOCATION_ID && o.sold_out === true);
    const tracked = (v) => v.item_variation_data?.track_inventory === true;

    const notes = [];
    for (const r of RESTOCK) {
      const hits = vars.filter(x => r.any.some(words => words.every(w => x.text.includes(norm(w)))));
      if (!hits.length) { notes.push(`${r.label}: couldn’t find it in Square by name.`); continue; }
      const sold = hits.filter(x => soldOutSwitch(x.v) || (tracked(x.v) && !(counts[x.v.id] > 0)));
      if (!sold.length) { notes.push(`${r.label}: already in stock (${hits.map(x => x.item).join(', ')}), left alone.`); continue; }
      if (sold.length > 1) { notes.push(`${r.label}: more than one sold piece matches (${sold.map(x => `${x.item} ${x.v.item_variation_data?.name || ''}`.trim()).join('; ')}), nothing changed.`); continue; }

      const x = sold[0];
      const { object: v } = await square(`/v2/catalog/object/${x.v.id}`);
      const vd = v.item_variation_data;
      let changed = false;
      if (vd.track_inventory !== true) { vd.track_inventory = true; changed = true; }
      for (const o of vd.location_overrides || []) {
        if (o.track_inventory === false) { o.track_inventory = true; changed = true; }
        if (o.location_id === SQUARE_LOCATION_ID && o.sold_out) { o.sold_out = false; changed = true; }
      }
      if (changed) await square('/v2/catalog/object', { method: 'POST', body: { idempotency_key: key(), object: v } });
      await square('/v2/inventory/changes/batch-create', {
        method: 'POST',
        body: {
          idempotency_key: key(),
          changes: [{ type: 'PHYSICAL_COUNT', physical_count: {
            catalog_object_id: x.v.id, location_id: SQUARE_LOCATION_ID, quantity: String(r.qty),
            state: 'IN_STOCK', occurred_at: new Date().toISOString(),
          } }],
        },
      });
      notes.push(`${r.label}: back in stock, ${r.qty} (${`${x.item} ${vd.name || ''}`.trim()}).`);
    }
    for (const r of SET_SOLD) {
      const hits = vars.filter(x => r.any.some(words => words.every(w => x.text.includes(norm(w)))));
      if (!hits.length) { notes.push(`${r.label}: couldn’t find it in Square by name.`); continue; }
      const left = hits.filter(x => !tracked(x.v) || counts[x.v.id] > 0);
      if (!left.length) { notes.push(`${r.label}: already at 0 on the till.`); continue; }
      if (left.length > 1) { notes.push(`${r.label}: more than one item matches (${left.map(x => x.item).join('; ')}), nothing changed.`); continue; }
      const x = left[0];
      const { object: v } = await square(`/v2/catalog/object/${x.v.id}`);
      const vd = v.item_variation_data;
      let changed = false;
      if (vd.track_inventory !== true) { vd.track_inventory = true; changed = true; }
      for (const o of vd.location_overrides || []) if (o.track_inventory === false) { o.track_inventory = true; changed = true; }
      if (changed) await square('/v2/catalog/object', { method: 'POST', body: { idempotency_key: key(), object: v } });
      await square('/v2/inventory/changes/batch-create', {
        method: 'POST',
        body: { idempotency_key: key(), changes: [{ type: 'PHYSICAL_COUNT', physical_count: {
          catalog_object_id: x.v.id, location_id: SQUARE_LOCATION_ID, quantity: '0',
          state: 'IN_STOCK', occurred_at: new Date().toISOString(),
        } }] },
      });
      notes.push(`${r.label}: set to 0 on the till (${x.item}).`);
    }
    res.status(200).json({ ok: true, notes });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
