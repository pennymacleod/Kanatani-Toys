import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { sounds } from '../lib/gachaSounds';

// Kanatanimon vending machine (Penny, 26 Nov 2026). The orange guy and the dog
// walk up, the orange guy jumps on the dog to reach the coin slot, a KT capsule
// drops out and pops open to show a tiny vintage figure.
// TEST VERSION: the prizes below are made-up monsters until Penny sends photos
// of the real figures. £5 a go or 3 goes for £12, plus postage, once it's live.
// Not in the nav and noindex while it's a test.
const TEST = true;

const PRIZES = [
  { id: 'mochi', name: 'Mochi-chan', body: '#FFF4D6', shape: 'blob' },
  { id: 'kappa', name: 'Kappa-kun', body: '#5BD34A', shape: 'round', extra: 'plate' },
  { id: 'tofu', name: 'Tofu Ghost', body: '#ffffff', shape: 'ghost' },
  { id: 'ebi', name: 'Spicy Ebi', body: '#FF7417', shape: 'tall', extra: 'horns' },
  { id: 'yeti', name: 'Mossy Yeti', body: '#3FB7F0', shape: 'fluffy' },
  { id: 'tanuki', name: 'Lucky Tanuki', body: '#9b6b43', shape: 'round', extra: 'ears' },
  { id: 'ume', name: 'Ume Bat', body: '#9b59d0', shape: 'blob', extra: 'wings' },
  { id: 'slug', name: 'Sparkle Slug', body: '#FF1F8F', shape: 'tall', extra: 'stars' },
];

function Monster({ p, size = 120 }) {
  const shapes = {
    blob: 'M20 70 C10 30 40 10 60 12 C85 10 112 30 100 72 C96 98 24 100 20 70Z',
    round: 'M60 14 C92 14 106 40 104 64 C102 92 82 104 60 104 C38 104 18 92 16 64 C14 40 28 14 60 14Z',
    ghost: 'M24 104 L24 52 C24 26 42 12 60 12 C78 12 96 26 96 52 L96 104 L84 94 L72 104 L60 94 L48 104 L36 94Z',
    tall: 'M36 104 C26 80 28 30 60 14 C92 30 94 80 84 104Z',
    fluffy: 'M20 70 Q14 60 22 52 Q16 40 28 34 Q28 20 44 20 Q52 8 64 14 Q78 8 84 20 Q100 20 98 36 Q108 44 100 54 Q108 66 98 74 Q102 92 84 94 Q76 106 62 100 Q48 108 40 98 Q22 100 24 86 Q12 82 20 70Z',
  };
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
      <ellipse cx="60" cy="108" rx="34" ry="6" fill="#000" opacity=".15" />
      {p.extra === 'wings' && <path d="M22 50 L2 34 L8 62 Z M98 50 L118 34 L112 62 Z" fill={p.body} stroke="#141018" strokeWidth="4" strokeLinejoin="round" />}
      {p.extra === 'ears' && <><circle cx="34" cy="22" r="10" fill={p.body} stroke="#141018" strokeWidth="4" /><circle cx="86" cy="22" r="10" fill={p.body} stroke="#141018" strokeWidth="4" /></>}
      {p.extra === 'horns' && <path d="M46 26 L40 6 L54 20 M74 26 L80 6 L66 20" fill="#F2B705" stroke="#141018" strokeWidth="4" strokeLinejoin="round" />}
      <path d={shapes[p.shape]} fill={p.body} stroke="#141018" strokeWidth="4" strokeLinejoin="round" />
      {p.extra === 'plate' && <ellipse cx="60" cy="18" rx="20" ry="6" fill="#FFF4D6" stroke="#141018" strokeWidth="3" />}
      {p.extra === 'ears' && <ellipse cx="60" cy="62" rx="30" ry="14" fill="#5a3a22" opacity=".5" />}
      <circle cx="46" cy="56" r="9" fill="#fff" stroke="#141018" strokeWidth="3" /><circle cx="74" cy="56" r="9" fill="#fff" stroke="#141018" strokeWidth="3" />
      <circle cx="48" cy="58" r="4" fill="#141018" /><circle cx="72" cy="58" r="4" fill="#141018" />
      <path d="M48 78 Q60 88 72 78" fill="none" stroke="#141018" strokeWidth="4" strokeLinecap="round" />
      <circle cx="36" cy="72" r="5" fill="#FF1F8F" opacity=".45" /><circle cx="84" cy="72" r="5" fill="#FF1F8F" opacity=".45" />
      {p.extra === 'stars' && <text x="88" y="30" fontSize="20">✨</text>}
    </svg>
  );
}

