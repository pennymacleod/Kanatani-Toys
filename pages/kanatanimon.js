import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { sounds } from '../lib/gachaSounds';

// Kanatanimon vending machines (Penny, 26 Nov 2026).
// Play: pick 1 go (£5) or 3 goes (£12) → tap the red or blue machine → drag the
// coin into its slot (the orange guy jumps up and pushes it in) → tap a lit
// button under a pack (green = in stock, red = sold out) → a KT capsule drops
// out of the TAKE OUT hole → tap it 3 times to crack it open → prize.
// TEST VERSION: made-up monsters until Penny sends photos of the real tiny
// vintage Pokémon figures; nothing goes in the basket. Not in the nav, noindex.
// Coordinates are in the 1080×1350 design of public/nl/kanatanimon/machine.jpg.
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

const MACHINES = {
  red: { name: 'red', slot: { x: 507, y: 495 }, flap: { x: 250, y: 990 }, box: { x: 40, y: 250, w: 520, h: 850 }, x0: 70, w: 390 },
  blue: { name: 'blue', slot: { x: 870, y: 915 }, flap: { x: 810, y: 990 }, box: { x: 580, y: 250, w: 460, h: 850 }, x0: 610, w: 400 },
};
// Price tag positions (matching the drawing): 3 rows × 7 per machine.
const tagsFor = (m) => {
  const out = [];
  for (let r = 0; r < 3; r++) for (let i = 0; i < 7; i++) {
    out.push({ key: `${m.name}-${r}-${i}`, x: m.x0 + 22 + i * ((m.w - 44) / 6), y: 385 + r * 118 + 92 });
  }
  return out;
};
const ALL_TAGS = [...tagsFor(MACHINES.red), ...tagsFor(MACHINES.blue)];

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

function Capsule({ cracks = 0, open }) {
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
      <g className="cracks" fill="none" stroke="#141018" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {cracks >= 1 && <path d="M70 20 L64 30 L72 36 L66 46" />}
        {cracks >= 2 && <path d="M24 64 L32 70 L26 78 L34 86" />}
        {cracks >= 2 && <path d="M40 14 L46 24 L40 30" />}
      </g>
    </svg>
  );
}

const wait = (ms) => new Promise(r => setTimeout(r, ms));
const X = (v) => `${(v / 1080) * 100}%`;
const Y = (v) => `${(v / 1350) * 100}%`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const HOME = { orange: { x: 380, y: 960, ms: 0, walk: false }, dog: { x: 640, ms: 0, walk: false, spin: false } };
const ORANGE_W = 215, ORANGE_H = 366;

// Chasing lights around the sign (design rect 70,40 → 1010,210).
const BULBS = (() => {
  const out = [], x0 = 78, y0 = 48, x1 = 1002, y1 = 202, step = 36;
  for (let x = x0; x < x1; x += step) out.push([x, y0]);
  for (let y = y0; y < y1; y += step) out.push([x1, y]);
  for (let x = x1; x > x0; x -= step) out.push([x, y1]);
  for (let y = y1; y > y0; y -= step) out.push([x0, y]);
  return out;
})();

