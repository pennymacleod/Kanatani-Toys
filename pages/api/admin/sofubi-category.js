// Private: puts the shop sofubi listed in KT_SOFUBI (lib/restock.js) into the
// "KT Sofubi" Square category, so they show on the till's category tile.
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { isTillArtistItem } from '../../../lib/productRules';
import { KT_SOFUBI } from '../../../lib/restock';

const key = () => crypto.randomUUID();
const norm = (s) => String(s || '').toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ');

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  try {
    let objects = [], cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=ITEM,CATEGORY${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      objects = objects.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);

    const cats = objects.filter(o => o.type === 'CATEGORY');
    const cat = cats.find(c => norm(c.category_data?.name).trim() === 'kt sofubi')
      || cats.find(c => /kanatani sofubi/i.test(c.category_data?.name || ''));
    if (!cat) return res.status(404).json({ error: 'Couldn’t find a "KT Sofubi" category in Square.' });

    const items = objects.filter(o => o.type === 'ITEM' && !isTillArtistItem(o.item_data?.name || ''));
    const notes = [];
    for (const r of KT_SOFUBI) {
      let hits = [];
      for (const words of r.any) {
        hits = items.filter(o => words.every(w => norm(o.item_data?.name).includes(norm(w))));
        if (hits.length) break;
      }
      if (!hits.length) { notes.push(`${r.label}: couldn’t find it in Square by name.`); continue; }
      if (hits.length > 1) { notes.push(`${r.label}: more than one item matches (${hits.map(o => o.item_data.name).join('; ')}), nothing changed.`); continue; }
      const { object: it } = await square(`/v2/catalog/object/${hits[0].id}`);
      const d = it.item_data;
      const has = (d.categories || []).some(c => c.id === cat.id) || d.category_id === cat.id;
      if (has) { notes.push(`${r.label}: already in ${cat.category_data.name} (${d.name}).`); continue; }
      d.categories = [...(d.categories || []), { id: cat.id }];
      if (!d.reporting_category) d.reporting_category = { id: cat.id };
      await square('/v2/catalog/object', { method: 'POST', body: { idempotency_key: key(), object: it } });
      notes.push(`${r.label}: added to ${cat.category_data.name} (${d.name}).`);
    }
    res.status(200).json({ ok: true, notes });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
