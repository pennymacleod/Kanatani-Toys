// Private: makes the numbered artist buttons for the Square till.
// Skips any button whose name is already in Square, so it's safe to press twice.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { TILL_CATEGORY } from '../../../lib/tillArtists';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  const wanted = (req.body?.buttons || [])
    .map(b => ({ name: String(b.name || '').trim(), colour: String(b.colour || '').replace('#', '') }))
    .filter(b => b.name);
  if (!wanted.length) return res.status(400).json({ error: 'No buttons to make.' });

  try {
    // What's already in Square
    let objs = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM,CATEGORY${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      objs = objs.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);
    const have = new Set(objs.filter(o => o.type === 'ITEM').map(o => (o.item_data?.name || '').trim().toLowerCase()));
    let cat = objs.find(o => o.type === 'CATEGORY' && (o.category_data?.name || '').trim().toLowerCase() === TILL_CATEGORY.toLowerCase());

    const todo = wanted.filter(b => !have.has(b.name.toLowerCase()));
    const skipped = wanted.length - todo.length;
    if (!todo.length) return res.status(200).json({ ok: true, made: 0, skipped });

    const batch = [];
    if (!cat) batch.push({ type: 'CATEGORY', id: '#cat', category_data: { name: TILL_CATEGORY } });
    const catId = cat ? cat.id : '#cat';
    todo.forEach((b, i) => {
      const item = {
        type: 'ITEM',
        id: `#item${i}`,
        item_data: {
          name: b.name,
          categories: [{ id: catId }],
          reporting_category: { id: catId },
          ecom_visibility: 'HIDDEN',
          variations: [{
            type: 'ITEM_VARIATION',
            id: `#var${i}`,
            item_variation_data: { name: 'Regular', pricing_type: 'VARIABLE_PRICING' },
          }],
        },
      };
      if (/^[0-9a-fA-F]{6}$/.test(b.colour)) item.item_data.label_color = b.colour.toUpperCase();
      batch.push(item);
    });

    await square('/v2/catalog/batch-upsert', {
      method: 'POST',
      body: { idempotency_key: crypto.randomUUID(), batches: [{ objects: batch }] },
    });
    res.status(200).json({ ok: true, made: todo.length, skipped });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