function Capsule({ open }) {
  return (
    <svg viewBox="0 0 100 100" className={`cap${open ? ' open' : ''}`} aria-hidden="true">
      <g className="bot"><path d="M8 52 A42 42 0 0 0 92 52 Z" fill="#FFD21F" stroke="#141018" strokeWidth="5" /></g>
      <g className="top">
        <path d="M8 48 A42 42 0 0 1 92 48 Z" fill="#FF1F8F" stroke="#141018" strokeWidth="5" />
        <ellipse cx="34" cy="26" rx="10" ry="6" fill="#fff" opacity=".55" />
      </g>
      <g className="band">
        <rect x="6" y="45" width="88" height="10" rx="3" fill="#141018" />
        <circle cx="50" cy="50" r="15" fill="#FFF4D6" stroke="#141018" strokeWidth="5" />
        <text x="50" y="56" textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight="900" fontSize="15" fill="#141018">KT</text>
      </g>
    </svg>
  );
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const X = (v) => `${(v / 1080) * 100}%`;
const Y = (v) => `${(v / 1350) * 100}%`;

const START = { orange: { x: -300, y: 960, walk: false, ms: 0 }, dog: { x: 1150, walk: false, ms: 0 } };

export default function Kanatanimon() {
  const [orange, setOrange] = useState(START.orange);
  const [dog, setDog] = useState(START.dog);
  const [coin, setCoin] = useState(null);       // {x,y,s}
  const [flash, setFlash] = useState(false);
  const [caps, setCaps] = useState([]);          // [{x,y,r,ms,big,open}]
  const [won, setWon] = useState(null);          // [prize...]
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const sfx = (fn) => { if (!mutedRef.current) try { fn(); } catch (e) { /* no audio */ } };

  useEffect(() => { try { const m = localStorage.getItem('kanatani-gacha-muted') === '1'; setMuted(m); mutedRef.current = m; } catch (e) { /* ignore */ } }, []);
  const toggleMute = () => { const m = !muted; setMuted(m); mutedRef.current = m; try { localStorage.setItem('kanatani-gacha-muted', m ? '1' : '0'); } catch (e) { /* ignore */ } };

  const play = async (goes) => {
    if (busy) return;
    setBusy(true); setWon(null); setCaps([]);
    setOrange(START.orange); setDog(START.dog);
    await wait(60);
    // 1. walk over
    setDog({ x: 700, walk: true, ms: 1700 });
    setOrange({ x: 470, y: 960, walk: true, ms: 1700 });
    await wait(1750);
    setDog(d => ({ ...d, walk: false })); setOrange(o => ({ ...o, walk: false }));
    // 2. jump on the dog
    sfx(sounds.slide);
    setOrange({ x: 640, y: 640, walk: false, ms: 320 }); await wait(330);
    setOrange({ x: 745, y: 748, walk: false, ms: 260 }); await wait(300);
    sfx(sounds.drop);
    // 3. coin(s) in
    for (let g = 0; g < goes; g++) {
      setCoin({ x: 830, y: 860, s: 1, ms: 0 }); await wait(40);
      setCoin({ x: 870, y: 915, s: 0.4, ms: 380 }); await wait(400);
      sfx(sounds.clunk); setCoin(null); await wait(150);
    }
    // 4. button + machine rumble
    setFlash(true); sfx(sounds.crank); await wait(900); setFlash(false);
    // 5. capsules drop out of the flap and roll forward
    const out = [];
    for (let g = 0; g < goes; g++) {
      const prize = PRIZES[Math.floor(Math.random() * PRIZES.length)];
      out.push(prize);
      const tx = goes === 1 ? 540 : 360 + g * 180;
      setCaps(c => [...c, { x: 810, y: 975, r: 0, ms: 0, big: false, open: false }]); await wait(40);
      sfx(sounds.drop);
      setCaps(c => c.map((cp, i) => i === g ? { ...cp, y: 1040, ms: 250 } : cp)); await wait(280);
      setCaps(c => c.map((cp, i) => i === g ? { ...cp, x: tx, y: 1200, r: 720, ms: 900 } : cp)); await wait(450);
    }
    await wait(600);
    // orange hops down
    setOrange({ x: 470, y: 960, walk: false, ms: 400 });
    // 6. grow, wobble, pop
    setCaps(c => c.map((cp, i) => ({ ...cp, x: goes === 1 ? 540 : 270 + i * 270, y: 640, big: true, r: 0, ms: 600 })));
    await wait(1300);
    sfx(sounds.pop);
    setCaps(c => c.map(cp => ({ ...cp, open: true })));
    await wait(350);
    sfx(goes > 1 ? sounds.rare : sounds.common);
    setWon(out);
    setBusy(false);
  };

  return (
    <Layout title="Kanatanimon — Kanatani Toys" description="The Kanatanimon vending machine: drop a coin and win a tiny vintage monster." path="/kanatanimon" page="kmon">
      <Head><meta name="robots" content="noindex" /></Head>
      <section className="floor">
        <div className="wrap kwrap">
          {TEST && <div className="ktest">TEST VERSION · made-up prizes · nothing is added to your basket</div>}
          <div className="kstage">
            <img className="kbg" src="/nl/kanatanimon/machine.jpg" alt="The Kanatanimon vending machines" />
            {flash && <span className="kflash" style={{ left: X(650), top: Y(955), width: X(320), height: Y(70) }} />}
            {flash && <span className="kflash coinflash" style={{ left: X(800), top: Y(895), width: X(140), height: Y(40) }} />}
            <img className={`kdog${dog.walk ? ' walking' : ''}`} src="/nl/kanatanimon/dog.png" alt=""
              style={{ left: X(dog.x), top: Y(1044), width: X(360), transition: `left ${dog.ms}ms linear` }} />
            <img className={`korange${orange.walk ? ' walking' : ''}`} src="/nl/kanatanimon/orange.png" alt=""
              style={{ left: X(orange.x), top: Y(orange.y), width: X(215), transition: `left ${orange.ms}ms ease-out, top ${orange.ms}ms ${orange.y < 700 ? 'ease-out' : 'ease-in'}` }} />
            {coin && <span className="kcoin" style={{ left: X(coin.x), top: Y(coin.y), transform: `translate(-50%,-50%) scale(${coin.s})`, transition: `all ${coin.ms}ms ease-in` }}>£</span>}
            {caps.map((c, i) => (
              <div key={i} className={`kcap${c.big ? ' big' : ''}${c.big && !c.open ? ' wobble' : ''}`}
                style={{ left: X(c.x), top: Y(c.y), transform: `translate(-50%,-50%) rotate(${c.r}deg)`, transition: `left ${c.ms}ms ease-out, top ${c.ms}ms ease-out, transform ${c.ms}ms ease-out, width 600ms, height 600ms` }}>
                <Capsule open={c.open} />
                {c.open && won && won[i] && <div className="kprize"><Monster p={won[i]} size={200} /></div>}
              </div>
            ))}
            {won && (
              <div className="kwon">
                <div className="kwoncard">
                  <div className="kburst" aria-hidden="true" />
                  <h2>{won.length > 1 ? 'You won 3 mini monsters!' : 'You won a mini monster!'}</h2>
                  <div className="kwonrow">{won.map((p, i) => <figure key={i}><Monster p={p} size={won.length > 1 ? 96 : 150} /><figcaption>{p.name}</figcaption></figure>)}</div>
                  {TEST && <p className="small">Test prize. The real tiny vintage figures go in here soon!</p>}
                  <button className="btn" type="button" onClick={() => { setWon(null); setCaps([]); setOrange(START.orange); setDog(START.dog); }}>Play again</button>
                </div>
              </div>
            )}
          </div>
          <div className="kbtns">
            <button className="btn kplay" type="button" disabled={busy} onClick={() => play(1)}>{busy ? 'Here it comes…' : 'Drop a coin · £5'}</button>
            <button className="btn kplay3" type="button" disabled={busy} onClick={() => play(3)}>3 goes · £12</button>
            <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? '🔇 Sound off' : '🔊 Sound on'}</button>
          </div>
          <p className="khint">Every go wins a tiny vintage monster, posted to you. Plus postage.</p>
        </div>
      </section>
      <style jsx global>{`
        .pg-kmon .kwrap{padding-block:30px 50px;max-width:760px;margin:0 auto;text-align:center}
        .pg-kmon .ktest{display:inline-block;background:var(--ink);color:#FFD21F;font-weight:800;border-radius:999px;padding:6px 16px;margin-bottom:14px;font-size:14px}
        .pg-kmon .kstage{position:relative;width:100%;aspect-ratio:1080/1350;border:5px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:8px 8px 0 var(--ink);background:#cfd2d6}
        .pg-kmon .kbg{position:absolute;inset:0;width:100%;height:100%;display:block}
        .pg-kmon .kdog,.pg-kmon .korange{position:absolute;height:auto;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35));pointer-events:none}
        .pg-kmon .walking{animation:kbob .28s ease-in-out infinite alternate}
        @keyframes kbob{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-3%) rotate(2deg)}}
        .pg-kmon .kcoin{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:#FFD21F;border:3px solid var(--ink);display:grid;place-items:center;font-weight:900;font-family:Rubik,sans-serif;font-size:clamp(10px,2.2vw,18px)}
        .pg-kmon .kflash{position:absolute;border-radius:10px;background:rgba(255,255,255,.55);box-shadow:0 0 30px 10px #FFD21F;animation:kfl .15s steps(2) infinite}
        @keyframes kfl{50%{opacity:.2}}
        .pg-kmon .kcap{position:absolute;width:9%;aspect-ratio:1}
        .pg-kmon .kcap.big{width:34%}
        .pg-kmon .kcap .cap{width:100%;height:100%;overflow:visible}
        .pg-kmon .kcap.wobble .cap{animation:kwob .18s ease-in-out infinite alternate}
        @keyframes kwob{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
        .pg-kmon .cap .top,.pg-kmon .cap .band{transition:transform .5s cubic-bezier(.2,1.6,.4,1),opacity .5s;transform-origin:50% 50%}
        .pg-kmon .cap.open .top{transform:translate(-30px,-70px) rotate(-40deg);opacity:0}
        .pg-kmon .cap.open .band{opacity:0}
        .pg-kmon .cap.open .bot{transform:translateY(40px);opacity:0;transition:transform .5s,opacity .5s}
        .pg-kmon .kprize{position:absolute;inset:-20%;display:grid;place-items:center;animation:kpop .45s cubic-bezier(.2,1.8,.4,1)}
        .pg-kmon .kprize svg{width:100%;height:100%}
        @keyframes kpop{from{transform:scale(.2)}to{transform:scale(1)}}
        .pg-kmon .kwon{position:absolute;inset:0;display:grid;place-items:end center;padding:4%;background:linear-gradient(transparent 40%,rgba(20,16,24,.55))}
        .pg-kmon .kwoncard{position:relative;background:var(--cream);border:4px solid var(--ink);border-radius:18px;box-shadow:6px 6px 0 var(--ink);padding:14px 18px 18px;width:92%;animation:kpop .4s}
        .pg-kmon .kwoncard h2{font-family:'Bagel Fat One',Rubik,sans-serif;color:var(--pink);margin:4px 0 8px;font-size:clamp(20px,4vw,32px)}
        .pg-kmon .kwonrow{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
        .pg-kmon .kwonrow figure{margin:0;font-weight:800}
        .pg-kmon .kwoncard .small{font-size:14px;margin:6px 0 10px}
        .pg-kmon .kbtns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:22px}
        .pg-kmon .kplay{background:var(--pink);color:#fff}
        .pg-kmon .kplay3{background:var(--sky);color:var(--ink)}
        .pg-kmon .khint{font-weight:700;margin-top:12px}
      `}</style>
    </Layout>
  );
}
