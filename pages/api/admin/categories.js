// Private: lists Square categories for the Add Stock page. Also used to
// check the password when the page is opened.
import { guard, square, explain } from '../../../lib/squareAdmin';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  try {
    let cats = [];
    let cursor = null;
    do {
      const d = await square(`/v2/catalog/list?types=CATEGORY${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`);
      cats = cats.concat((d.objects || []).filter(o => !o.is_deleted));
      cursor = d.cursor || null;
    } while (cursor);
    const list = cats
      .map(c => ({ id: c.id, name: c.category_data?.name || '' }))
      .filter(c => c.name)
      .sort((a, b) => a.name.localeCompare(b.name));
    res.status(200).json({ categories: list });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
