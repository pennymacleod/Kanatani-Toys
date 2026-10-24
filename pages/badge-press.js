import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useCart, fmt } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';
import { useLang } from '../lib/lang';

// Mystery badge press. The press finds the Square item called "Mystery Badge"
// by name, so once Penny adds it in Square (£1, with stock) it starts adding
// badges to the basket automatically. Until then it plays as a demo.
const DESIGNS = [
  { src: '/nl/badges/monster-black.png', name: 'Strange monster (black)', ja: 'ストレンジモンスター（黒）' },
  { src: '/nl/badges/monster-red.png', name: 'Strange monster (red)', ja: 'ストレンジモンスター（赤）' },
  { src: '/nl/badges/logo-black.png', name: 'カナタニ logo', ja: 'カナタニ ロゴ' },
  { src: '/nl/badges/wrestler.png', name: 'Masked wrestler', ja: '覆面レスラー' },
];
const MUTE_KEY = 'kanatani-gacha-muted';
const wait = (ms) => new Promise(r => setTimeout(r, ms));

export default function BadgePress() {
  const { add, setOpen, qtyOf } = useCart();
  const router = useRouter();
  const fromBasket = router.query.from === 'basket';
  const [item, setItem] = useState(undefined); // undefined = loading, null = not in Square yet
  const [step, setStep] = useState('idle');     // idle | load | press1 | swap | press2 | pop
  const [made, setMade] = useState(0);
  // Messages are [English, Japanese] pairs.
  const [msg, setMsg] = useState(['Pull the lever to make a mystery badge!', 'レバーを引いて、ミステリー缶バッジを作ろう！']);
  const { lang, t } = useLang();
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
    setMsg(['Loading the shell…', 'バッジのパーツをセット中…']);
    setStep('load'); sfx(sounds.slide); await wait(550);
    setStep('press1'); sfx(sounds.clunk); setMsg(['Squeeze!', 'ギュッ！']); await wait(450);
    setStep('swap'); sfx(sounds.slide); setMsg(['Swap the die…', '型を入れ替えて…']); await wait(550);
    setStep('press2'); sfx(sounds.clunk); setMsg(['And squeeze again!', 'もう一回ギュッ！']); await wait(450);
    setStep('pop'); sfx(sounds.ping);
    setMade(n => n + 1);
    if (live) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Badge' });
      setMsg(ok
        ? ['A mystery badge is in your basket! It\'s a surprise until it arrives.', 'ミステリー缶バッジがカートに入りました！届くまでのお楽しみ！']
        : ['That\'s all the badges we have for now!', '缶バッジは今あるだけで全部です！']);
    } else {
      setMsg(['Badges are £1 in the shop. Online mystery badges are coming soon!', '缶バッジは店頭で£1です。オンラインのミステリー缶バッジはもうすぐ登場！']);
    }
    await wait(1600);
    setStep('idle');
    // Came from the basket: take them back to it once their badge is made.
    if (live && fromBasket) setOpen(true);
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
            <span className="kicker">{t('缶バッジ · MYSTERY BADGES', '缶バッジ · ミステリー缶バッジ')}</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>{lang === 'ja' ? <>缶バッジ<span style={{ color: 'var(--orange)' }}>プレス！</span></> : <>Badge <span style={{ color: 'var(--orange)' }}>Press!</span></>}</h1>
            <p>{lang === 'ja'
              ? `レバーを引くと、バッジプレス機がカナタニのミステリー缶バッジを作ります。1個${price}、いくつでも作れます。どのデザインが届くかは、荷物が届くまでのお楽しみ！`
              : `Pull the lever and our badge press makes you a mystery Kanatani badge, ${price} each. Make as many as you like. Which design you get stays a surprise until your parcel arrives.`}</p>
            <div className="brow">
              {made > 0 && <span className="dex">{lang === 'ja' ? <>作った数 <b>{made}</b></> : <>Pressed <b>{made}</b></>}</span>}
              <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? t('🔇 Sound off', '🔇 サウンドオフ') : t('🔊 Sound on', '🔊 サウンドオン')}</button>
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
              {step === 'pop' && <div className="reveal" aria-hidden="true"><span className="burst" /><span className="popped"><svg viewBox="0 0 200 200" role="presentation">
                    <defs>
                      <path id="arcTop" d="M 30 100 A 70 70 0 0 1 170 100" />
                      <path id="arcBot" d="M 26 100 A 74 74 0 0 0 174 100" />
                    </defs>
                    {[...Array(8)].map((_, i) => <text key={i} x="100" y="18" textAnchor="middle" className="bstar" transform={`rotate(${i * 45 + 22.5} 100 100)`}>★</text>)}
                    <text className="arc"><textPath href="#arcTop" startOffset="50%" textAnchor="middle">RANDOM</textPath></text>
                    <text className="q" x="100" y="128" textAnchor="middle">?</text>
                    <text className="arc"><textPath href="#arcBot" startOffset="50%" textAnchor="middle" dominantBaseline="hanging">BADGE!</textPath></text>
                  </svg></span>
                  {[...Array(14)].map((_, i) => <span key={i} className="confetti" style={{ '--a': `${i * (360 / 14)}deg`, '--c': ['var(--pink)', 'var(--sky)', 'var(--green)', 'var(--gold)', 'var(--orange)'][i % 5], '--d': `${110 + (i % 3) * 40}px` }} />)}</div>}
            </div>
            <button className="btn pressbtn" type="button" onClick={press} disabled={busy || soldOut}>
              {soldOut ? t('All out for now', '今は品切れです') : busy ? t('Pressing…', 'プレス中…') : t(`Pull the lever · ${price}`, `レバーを引く · ${price}`)}
            </button>
            <p className="hint" aria-live="polite">{t(msg[0], msg[1])}</p>
            {live && inBasket > 0 && (
              <button className="viewbasket" type="button" onClick={() => setOpen(true)}>
                {lang === 'ja' ? `カートにミステリー缶バッジ${inBasket}個 · カートを見る →` : `${inBasket} mystery badge${inBasket > 1 ? 's' : ''} in your basket · View basket →`}
              </button>
            )}
          </div>
        </div>

        <div className="wrap bmix">
          <h2 className="big" style={{ fontSize: 'clamp(30px,4.2vw,46px)', color: 'var(--pink)' }}>{t('You might get…', 'こんなデザインが届くかも…')}</h2>
          <div className="bgrid">
            {DESIGNS.map(d => (
              <figure key={d.src}>
                <img src={d.src} alt={d.name} loading="lazy" />
                <figcaption>{t(d.name, d.ja)}</figcaption>
              </figure>
            ))}
          </div>
          <p className="small">{t('Designs change as we make new ones. We pick yours at random when we pack your order.', 'デザインは新作ができるたびに変わります。ご注文を梱包するときに、ランダムで選びます。')}</p>
        </div>
      </section>
    </Layout>
  );
}
