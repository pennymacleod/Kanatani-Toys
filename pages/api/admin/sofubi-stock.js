// Private: switches on stock counting for one of the shop's sofubi and sets
// how many there are (1 when counting starts, 0 when it has sold).
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';
import { SQUARE_LOCATION_ID } from '../../../lib/squareLocation';

const key = () => crypto.randomUUID();

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  const { variationId, qty } = req.body || {};
  const n = Number(qty);
  if (!variationId || !Number.isInteger(n) || n < 0 || n > 999) return res.status(400).json({ error: 'Nothing to count.' });
  try {
    const { object: v } = await square(`/v2/catalog/object/${variationId}`);
    if (!v || v.type !== 'ITEM_VARIATION') return res.status(404).json({ error: 'Couldn’t find that piece in Square.' });
    const vd = v.item_variation_data;
    const overrides = vd.location_overrides || [];
    const needsTracking = vd.track_inventory !== true || overrides.some(o => o.track_inventory === false);
    if (needsTracking) {
      vd.track_inventory = true;
      for (const o of overrides) if (o.track_inventory === false) o.track_inventory = true;
      await square('/v2/catalog/object', { method: 'POST', body: { idempotency_key: key(), object: v } });
    }
    await square('/v2/inventory/changes/batch-create', {
      method: 'POST',
      body: {
        idempotency_key: key(),
        changes: [{
          type: 'PHYSICAL_COUNT',
          physical_count: {
            catalog_object_id: variationId,
            location_id: SQUARE_LOCATION_ID,
            quantity: String(n),
            state: 'IN_STOCK',
            occurred_at: new Date().toISOString(),
          },
        }],
      },
    });
    res.status(200).json({ ok: true, count: n });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
