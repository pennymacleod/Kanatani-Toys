// Private: puts the t-shirts from lib/tshirts.js into Square, ready to sell
// online. For each shirt it finds the Square item with the same name (or makes
// one), gives it S/M/L sizes at the shirt's price, turns on stock tracking,
// adds it to the "T-shirts" category, shows it online, and adds the photo if
// the item has none. Stock counts are only set for sizes that weren't being
// tracked yet, so pressing it again never resets counts after a sale.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';
import { SHIRTS, TSHIRT_SIZES, TSHIRT_CATEGORY } from '../../../lib/tshirts';

const key = () => crypto.randomUUID();
const norm = (t) => String(t || '').trim().toLowerCase();
const SIZE_WORDS = { s: 's', small: 's', m: 'm', medium: 'm', med: 'm', l: 'l', large: 'l' };
const sizeOf = (name) => SIZE_WORDS[norm(name)] || null;

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  try {
    let objs = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM,CATEGORY${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      objs = objs.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);

    let cat = objs.find(o => o.type === 'CATEGORY' && norm(o.category_data?.name) === norm(TSHIRT_CATEGORY));
    if (!cat) {
      cat = (await square('/v2/catalog/object', { method: 'POST', body: { idempotency_key: key(), object: { type: 'CATEGORY', id: '#cat', category_data: { name: TSHIRT_CATEGORY } } } })).catalog_object;
    }

    const report = [];
    for (const shirt of SHIRTS) {
      const pence = Math.round(Number(shirt.price) * 100);
      if (!pence) { report.push(`${shirt.name}: skipped, no price yet.`); continue; }
      const existing = objs.find(o => o.type === 'ITEM' && norm(o.item_data?.name) === norm(shirt.name));
      let item = existing ? (await square(`/v2/catalog/object/${existing.id}`)).object : null;
      const wasTracked = {};
      const made = !item;

      if (!item) {
        item = { type: 'ITEM', id: '#item', present_at_all_locations: true, item_data: { name: shirt.name, variations: [] } };
      }
      const d = item.item_data;
      d.variations = d.variations || [];
      for (const size of TSHIRT_SIZES) {
        let v = d.variations.find(x => sizeOf(x.item_variation_data?.name) === size.toLowerCase());
        if (v) {
          wasTracked[size] = v.item_variation_data.track_inventory === true;
        } else {
          v = { type: 'ITEM_VARIATION', id: `#${size}`, present_at_all_locations: true, item_variation_data: { name: size } };
          if (!made) v.item_variation_data.item_id = item.id;
          d.variations.push(v);
          wasTracked[size] = false;
        }
        Object.assign(v.item_variation_data, { pricing_type: 'FIXED_PRICING', price_money: { amount: pence, currency: 'GBP' }, track_inventory: true });
      }
      // Put the sizes first, in S, M, L order, so the website picks S by default.
      d.variations.sort((a, b) => {
        const ia = TSHIRT_SIZES.findIndex(s => s.toLowerCase() === sizeOf(a.item_variation_data?.name));
        const ib = TSHIRT_SIZES.findIndex(s => s.toLowerCase() === sizeOf(b.item_variation_data?.name));
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
      d.categories = [{ id: cat.id }];
      d.reporting_category = { id: cat.id };
      // Coloured tile on the till, same colour as the shirt's website card.
      const hex = String(shirt.colour || '').replace('#', '');
      if (/^[0-9a-fA-F]{6}$/.test(hex)) d.label_color = hex.toUpperCase();
      d.ecom_visibility = 'VISIBLE';
      d.available_online = true;

      const saved = (await square('/v2/catalog/batch-upsert', {
        method: 'POST', body: { idempotency_key: key(), batches: [{ objects: [item] }] },
      })).objects.find(o => o.type === 'ITEM');

      // Photo, only if the item has none yet.
      let photo = '';
      if (!(saved.item_data?.image_ids || []).length) {
        try {
          const host = req.headers['x-forwarded-host'] || req.headers.host;
          const img = await fetch(`https://${host}${shirt.img}`);
          if (!img.ok) throw new Error(`photo ${img.status}`);
          const form = new FormData();
          form.append('request', JSON.stringify({ idempotency_key: key(), object_id: saved.id, is_primary: true, image: { type: 'IMAGE', id: '#img', image_data: { name: shirt.name } } }));
          form.append('image_file', new Blob([Buffer.from(await img.arrayBuffer())], { type: 'image/jpeg' }), 'tshirt.jpg');
          await square('/v2/catalog/images', { method: 'POST', body: form });
          photo = ', photo added';
        } catch (e) { photo = ', photo not added'; }
      }

      // Starting stock, only for sizes that weren't tracked before.
      const changes = [];
      const counts = [];
      for (const v of saved.item_data.variations) {
        const size = TSHIRT_SIZES.find(s => s.toLowerCase() === sizeOf(v.item_variation_data?.name));
        if (!size) continue;
        if (wasTracked[size]) { counts.push(`${size} kept`); continue; }
        const qty = Number(shirt.stock?.[size] || 0);
        changes.push({ type: 'PHYSICAL_COUNT', physical_count: { catalog_object_id: v.id, location_id: SQUARE_LOCATION_ID, quantity: String(qty), state: 'IN_STOCK', occurred_at: new Date().toISOString() } });
        counts.push(`${size} ${qty}`);
      }
      if (changes.length) await square('/v2/inventory/changes/batch-create', { method: 'POST', body: { idempotency_key: key(), changes } });

      report.push(`${shirt.name}: ${made ? 'made new' : 'updated'}, £${shirt.price}, stock ${counts.join(' · ')}${photo}.`);
    }
    res.status(200).json({ ok: true, report });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
