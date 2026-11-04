// Server-only helpers for the private Add Stock page (pages/add-stock.js).
// Uses the same Square token as the rest of the site (Vercel env), plus
// ADMIN_PASSWORD (Vercel env) so only Penny and Hiro can add stock.
import crypto from 'crypto';

export const SQUARE_BASE = process.env.SQUARE_ENVIRONMENT === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';
export const SQUARE_VERSION = '2025-01-23';

export function passwordOk(given) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (!real || typeof given !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(real).digest();
  return crypto.timingSafeEqual(a, b);
}

// Checks the request and replies with an error if it can't go ahead.
// Returns true when the caller may carry on.
export function guard(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return false; }
  if (!process.env.ADMIN_PASSWORD) {
    res.status(500).json({ error: 'The Add Stock password has not been set up yet (ADMIN_PASSWORD in Vercel).' });
    return false;
  }
  if (!process.env.SQUARE_ACCESS_TOKEN) { res.status(500).json({ error: 'Square key missing in Vercel.' }); return false; }
  if (!passwordOk(req.body?.password)) { res.status(401).json({ error: 'Wrong password.' }); return false; }
  return true;
}

export async function square(path, { method = 'GET', body, headers = {} } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const r = await fetch(`${SQUARE_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
      'Square-Version': SQUARE_VERSION,
      ...(isForm || !body ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body == null ? undefined : (isForm ? body : JSON.stringify(body)),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = data.errors?.[0];
    const err = new Error(e?.detail || e?.code || `Square said ${r.status}`);
    err.status = r.status;
    err.code = e?.code;
    throw err;
  }
  return data;
}

// Plain-English version of Square's error for the page.
export function explain(err) {
  if (err.status === 401 || err.status === 403 || err.code === 'INSUFFICIENT_SCOPES') {
    return 'Square won’t let the website add stock yet: the Square key can only read. It needs the “write” permissions for items and inventory (ITEMS_WRITE, INVENTORY_WRITE).';
  }
  return `Square said: ${err.message}`;
}