export default function Kanatanimon() {
  const stageRef = useRef(null);
  const [stage, setStage] = useState('start'); // start | pick | coin | button | drop | crack | won
  const [goes, setGoes] = useState(1);
  const [machine, setMachine] = useState(null);
  const [orange, setOrange] = useState(HOME.orange);
  const [dog, setDog] = useState(HOME.dog);
  const [soldOut, setSoldOut] = useState({});
  const [pressed, setPressed] = useState([]);
  const [coin, setCoin] = useState(null);       // {x,y,drag,ms,s}
  const [money, setMoney] = useState(0);
  const [rumble, setRumble] = useState(false);
  const [caps, setCaps] = useState([]);         // [{x,y,s,r,ms,cracks,open,prize}]
  const [msg, setMsg] = useState('Pick 1 go or 3 goes to start!');
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const busyRef = useRef(false);
  const sfx = (name) => { if (!mutedRef.current && sounds[name]) try { sounds[name](); } catch (e) { /* no audio */ } };

  useEffect(() => {
    try { const m = localStorage.getItem('kanatani-gacha-muted') === '1'; setMuted(m); mutedRef.current = m; } catch (e) { /* ignore */ }
    const s = {}; ALL_TAGS.forEach(t => { s[t.key] = Math.random() < 0.25; }); setSoldOut(s);
  }, []);
  const toggleMute = () => { const m = !muted; setMuted(m); mutedRef.current = m; try { localStorage.setItem('kanatani-gacha-muted', m ? '1' : '0'); } catch (e) { /* ignore */ } };

  const reset = () => {
    setStage('start'); setMachine(null); setOrange(HOME.orange); setDog(HOME.dog); setPressed([]);
    setCoin(null); setMoney(0); setCaps([]); setMsg('Pick 1 go or 3 goes to start!');
  };

  // 1. how many goes
  const start = (n) => {
    if (busyRef.current) return;
    reset(); setGoes(n); setStage('pick');
    setMsg('Which machine? Tap the red one or the blue one!');
  };

  // 2. choose a machine: the characters walk over to it
  const choose = async (name) => {
    if (stage !== 'pick' || busyRef.current) return;
    busyRef.current = true;
    const m = MACHINES[name]; setMachine(name); sfx('slide');
    const ox = Math.max(20, Math.min(1080 - ORANGE_W - 10, m.slot.x - 150));
    const dx = name === 'red' ? ox + 170 : ox - 330;
    setOrange({ x: ox, y: 960, ms: 900, walk: true });
    setDog({ x: Math.max(0, Math.min(720, dx)), ms: 900, walk: true, spin: false });
    await wait(950);
    setOrange(o => ({ ...o, walk: false })); setDog(d => ({ ...d, walk: false }));
    setCoin({ x: name === 'red' ? 300 : 760, y: 1240, ms: 0, s: 1, drag: false });
    setStage('coin'); setMsg('Drag the coin into the glowing slot!');
    busyRef.current = false;
  };

  // 3. coin drag
  const toDesign = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * 1080, y: ((e.clientY - r.top) / r.height) * 1350 };
  };
  const onCoinDown = (e) => {
    if (stage !== 'coin') return;
    e.preventDefault(); e.currentTarget.setPointerCapture?.(e.pointerId);
    setCoin(c => ({ ...c, drag: true, ms: 0 }));
  };
  const onCoinMove = (e) => { if (coin?.drag) { const p = toDesign(e); setCoin(c => ({ ...c, x: p.x, y: p.y })); } };
  const onCoinUp = (e) => {
    if (!coin?.drag) return;
    const p = toDesign(e); const m = MACHINES[machine];
    if (Math.hypot(p.x - m.slot.x, p.y - m.slot.y) < 110) insertCoin();
    else setCoin({ x: machine === 'red' ? 300 : 760, y: 1240, ms: 300, s: 1, drag: false });
  };
  const insertCoin = async () => {
    if (busyRef.current || stage !== 'coin') return;
    busyRef.current = true;
    const m = MACHINES[machine];
    // the orange guy jumps up and pushes it in
    setOrange(o => ({ ...o, y: m.slot.y - 200, ms: 320, walk: false }));
    setCoin({ x: m.slot.x, y: m.slot.y, ms: 250, s: 0.35, drag: false });
    sfx('slide'); await wait(330);
    sfx('clunk'); setCoin(null); setMoney(goes === 3 ? 12 : 5);
    setOrange(o => ({ ...o, y: 960, ms: 380 })); await wait(400);
    sfx('drop');
    setStage('button'); setPressed([]);
    setMsg(goes === 3 ? 'Now press 3 green buttons under the packs you want!' : 'Now press a green button under the pack you want!');
    busyRef.current = false;
  };

  // 4. press buttons (green = in stock)
  const press = async (t) => {
    if (stage !== 'button' || busyRef.current || soldOut[t.key] || pressed.includes(t.key) || !t.key.startsWith(machine)) return;
    sfx('ping');
    const np = [...pressed, t.key]; setPressed(np);
    if (np.length < goes) { setMsg(`${goes - np.length} more to press!`); return; }
    busyRef.current = true;
    setStage('drop'); setMsg('Here it comes…');
    setRumble(true); sfx('crank'); await wait(1000); setRumble(false);
    const m = MACHINES[machine];
    const out = [];
    for (let g = 0; g < goes; g++) {
      const prize = pick(PRIZES);
      out.push(prize);
      // capsule pops out of the TAKE OUT hole, bounces, rolls to the front
      setCaps(c => [...c, { x: m.flap.x, y: m.flap.y, s: 0.5, r: 0, ms: 0, cracks: 0, open: false, prize, shake: false }]);
      await wait(40);
      sfx('drop');
      setCaps(c => c.map((cp, i) => i === g ? { ...cp, y: m.flap.y + 70, s: 1, ms: 260 } : cp)); await wait(300);
      const tx = goes === 1 ? 540 : 270 + g * 270;
      setCaps(c => c.map((cp, i) => i === g ? { ...cp, x: tx, y: 1190, r: 540, ms: 800 } : cp)); await wait(450);
    }
    await wait(500);
    setCaps(c => c.map(cp => ({ ...cp, y: 760, s: goes === 1 ? 3.2 : 2.3, r: 0, ms: 600 })));
    await wait(650);
    setStage('crack'); setMsg(goes === 3 ? 'Tap each capsule 3 times to crack it open!' : 'Tap the capsule 3 times to crack it open!');
    busyRef.current = false;
  };

  // 5. crack open
  const tapCap = async (i) => {
    if (stage !== 'crack') return;
    const cp = caps[i]; if (!cp || cp.open) return;
    const cracks = cp.cracks + 1;
    if (cracks < 3) {
      sfx('clunk');
      setCaps(c => c.map((x, j) => j === i ? { ...x, cracks, shake: true } : x));
      setTimeout(() => setCaps(c => c.map((x, j) => j === i ? { ...x, shake: false } : x)), 300);
      return;
    }
    sfx('pop');
    const next = caps.map((x, j) => j === i ? { ...x, cracks, open: true } : x);
    setCaps(next);
    if (next.every(x => x.open)) {
      await wait(500);
      sfx(goes === 3 ? 'rare' : 'common');
      setDog(d => ({ ...d, spin: true }));
      setOrange(o => ({ ...o, y: 900, ms: 200 })); await wait(220); setOrange(o => ({ ...o, y: 960, ms: 200 }));
      setStage('won');
      setMsg(goes === 3 ? 'You won 3 vintage figures!' : 'You won a vintage figure!');
    }
  };

  const m = machine ? MACHINES[machine] : null;
  const won = stage === 'won' ? caps.map(c => c.prize) : null;

  return (
    <Layout title="Kanatanimon — Kanatani Toys" description="The Kanatanimon vending machine: every go wins a random tiny vintage Pokémon figure." path="/kanatanimon" page="kmon">
      <Head><meta name="robots" content="noindex" /></Head>
      <section className="floor">
        <div className="wrap kwrap">
          {TEST && <div className="ktest">TEST VERSION · made-up prizes · nothing is added to your basket</div>}
          <h1 className="big ktitle">Kanatanimon!</h1>
          <p className="kintro">Every go wins a <b>random vintage Pokémon figure</b>, posted to you. <b>£5</b> a go, or <b>3 goes for £12</b>, plus postage.</p>

          <div className={`kstage${rumble ? ' rumble' : ''}`} ref={stageRef} onPointerMove={onCoinMove} onPointerUp={onCoinUp}>
            <img className="kbg" src="/nl/kanatanimon/machine.jpg" alt="The Kanatanimon vending machines" draggable="false" />

            {/* sign: flashing glow + chasing bulbs */}
            <span className="ksignglow" style={{ left: X(110), top: Y(62), width: X(860), height: Y(110) }} />
            {BULBS.map(([bx, by], i) => <span key={i} className="kbulb" style={{ left: X(bx), top: Y(by), animationDelay: `${-(i % 6) * 0.1}s` }} />)}

            {/* shelf lights / buttons */}
            {ALL_TAGS.map(t => {
              const out = soldOut[t.key];
              const live = stage === 'button' && machine && t.key.startsWith(machine) && !out;
              const on = pressed.includes(t.key);
              return <button key={t.key} type="button" aria-label={out ? 'Sold out' : 'Choose this pack'}
                className={`klight${out ? ' out' : ''}${live ? ' live' : ''}${on ? ' on' : ''}`}
                style={{ left: X(t.x - 22), top: Y(t.y - 2), width: X(44), height: Y(18) }}
                onClick={() => press(t)} disabled={!live} />;
            })}

            {/* pick a machine */}
            {stage === 'pick' && Object.values(MACHINES).map(mm => (
              <button key={mm.name} type="button" className={`kpick k-${mm.name}`} onClick={() => choose(mm.name)}
                style={{ left: X(mm.box.x), top: Y(mm.box.y), width: X(mm.box.w), height: Y(mm.box.h) }}>
                <span>Pick me!</span>
              </button>
            ))}

            {/* money display (red machine) */}
            {machine === 'red' && money > 0 && <span className="kmoney" style={{ left: X(486), top: Y(392), width: X(42), height: Y(58) }}>£{money}</span>}
            {machine === 'blue' && money > 0 && <span className="kmoney blue" style={{ left: X(800), top: Y(860), width: X(140), height: Y(30) }}>£{money} IN</span>}

            {/* glowing coin slot */}
            {stage === 'coin' && m && <button type="button" className="kslot" aria-label="Coin slot" onClick={insertCoin}
              style={{ left: X(m.slot.x - 45), top: Y(m.slot.y - 45), width: X(90), height: Y(90) }} />}

            {/* TAKE OUT flap glow while dropping */}
            {stage === 'drop' && m && <span className="kflap" style={{ left: X(m.flap.x - 120), top: Y(m.flap.y - 35), width: X(240), height: Y(70) }} />}

            <img className={`kdog${dog.walk ? ' walking' : ''}${dog.spin ? ' spin' : ''}`} src="/nl/kanatanimon/dog.png" alt="" draggable="false"
              style={{ left: X(dog.x), top: Y(1044), width: X(360), transition: `left ${dog.ms}ms linear` }} />
            <img className={`korange${orange.walk ? ' walking' : ''}`} src="/nl/kanatanimon/orange.png" alt="" draggable="false"
              style={{ left: X(orange.x), top: Y(orange.y), width: X(ORANGE_W), transition: `left ${orange.ms}ms linear, top ${orange.ms}ms ${orange.y < 960 ? 'ease-out' : 'ease-in'}` }} />

            {coin && <span className={`kcoin${stage === 'coin' ? ' grab' : ''}`} onPointerDown={onCoinDown}
              style={{ left: X(coin.x), top: Y(coin.y), transform: `translate(-50%,-50%) scale(${coin.s})`, transition: coin.drag ? 'none' : `all ${coin.ms}ms ease-in` }}>
              £{goes === 3 ? 12 : 5}
            </span>}

            {caps.map((c, i) => (
              <button key={i} type="button" className={`kcap${c.shake ? ' shake' : ''}${stage === 'crack' && !c.open ? ' tap' : ''}`}
                onClick={() => tapCap(i)} aria-label="Crack the capsule"
                style={{ left: X(c.x), top: Y(c.y), transform: `translate(-50%,-50%) scale(${c.s}) rotate(${c.r}deg)`, transition: `left ${c.ms}ms ease-out, top ${c.ms}ms ease-out, transform ${c.ms}ms ease-out` }}>
                <Capsule cracks={c.cracks} open={c.open} />
                {c.open && <span className="kprize"><Monster p={c.prize} size={120} /></span>}
              </button>
            ))}

            {won && (
              <div className="kwon">
                <div className="kwoncard">
                  <h2>{won.length > 1 ? 'You won 3 vintage figures!' : 'You won a vintage figure!'}</h2>
                  <div className="kwonrow">{won.map((p, i) => <figure key={i}><Monster p={p} size={won.length > 1 ? 90 : 140} /><figcaption>{p.name}</figcaption></figure>)}</div>
                  {TEST && <p className="small">Test prize. The real tiny vintage Pokémon figures go in here soon!</p>}
                  <button className="btn" type="button" onClick={reset}>Play again</button>
                </div>
              </div>
            )}
          </div>

          <p className="khint" aria-live="polite">{msg}</p>
          <div className="kbtns">
            <button className="btn kplay" type="button" onClick={() => start(1)}>1 go · £5</button>
            <button className="btn kplay3" type="button" onClick={() => start(3)}>3 goes · £12</button>
            <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? '🔇 Sound off' : '🔊 Sound on'}</button>
          </div>
        </div>
      </section>
      <style jsx global>{`
        .pg-kmon .kwrap{padding-block:26px 50px;max-width:760px;margin:0 auto;text-align:center}
        .pg-kmon .ktest{display:inline-block;background:var(--ink);color:#FFD21F;font-weight:800;border-radius:999px;padding:6px 16px;margin-bottom:8px;font-size:14px}
        .pg-kmon .ktitle{color:var(--pink);font-size:clamp(40px,7vw,72px);margin:6px 0 4px}
        .pg-kmon .kintro{font-size:18px;font-weight:600;margin:0 auto 16px;max-width:34em}
        .pg-kmon .kstage{position:relative;width:100%;aspect-ratio:1080/1350;border:5px solid var(--ink);border-radius:18px;overflow:hidden;box-shadow:8px 8px 0 var(--ink);background:#cfd2d6;touch-action:none;user-select:none;-webkit-user-select:none}
        .pg-kmon .kstage.rumble{animation:krum .08s linear infinite}
        @keyframes krum{0%{transform:translate(0,0)}25%{transform:translate(2px,-1px)}50%{transform:translate(-2px,1px)}75%{transform:translate(1px,2px)}}
        .pg-kmon .kbg{position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none}
        .pg-kmon .ksignglow{position:absolute;border-radius:20px;background:radial-gradient(ellipse at center,rgba(255,240,150,.55),rgba(255,210,31,0) 70%);mix-blend-mode:screen;animation:kglow 1s steps(1) infinite;pointer-events:none}
        @keyframes kglow{0%{opacity:1}50%{opacity:.15}}
        .pg-kmon .kbulb{position:absolute;width:1.3%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:#FFF4D6;box-shadow:0 0 6px 2px #FFD21F;animation:kchase .6s steps(1) infinite;pointer-events:none}
        @keyframes kchase{0%{background:#fff;box-shadow:0 0 10px 4px #FFD21F}50%{background:#7a6a3a;box-shadow:none}}
        .pg-kmon .klight{position:absolute;border:0;padding:0;background:transparent;border-radius:4px;cursor:default}
        .pg-kmon .klight::after{content:'';position:absolute;right:4%;top:50%;width:22%;aspect-ratio:1;border-radius:50%;transform:translateY(-50%);background:#5BD34A;box-shadow:0 0 6px 2px rgba(91,211,74,.8)}
        .pg-kmon .klight.out::after{background:#ff3b30;box-shadow:0 0 6px 2px rgba(255,59,48,.8)}
        .pg-kmon .klight.live{cursor:pointer;outline:3px solid #5BD34A;outline-offset:1px;animation:klive .7s ease-in-out infinite alternate}
        @keyframes klive{from{box-shadow:0 0 0 0 rgba(91,211,74,.0)}to{box-shadow:0 0 12px 4px rgba(91,211,74,.9)}}
        .pg-kmon .klight.on{outline:3px solid #FFD21F;background:rgba(255,210,31,.5)}
        .pg-kmon .kpick{position:absolute;border:0;background:transparent;border-radius:16px;cursor:pointer;animation:kpickglow .8s ease-in-out infinite alternate}
        .pg-kmon .kpick.k-red{--g:255,31,143}.pg-kmon .kpick.k-blue{--g:63,183,240}
        @keyframes kpickglow{from{box-shadow:inset 0 0 0 4px rgba(var(--g),.4),0 0 0 0 rgba(var(--g),0)}to{box-shadow:inset 0 0 0 8px rgba(var(--g),1),0 0 24px 6px rgba(var(--g),.8)}}
        .pg-kmon .kpick span{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%) rotate(-6deg);background:#FFD21F;color:var(--ink);border:4px solid var(--ink);border-radius:999px;padding:6px 16px;font-family:Rubik,sans-serif;font-weight:900;font-size:clamp(14px,3vw,26px);box-shadow:4px 4px 0 var(--ink);white-space:nowrap}
        .pg-kmon .kmoney{position:absolute;display:grid;place-items:center;background:#141018;color:#5BD34A;font-family:Rubik,sans-serif;font-weight:900;font-size:clamp(9px,1.8vw,16px);border-radius:6px;pointer-events:none}
        .pg-kmon .kmoney.blue{background:#141018;border:2px solid #5BD34A}
        .pg-kmon .kslot{position:absolute;border:0;border-radius:50%;background:transparent;cursor:pointer;animation:kslot .6s ease-in-out infinite alternate}
        @keyframes kslot{from{box-shadow:0 0 0 3px rgba(255,210,31,.6)}to{box-shadow:0 0 0 8px rgba(255,210,31,1),0 0 30px 10px rgba(255,210,31,.8)}}
        .pg-kmon .kflap{position:absolute;border-radius:12px;box-shadow:0 0 30px 10px #FFD21F;animation:kglow .2s steps(1) infinite;pointer-events:none}
        .pg-kmon .kdog,.pg-kmon .korange{position:absolute;height:auto;filter:drop-shadow(0 6px 6px rgba(0,0,0,.35));pointer-events:none}
        .pg-kmon .walking{animation:kbob .26s ease-in-out infinite alternate}
        @keyframes kbob{from{transform:translateY(0) rotate(-2deg)}to{transform:translateY(-3%) rotate(2deg)}}
        .pg-kmon .kdog.spin{animation:kspin .8s ease-in-out 2}
        @keyframes kspin{0%{transform:rotateY(0) translateY(0)}50%{transform:rotateY(180deg) translateY(-12%)}100%{transform:rotateY(360deg) translateY(0)}}
        .pg-kmon .kcoin{position:absolute;width:9%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3a6,#FFD21F 45%,#d9a400);border:4px solid var(--ink);display:grid;place-items:center;font-weight:900;font-family:Rubik,sans-serif;font-size:clamp(11px,2.4vw,22px);color:var(--ink);z-index:5;touch-action:none}
        .pg-kmon .kcoin.grab{cursor:grab;animation:kcoinb .5s ease-in-out infinite alternate}
        @keyframes kcoinb{to{box-shadow:0 0 0 6px rgba(255,255,255,.7)}}
        .pg-kmon .kcap{position:absolute;width:9%;aspect-ratio:1;border:0;padding:0;background:transparent;z-index:6}
        .pg-kmon .kcap.tap{cursor:pointer}
        .pg-kmon .kcap.tap .cap{animation:kwob .5s ease-in-out infinite alternate}
        .pg-kmon .kcap.shake .cap{animation:kshake .3s linear}
        @keyframes kwob{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}
        @keyframes kshake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8%) rotate(-10deg)}60%{transform:translateX(8%) rotate(10deg)}}
        .pg-kmon .kcap .cap{width:100%;height:100%;overflow:visible;display:block}
        .pg-kmon .cap .top,.pg-kmon .cap .band,.pg-kmon .cap .bot,.pg-kmon .cap .cracks{transition:transform .5s cubic-bezier(.2,1.6,.4,1),opacity .5s}
        .pg-kmon .cap.open .top{transform:translate(-30px,-70px) rotate(-40deg);opacity:0}
        .pg-kmon .cap.open .band,.pg-kmon .cap.open .cracks{opacity:0}
        .pg-kmon .cap.open .bot{transform:translateY(40px);opacity:0}
        .pg-kmon .kprize{position:absolute;inset:-10%;display:grid;place-items:center;animation:kpop .45s cubic-bezier(.2,1.8,.4,1)}
        .pg-kmon .kprize svg{width:100%;height:100%}
        @keyframes kpop{from{transform:scale(.2)}to{transform:scale(1)}}
        .pg-kmon .kwon{position:absolute;inset:0;display:grid;place-items:end center;padding:4%;background:linear-gradient(transparent 45%,rgba(20,16,24,.55));z-index:8}
        .pg-kmon .kwoncard{position:relative;background:var(--cream);border:4px solid var(--ink);border-radius:18px;box-shadow:6px 6px 0 var(--ink);padding:14px 18px 18px;width:92%;animation:kpop .4s}
        .pg-kmon .kwoncard h2{font-family:'Bagel Fat One',Rubik,sans-serif;color:var(--pink);margin:4px 0 8px;font-size:clamp(20px,4vw,32px)}
        .pg-kmon .kwonrow{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
        .pg-kmon .kwonrow figure{margin:0;font-weight:800}
        .pg-kmon .kwoncard .small{font-size:14px;margin:6px 0 10px}
        .pg-kmon .khint{font-weight:800;font-size:18px;margin:16px 0 4px;min-height:1.4em}
        .pg-kmon .kbtns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:10px}
        .pg-kmon .kplay{background:var(--pink);color:#fff}
        .pg-kmon .kplay3{background:var(--sky);color:var(--ink)}
        @media (prefers-reduced-motion: reduce){.pg-kmon .kbulb,.pg-kmon .ksignglow,.pg-kmon .walking{animation:none}}
      `}</style>
    </Layout>
  );
}
