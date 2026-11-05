// Server-only helpers for the private Add Stock page (pages/add-stock.js).
// Uses the same Square token as the rest of the site (Vercel env), plus
// ADMIN_PASSWORD (Vercel env) so only Penny and Hiro can add stock.
import crypto from 'crypto';

export const SQUARE_BASE = process.env.SQUARE_ENVIRONMENT === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';
export const SQUARE_VERSION = '2025-01-23';

// Only a fingerprint (SHA-256) of the password is stored here, never the
// password itself. Penny has the password. To change it, put a new password's
// SHA-256 here, or set ADMIN_PASSWORD in Vercel (either one works).
const PASSWORD_SHA256 = 'ef6306f0624a361bf2ee04cc77aa8212b965e6bd4cc1344ed08ca302f1b6a860';

const sha = (t) => crypto.createHash('sha256').update(t).digest();
// Phones like to add a capital letter or a space, so those don't count.
const tidy = (t) => String(t).trim().toLowerCase().replace(/\s+/g, '');

export function passwordOk(given) {
  if (typeof given !== 'string' || !given.trim()) return false;
  const g = sha(tidy(given));
  if (crypto.timingSafeEqual(g, Buffer.from(PASSWORD_SHA256, 'hex'))) return true;
  const real = process.env.ADMIN_PASSWORD;
  return !!real && crypto.timingSafeEqual(g, sha(tidy(real)));
}

// Checks the request and replies with an error if it can't go ahead.
// Returns true when the caller may carry on.
export async function guard(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return false; }
  if (!process.env.SQUARE_ACCESS_TOKEN) { res.status(500).json({ error: 'Square key missing in Vercel.' }); return false; }
  if (!passwordOk(req.body?.password)) {
    await new Promise(r => setTimeout(r, 1500)); // slows down guessing
    res.status(401).json({ error: 'Wrong password.' });
    return false;
  }
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
