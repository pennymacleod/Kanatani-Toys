// Kanatani News sign-up, sent from our server to Penny's MailerLite form
// (instead of straight from the browser), so we can see MailerLite's answer.
// POST { email } → { ok }. GET ?check=1 sends a deliberately invalid email and
// shows MailerLite's raw reply, to diagnose problems (adds no subscriber).
const ACCOUNT_ID = '2763443';
const FORM_ID = '203057002534930301';
const URL = `https://assets.mailerlite.com/jsonp/${ACCOUNT_ID}/forms/${FORM_ID}/subscribe`;

async function send(email) {
  const body = new URLSearchParams();
  body.append('fields[email]', String(email || '').trim());
  body.append('ml-submit', '1');
  body.append('anticsrf', 'true');
  const r = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', Origin: 'https://kanatani-toys.vercel.app', Referer: 'https://kanatani-toys.vercel.app/' },
    body,
  });
  const text = await r.text();
  let json = null; try { json = JSON.parse(text); } catch {}
  return { status: r.status, json, text: text.slice(0, 1500) };
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET' && req.query.check) {
      const out = await send('not-an-email');
      return res.status(200).json(out);
    }
    if (req.method !== 'POST') return res.status(405).json({ ok: false });
    const email = req.body?.email;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim())) return res.status(400).json({ ok: false, error: 'bad email' });
    const out = await send(email);
    const ok = out.status >= 200 && out.status < 300 && out.json?.success !== false;
    if (!ok) console.error('MailerLite sign-up failed', out.status, out.text);
    return res.status(ok ? 200 : 502).json({ ok, status: out.status, error: ok ? undefined : (out.json?.errors || out.text) });
  } catch (e) {
    console.error('sign-up error', e);
    return res.status(502).json({ ok: false, error: String(e.message || e) });
  }
}
