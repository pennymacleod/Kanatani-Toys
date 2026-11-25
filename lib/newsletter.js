// Kanatani News email sign-up (MailerLite, Penny's account on kanatanitoys@gmail.com).
// Sign-ups go to the "Kanatani News" group via the embedded form "Kanatani News
// sign-up". New members get the "Kanatani News welcome + free stickers" automation
// (MailerLite), which links to /stickers.
//
// 16:40: back on after Penny removed the reCAPTCHA box and saved the form (it was blocking every sign-up).
// SIGNUP_LIVE switched off again 25 Nov 2026 (15:40): the MailerLite form was still
// inactive (`active: false`), so every sign-up failed with "Oops, that didn't go
// through". Switch back on once Penny has published the form (check get_form active: true). Before that it stayed false until Penny had published the form in MailerLite and
// switched the welcome automation on. While it's false the sticker-wheel pop-up
// never shows on its own and the News page keeps its "coming soon" note, so
// nothing on the site pretends to sign anyone up. Add ?wheel to any address to
// preview the pop-up (preview mode spins without sending anything).
export const SIGNUP_LIVE = true;

const ACCOUNT_ID = '2763443';
const FORM_ID = '203057002534930301';
const SUBSCRIBE_URL = `https://assets.mailerlite.com/jsonp/${ACCOUNT_ID}/forms/${FORM_ID}/subscribe`;

export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim());

// Returns true when MailerLite accepted the email. Sent through our own
// /api/subscribe (server-side), which passes it on to MailerLite.
export async function subscribe(email) {
  const res = await fetch('/api/subscribe', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email).trim() }),
  });
  let j = null; try { j = await res.json(); } catch {}
  const ok = res.ok && j?.ok === true;
  // Short reason shown under the error message, to help fix problems.
  lastSignupError = ok ? '' : `(${res.status}${j?.error ? ': ' + JSON.stringify(j.error).slice(0, 160) : ''})`;
  return ok;
}
export let lastSignupError = '';
