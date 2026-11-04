// Private: adds a photo to a piece that's already in Square (an item or one
// of the choices under an artist's till button).
import crypto from 'crypto';
import { guard, square, explain } from '../../../lib/squareAdmin';

export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };

export default async function handler(req, res) {
  if (!(await guard(req, res))) return;
  const { objectId, name, image } = req.body || {};
  const m = typeof image === 'string' && image.match(/^data:(image\/(jpeg|png));base64,(.+)$/);
  if (!objectId || !m) return res.status(400).json({ error: 'No photo to add.' });
  try {
    const form = new FormData();
    form.append('request', JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      object_id: objectId,
      is_primary: true,
      image: { type: 'IMAGE', id: '#img', image_data: { name: String(name || 'photo') } },
    }));
    form.append('image_file', new Blob([Buffer.from(m[3], 'base64')], { type: m[1] }), `photo.${m[2] === 'png' ? 'png' : 'jpg'}`);
    await square('/v2/catalog/images', { method: 'POST', body: form });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: explain(err) });
  }
}
