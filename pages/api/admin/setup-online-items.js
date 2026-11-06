// Private: puts the artist pieces in lib/onlineItems.js into Square as their own
// items, for sale on the till and the website. Safe to press again: stock is
// only set when tracking is first switched on, so it never resets after a sale.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';
import { ONLINE_ITEMS } from '../../../lib/onlineItems';

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
      const found = items.find(o => norm(o.item_data?.name) === norm(p.name));
      let item = found ? (await square(`/v2/catalog/object/${found.id}`)).object : null;
      const made = !item;
      if (!item) {
        item = { type: 'ITEM', id: '#item', item_data: { name: p.name, variations: [{ type: 'ITEM_VARIATION', id: '#var', item_variation_data: { name: 'Regular' } }] } };
      }
      const d = item.item_data;
      const v = d.variations[0];
      const wasTracked = !made && v.item_variation_data.track_inventory === true;
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
    res.status(200).json({ ok: true, report });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
