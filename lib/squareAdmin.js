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
// Penny's private link (Nov 2026): /add-stock?k=<key> opens the page with
// nothing to type. Only the key's fingerprint is stored here. To cancel the
// link, change this value; to make a new link, put a new key's SHA-256 here.
const LINK_KEY_SHA256 = 'fc73ea50b1c757b840fa3afb0d3d9453abd873a4f262491ae56df03281fe8658';

const sha = (t) => crypto.createHash('sha256').update(t).digest();
// Phones like to add a capital letter or a space, so those don't count.
const tidy = (t) => String(t).trim().toLowerCase().replace(/\s+/g, '');

export function passwordOk(given) {
  if (typeof given !== 'string' || !given.trim()) return false;
  const g = sha(tidy(given));
  if (crypto.timingSafeEqual(g, Buffer.from(PASSWORD_SHA256, 'hex'))) return true;
  if (crypto.timingSafeEqual(g, Buffer.from(LINK_KEY_SHA256, 'hex'))) return true;
  const real = process.env.ADMIN_PASSWORD;
  return !!real && crypto.timingSafeEqual(g, sha(tidy(real)));
}

// Checks the request and replies with an error if it can't go ahead.
// Returns true when the caller may carry on.
// Penny, 10 Nov 2026: the phone kept forgetting the password (Safari wipes a
// page's own storage after about a week without a visit). Once the right
// password is given, the server now sets a year-long HttpOnly cookie, which
// Safari keeps, so the page opens by itself on that phone from then on.
export const ADMIN_COOKIE = 'kt_admin';
const YEAR = 60 * 60 * 24 * 365;

export function readAdminCookie(req) {
  const m = String(req.headers?.cookie || '').match(/(?:^|;\s*)kt_admin=([^;]+)/);
  try { return m ? decodeURIComponent(m[1]) : ''; } catch { return ''; }
}

export function setAdminCookie(res, value) {
  res.setHeader('Set-Cookie', `${ADMIN_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${value ? YEAR : 0}; HttpOnly; Secure; SameSite=Strict`);
}

export async function guard(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return false; }
  if (!process.env.SQUARE_ACCESS_TOKEN) { res.status(500).json({ error: 'Square key missing in Vercel.' }); return false; }
  const typed = req.body?.password;
  if (passwordOk(typed)) { setAdminCookie(res, typed); return true; }
  if (passwordOk(readAdminCookie(req))) return true;
  // Nothing typed and no saved cookie: just say so, no waiting.
  if (!typed) { res.status(401).json({ error: 'Password needed.', quiet: true }); return false; }
  await new Promise(r => setTimeout(r, 1500)); // slows down guessing
  res.status(401).json({ error: 'Wrong password.' });
  return false;
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
