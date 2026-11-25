// Temporary diagnostic (25 Nov 2026): shows MailerLite's raw reply to a
// deliberately invalid email, so we can see why sign-ups fail. Adds no subscriber.
import Head from 'next/head';

export async function getServerSideProps() {
  const body = new URLSearchParams();
  body.append('fields[email]', 'not-an-email');
  body.append('ml-submit', '1');
  body.append('anticsrf', 'true');
  let out;
  try {
    const r = await fetch('https://assets.mailerlite.com/jsonp/2763443/forms/203057002534930301/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', Origin: 'https://kanatani-toys.vercel.app', Referer: 'https://kanatani-toys.vercel.app/' },
      body,
    });
    out = `HTTP ${r.status}\n${(await r.text()).slice(0, 2000)}`;
  } catch (e) { out = `ERROR ${e.message}`; }
  return { props: { out } };
}

export default function SignupCheck({ out }) {
  return (<><Head><meta name="robots" content="noindex" /></Head><pre style={{ whiteSpace: 'pre-wrap', padding: 20 }}>{out}</pre></>);
}
