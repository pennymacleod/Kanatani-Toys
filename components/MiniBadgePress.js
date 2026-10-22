import { useEffect, useRef, useState } from 'react';
import { useCart } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';

// A small badge press that lives inside the basket. Pulling the lever plays the
// press animation and adds the Square item named "Mystery Badge" to the basket
// without leaving it. Until that item exists in Square it just plays for fun.
let cachedItem; // shared across openings of the basket
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export default function MiniBadgePress() {
  const { add, cart } = useCart();
  const [item, setItem] = useState(cachedItem);
  const [step, setStep] = useState('idle'); // idle | down1 | swap | down2 | pop
  const [msg, setMsg] = useState('');
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    if (cachedItem === undefined) {
      fetch('/api/catalog')
        .then(r => (r.ok ? r.json() : null))
        .then(d => { cachedItem = (d?.products || []).find(p => /mystery\s*badge/i.test(p.name)) || null; if (alive.current) setItem(cachedItem); })
        .catch(() => { cachedItem = null; if (alive.current) setItem(null); });
    }
    return () => { alive.current = false; };
  }, []);

  const muted = () => { try { return localStorage.getItem('kanatani-gacha-muted') === '1'; } catch (e) { return false; } };
  const sfx = (fn) => { if (!muted()) fn(); };
  const hasOne = cart.some(i => /mystery\s*badge/i.test(i.name));
  const busy = step !== 'idle';

  const pull = async () => {
    if (busy) return;
    setMsg('');
    setStep('down1'); sfx(sounds.clunk); await wait(300);
    setStep('swap'); sfx(sounds.slide); await wait(380);
    setStep('down2'); sfx(sounds.clunk); await wait(300);
    setStep('pop'); sfx(sounds.ping);
    if (item) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Badge' });
      setMsg(ok ? 'Mystery badge added! 🎉' : 'That\'s all our badges for now!');
    } else {
      setMsg('Mystery badges online are coming soon! They\'re £1 in the shop.');
    }
    await wait(1400);
    if (alive.current) setStep('idle');
  };

  return (
    <div className={`mbp s-${step}`}>
      <button type="button" className="mbp-machine" onClick={pull} disabled={busy} aria-label="Pull the lever to add a mystery badge for £1">
        <span className="mp-lever"><span className="mp-knob" /></span>
        <span className="mp-col" />
        <span className="mp-head"><span className="mp-ram" /></span>
        <span className="mp-base"><span className="mp-tray"><span className="mp-die" /></span></span>
        {step === 'pop' && (
          <span className="mp-pop" aria-hidden="true">
            <span className="mp-burst" />
            <span className="mp-badge">?</span>
          </span>
        )}
      </button>
      <div className="mp-text">
        <b>{hasOne ? 'Another mystery badge? £1' : 'Add a mystery badge! £1'}</b>
        <button type="button" className="mp-cta" onClick={pull} disabled={busy}>{busy ? 'Pressing…' : 'Pull the lever!'}</button>
        <span className="mp-msg" aria-live="polite">{msg}</span>
      </div>
    </div>
  );
}
