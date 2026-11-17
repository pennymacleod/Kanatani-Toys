// Private: lists the shop's own sofubi in Square (the "KT Sofubi" / "Sofubi"
// till category, Penny, 17 Nov 2026) with their photo and stock count, so
// each one can get a picture on the till and be counted (1 each). Once a
// piece is counted, selling it on the till takes it to 0, and the website
// shows it SOLD OUT straight away.
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';
import { isTillArtistItem } from '../../../lib/productRules';

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  try {
    let objects = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM,CATEGORY,IMAGE${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      objects = objects.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);

    const cats = {}, imgs = {};
    for (const o of objects) {
      if (o.type === 'CATEGORY') cats[o.id] = o.category_data?.name || '';
      if (o.type === 'IMAGE') imgs[o.id] = o.image_data?.url || '';
    }
    // The shop's own sofubi: a Square category with "sofubi" in it, but not the
    // artists' Sofubi Showcase, and never an artist's numbered till button.
    const isShopSofubi = (name) => /sofubi/i.test(name) && !/showcase/i.test(name);

    const items = objects.filter(o => o.type === 'ITEM').map(o => {
      const d = o.item_data || {};
      const catIds = [...(d.categories || []).map(c => c.id), d.category_id, d.reporting_category?.id].filter(Boolean);
      const catNames = [...new Set(catIds.map(id => cats[id]).filter(Boolean))];
      return { o, d, catNames };
    }).filter(({ d, catNames }) => catNames.some(isShopSofubi) && !isTillArtistItem(d.name || ''));

    const varIds = items.flatMap(({ d }) => (d.variations || []).map(v => v.id));
    const counts = {};
    for (let i = 0; i < varIds.length; i += 500) {
      const r = await square('/v2/inventory/counts/batch-retrieve', {
        method: 'POST',
        body: { catalog_object_ids: varIds.slice(i, i + 500), location_ids: [SQUARE_LOCATION_ID], states: ['IN_STOCK'] },
      });
      for (const c of r.counts || []) counts[c.catalog_object_id] = Number(c.quantity);
    }

    const tracked = (v) => {
      const ov = (v.item_variation_data?.location_overrides || []).find(x => x.location_id === SQUARE_LOCATION_ID);
      if (ov && typeof ov.track_inventory === 'boolean') return ov.track_inventory;
      return v.item_variation_data?.track_inventory === true;
    };

    const list = items.map(({ o, d, catNames }) => {
      const imageId = (d.image_ids || [])[0];
      return {
        id: o.id,
        name: d.name || '',
        category: catNames.join(', '),
        image: imageId ? imgs[imageId] || null : null,
        online: d.ecom_visibility !== 'HIDDEN' && d.available_online !== false,
        variations: (d.variations || []).map(v => ({
          id: v.id,
          name: v.item_variation_data?.name || '',
          price: v.item_variation_data?.price_money?.amount ?? null,
          tracked: tracked(v),
          count: counts[v.id] ?? 0,
        })),
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    res.status(200).json({ ok: true, items: list });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
