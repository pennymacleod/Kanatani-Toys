// Visitor counter for the homepage (the old-school "You are visitor no." box).
// The number lives in Penny's own Upstash Redis store, added through Vercel
// (Storage / Marketplace → Upstash Redis). Vercel sets the env vars for us.
// POST adds one and returns the new number; GET just reads it.
// If the store isn't set up yet, this answers { count: null } and the
// counter hides itself rather than showing an error.

const KEY = 'kt:visits';

function creds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const c = creds();
  if (!c) return res.status(200).json({ count: null });
  const op = req.method === 'POST' ? 'incr' : 'get';
  try {
    const r = await fetch(`${c.url}/${op}/${KEY}`, { headers: { Authorization: `Bearer ${c.token}` } });
    const j = await r.json();
    const n = Number(j && j.result);
    return res.status(200).json({ count: Number.isFinite(n) && n > 0 ? n : null });
  } catch (e) {
    return res.status(200).json({ count: null });
  }
}
