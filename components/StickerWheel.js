// Sticker-wheel pop-up (Penny, 21 Nov 2026): after 8 seconds on the site, a silly
// spinning wheel invites people to join Kanatani News. Every slice is a winner;
// everyone gets the whole WhatsApp sticker pack by email (MailerLite automation).
// Shows once per visitor (localStorage), never on checkout/admin pages, closes
// with one tap, Escape or a tap outside. Only runs on its own when SIGNUP_LIVE.
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { SIGNUP_LIVE, subscribe, isEmail } from '../lib/newsletter';

const SEEN_KEY = 'kt_wheel_seen';
const DELAY_MS = 8000;
const SKIP = ['/add-stock', '/order-complete', '/stickers', '/privacy', '/terms'];
const SLICES = [
  { t: 'WINNER!', c: '#FF1F8F' },
  { t: 'STICKERS!', c: '#3FB7F0' },
  { t: 'YOU WIN!', c: '#F2B705' },
  { t: 'NO LOSERS', c: '#5BD34A' },
  { t: 'WINNER!', c: '#FF7417' },
  { t: 'STICKERS!', c: '#FF1F8F' },
  { t: 'YOU WIN!', c: '#3FB7F0' },
  { t: 'JACKPOT!', c: '#F2B705' },
];

function Wheel({ angle, spinning }) {
  const n = SLICES.length, r = 150, step = 360 / n;
  const pt = (deg) => { const a = (deg - 90) * Math.PI / 180; return [r + r * Math.cos(a), r + r * Math.sin(a)]; };
  return (
    <svg viewBox="0 0 300 300" className="ktw-wheel"
      style={{ transform: `rotate(${angle}deg)`, transition: spinning ? 'transform 4.2s cubic-bezier(.12,.75,.15,1)' : 'none' }}>
      {SLICES.map((s, i) => {
        const [x1, y1] = pt(i * step), [x2, y2] = pt((i + 1) * step);
        const mid = i * step + step / 2;
        return (
          <g key={i}>
            <path d={`M150 150 L${x1} ${y1} A150 150 0 0 1 ${x2} ${y2} Z`} fill={s.c} stroke="#141018" strokeWidth="4" />
            <text x="238" y="150" dominantBaseline="central" transform={`rotate(${mid - 90} 150 150)`} textAnchor="middle" className="ktw-slice">{s.t}</text>
          </g>
        );
      })}
      <circle cx="150" cy="150" r="26" fill="#FFF4D6" stroke="#141018" strokeWidth="5" />
      <text x="150" y="157" textAnchor="middle" className="ktw-hub">★</text>
    </svg>
  );
}

export default function StickerWheel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [email, setEmail] = useState('');
  const [agree, setAgree] = useState(false);
  const [stage, setStage] = useState('ask'); // ask | sending | spinning | won | error
  const [angle, setAngle] = useState(0);
  const [msg, setMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const forced = new URLSearchParams(window.location.search).has('wheel');
    if (forced) { setPreview(!SIGNUP_LIVE); setOpen(true); return; }
    if (!SIGNUP_LIVE) return;
    if (SKIP.some(p => router.pathname.startsWith(p))) return;
    let seen = false;
    try { seen = !!localStorage.getItem(SEEN_KEY); } catch {}
    if (seen) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [router.pathname]);

  useEffect(() => {
    if (!open) return;
    try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch {}
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  if (!open) return null;

  const spin = () => {
    setStage('spinning');
    setAngle(a => a + 360 * 6 + Math.floor(Math.random() * 360));
    setTimeout(() => setStage('won'), 4400);
  };

  const go = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) { setMsg('Pop a proper email address in!'); inputRef.current?.focus(); return; }
    if (!agree) { setMsg('Tick the box to say you want Kanatani News emails.'); return; }
    setMsg('');
    if (preview) { spin(); return; }
    setStage('sending');
    try {
      const ok = await subscribe(email);
      if (!ok) throw new Error('no');
      spin();
    } catch {
      setStage('error');
      setMsg("Oops, that didn't go through. Try again in a moment.");
    }
  };

  const close = () => setOpen(false);

  return (
    <div className="ktw-back" onClick={close} role="presentation">
      <div className="ktw-box" role="dialog" aria-modal="true" aria-label="Spin to win free stickers" onClick={e => e.stopPropagation()}>
        <button type="button" className="ktw-x" onClick={close} aria-label="Close">✕</button>
        {preview && <div className="ktw-preview">PREVIEW: sign-up isn't live yet, nothing is sent</div>}
        <h2 className="ktw-h">SPIN TO WIN!</h2>
        <p className="ktw-sub">Free Kanatani Toys WhatsApp stickers. Every slice wins. No losers here!</p>
        <div className="ktw-stage">
          <div className="ktw-arrow" aria-hidden="true">▼</div>
          <Wheel angle={angle} spinning={stage === 'spinning' || stage === 'won'} />
          {stage === 'won' && <div className="ktw-confetti" aria-hidden="true">{Array.from({ length: 28 }).map((_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 7) * 0.12}s`, background: SLICES[i % SLICES.length].c }} />)}</div>}
        </div>
        {stage === 'won' ? (
          <div className="ktw-won">
            <div className="ktw-big">YOU WON… EVERYTHING!</div>
            <p>{preview ? 'In the real thing, the sticker pack goes to their inbox now.' : "Your sticker pack is on its way to your inbox. Welcome to Kanatani News!"}</p>
            <button type="button" className="ktw-btn" onClick={close}>Yay! Back to the toys</button>
          </div>
        ) : (
          <form className="ktw-form" onSubmit={go} noValidate>
            <input ref={inputRef} type="email" inputMode="email" autoComplete="email" placeholder="Your email" value={email}
              onChange={e => setEmail(e.target.value)} disabled={stage === 'sending' || stage === 'spinning'} aria-label="Your email" />
            <label className="ktw-ok">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              <span>Yes, send me Kanatani News: new stock, artist drops and Japan finds. Unsubscribe any time.</span>
            </label>
            <button type="submit" className="ktw-btn" disabled={stage === 'sending' || stage === 'spinning'}>
              {stage === 'sending' ? 'Signing you up…' : stage === 'spinning' ? 'Wheeee…' : 'SPIN THE WHEEL!'}
            </button>
            {msg && <p className="ktw-msg" role="alert">{msg}</p>}
            <p className="ktw-small">We use MailerLite to send our emails. See our <a href="/privacy">privacy policy</a>.</p>
          </form>
        )}
      </div>
    </div>
  );
}
