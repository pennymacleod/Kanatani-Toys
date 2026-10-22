import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useCart, fmt } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';

// Mystery badge press. The press finds the Square item called "Mystery Badge"
// by name, so once Penny adds it in Square (£1, with stock) it starts adding
// badges to the basket automatically. Until then it plays as a demo.
const DESIGNS = [
  { src: '/nl/badges/monster-black.png', name: 'Strange monster (black)' },
  { src: '/nl/badges/monster-red.png', name: 'Strange monster (red)' },
  { src: '/nl/badges/logo-black.png', name: 'カナタニ logo' },
  { src: '/nl/badges/wrestler.png', name: 'Masked wrestler' },
  { src: '/nl/badges/creature.png', name: 'Toothy creature' },
];
const MUTE_KEY = 'kanatani-gacha-muted';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export default function BadgePress() {
  const { add, setOpen, qtyOf } = useCart();
  const [item, setItem] = useState(undefined); // undefined = loading, null = not in Square yet
  const [step, setStep] = useState('idle');     // idle | load | press1 | swap | press2 | pop
  const [made, setMade] = useState(0);
  const [msg, setMsg] = useState('Pull the lever to make a mystery badge!');
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const busy = step !== 'idle';

  useEffect(() => {
    try { const m = localStorage.getItem(MUTE_KEY) === '1'; setMuted(m); mutedRef.current = m; } catch (e) { /* ignore */ }
    fetch('/api/catalog')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setItem((d?.products || []).find(p => /mystery\s*badge/i.test(p.name)) || null))
      .catch(() => setItem(null));
  }, []);

  const sfx = (fn) => { if (!mutedRef.current) fn(); };
  const toggleMute = () => {
    const m = !muted; setMuted(m); mutedRef.current = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) { /* ignore */ }
  };

  const inBasket = item ? qtyOf(item.variationId || item.id) : 0;
  const soldOut = item && item.stock != null && inBasket >= item.stock;
  const live = item && !soldOut;

  const press = async () => {
    if (busy || soldOut) return;
    setMsg('Loading the shell…');
    setStep('load'); sfx(sounds.slide); await wait(550);
    setStep('press1'); sfx(sounds.clunk); setMsg('Squeeze!'); await wait(450);
    setStep('swap'); sfx(sounds.slide); setMsg('Swap the die…'); await wait(550);
    setStep('press2'); sfx(sounds.clunk); setMsg('And squeeze again!'); await wait(450);
    setStep('pop'); sfx(sounds.ping);
    setMade(n => n + 1);
    if (live) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Badge' });
      setMsg(ok ? 'A mystery badge is in your basket! It\'s a surprise until it arrives.' : 'That\'s all the badges we have for now!');
    } else {
      setMsg('Badges are £1 in the shop. Online mystery badges are coming soon!');
    }
    await wait(1600);
    setStep('idle');
  };

  const price = item ? fmt(item.price) : '£1';

  return (
    <Layout
      title="Badge Press — Kanatani Toys"
      description="Pull the lever on the Kanatani badge press and get a mystery badge for £1. A surprise design from Kanatani Toys in Brighton."
      path="/badge-press"
      active="badges"
      page="badges"
    >
      <section className="floor">
        <div className="wrap bwrap">
          <div className="bintro">
            <span className="kicker">缶バッジ · MYSTERY BADGES</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>Badge <span style={{ color: 'var(--orange)' }}>Press!</span></h1>
            <p>Pull the lever and our badge press makes you a mystery Kanatani badge, {price} each. Make as many as you like. Which design you get stays a surprise until your parcel arrives.</p>
            <div className="brow">
              {made > 0 && <span className="dex">Pressed <b>{made}</b></span>}
              <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? '🔇 Sound off' : '🔊 Sound on'}</button>
            </div>
          </div>

          <div className="press-area">
            <div className={`press s-${step}`}>
              <div className="lever" aria-hidden="true"><span className="knobend" /></div>
              <div className="column" aria-hidden="true" />
              <div className="head" aria-hidden="true"><span className="ram" /></div>
              <div className="base">
                <div className="plate"><div className="jp">カナタニ缶バッジ</div><div className="en">KANATANI BADGE PRESS</div></div>
                <div className="tray" aria-hidden="true">
                  <span className="die die-a"><span className="shell">?</span></span>
                  <span className="die die-b" />
                </div>
              </div>
              {step === 'pop' && <div className="reveal" aria-hidden="true"><span className="burst" /><span className="popped">?</span></div>}
            </div>
            <button className="btn pressbtn" type="button" onClick={press} disabled={busy || soldOut}>
              {soldOut ? 'All out for now' : busy ? 'Pressing…' : `Pull the lever · ${price}`}
            </button>
            <p className="hint" aria-live="polite">{msg}</p>
            {live && inBasket > 0 && (
              <button className="viewbasket" type="button" onClick={() => setOpen(true)}>
                {inBasket} mystery badge{inBasket > 1 ? 's' : ''} in your basket · View basket →
              </button>
            )}
          </div>
        </div>

        <div className="wrap bmix">
          <h2 className="big" style={{ fontSize: 'clamp(30px,4.2vw,46px)' }}>You might get…</h2>
          <div className="bgrid">
            {DESIGNS.map(d => (
              <figure key={d.src}>
                <img src={d.src} alt={d.name} loading="lazy" />
                <figcaption>{d.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="small">Designs change as we make new ones. We pick yours at random when we pack your order.</p>
        </div>
      </section>
    </Layout>
  );
}
