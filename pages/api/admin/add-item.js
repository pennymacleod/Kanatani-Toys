// Private: adds one item to Square from the Add Stock page.
// 1. creates the item with one variation (price in pence, stock tracked)
// 2. uploads the photo and makes it the item's main picture
// 3. sets the stock count at the Brighton shop
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };

const key = () => crypto.randomUUID();

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  const { name, description, price, quantity, categoryId, online, image } = req.body || {};

  const title = String(name || '').trim();
  const pence = Math.round(Number(price) * 100);
  const qty = Math.floor(Number(quantity));
  if (!title) return res.status(400).json({ error: 'Please give it a name.' });
  if (!Number.isFinite(pence) || pence <= 0) return res.status(400).json({ error: 'Please give it a price.' });
  if (!Number.isFinite(qty) || qty < 0) return res.status(400).json({ error: 'Please give a quantity (0 or more).' });

  const steps = [];
  try {
    // 1. Item + variation
    const itemData = {
      name: title,
      variations: [{
        type: 'ITEM_VARIATION',
        id: '#var',
        item_variation_data: {
          name: 'Regular',
          pricing_type: 'FIXED_PRICING',
          price_money: { amount: pence, currency: 'GBP' },
          track_inventory: true,
        },
      }],
    };
    if (description && String(description).trim()) itemData.description = String(description).trim();
    if (categoryId) {
      itemData.categories = [{ id: categoryId }];
      itemData.reporting_category = { id: categoryId };
    }
    if (online === false) itemData.ecom_visibility = 'HIDDEN';

    const created = await square('/v2/catalog/object', {
      method: 'POST',
      body: { idempotency_key: key(), object: { type: 'ITEM', id: '#item', item_data: itemData } },
    });
    const item = created.catalog_object;
    const variationId = item.item_data.variations[0].id;
    steps.push('item');

    // 2. Photo
    let imageNote = null;
    const m = typeof image === 'string' && image.match(/^data:(image\/(jpeg|png));base64,(.+)$/);
    if (m) {
      try {
        const buf = Buffer.from(m[3], 'base64');
        const form = new FormData();
        form.append('request', JSON.stringify({
          idempotency_key: key(),
          object_id: item.id,
          is_primary: true,
          image: { type: 'IMAGE', id: '#img', image_data: { name: title } },
        }));
        form.append('image_file', new Blob([buf], { type: m[1] }), `photo.${m[2] === 'png' ? 'png' : 'jpg'}`);
        await square('/v2/catalog/images', { method: 'POST', body: form });
        steps.push('photo');
      } catch (err) {
        imageNote = `Added without the photo (${explain(err)}). You can add the photo in Square.`;
      }
    }

    // 3. Stock count
    let stockNote = null;
    try {
      await square('/v2/inventory/changes/batch-create', {
        method: 'POST',
        body: {
          idempotency_key: key(),
          changes: [{
            type: 'PHYSICAL_COUNT',
            physical_count: {
              catalog_object_id: variationId,
              location_id: SQUARE_LOCATION_ID,
              quantity: String(qty),
              state: 'IN_STOCK',
              occurred_at: new Date().toISOString(),
            },
          }],
        },
      });
      steps.push('stock');
    } catch (err) {
      stockNote = `Added, but the stock count didn’t save (${explain(err)}). Set it in Square.`;
    }

    res.status(200).json({ ok: true, id: item.id, name: title, steps, notes: [imageNote, stockNote].filter(Boolean) });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
