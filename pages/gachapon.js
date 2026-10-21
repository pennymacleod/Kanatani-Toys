import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

// Ten kaiju to collect. Add `img` (a file in public/nl/) to show a photo of the figure.
const KAIJU = [
  {
    "id": "godzilla",
    "en": "Godzilla",
    "jp": "ゴジラ",
    "debut": "Gojira",
    "year": "1954",
    "studio": "Toho film",
    "rarity": "SUPER RARE",
    "fact": "His Japanese name, Gojira, mixes gorira (gorilla) and kujira (whale)."
  },
  {
    "id": "mothra",
    "en": "Mothra",
    "jp": "モスラ",
    "debut": "Mothra",
    "year": "1961",
    "studio": "Toho film",
    "rarity": "RARE",
    "fact": "Mothra is known as the Queen of the Monsters. She hatches from a giant egg as a caterpillar before turning into a huge moth, and she has been in more films than any kaiju except Godzilla."
  },
  {
    "id": "gamera",
    "en": "Gamera",
    "jp": "ガメラ",
    "debut": "Gamera, the Giant Monster",
    "year": "1965",
    "studio": "Daiei film",
    "rarity": "RARE",
    "fact": "Gamera flies by pulling his legs into his shell and firing jets out of the holes. In Japan, 27 November is Gamera Day."
  },
  {
    "id": "hedorah",
    "en": "Hedorah",
    "jp": "ヘドラ",
    "debut": "Godzilla vs. Hedorah",
    "year": "1971",
    "studio": "Toho film",
    "rarity": "COMMON",
    "fact": "The Smog Monster eats pollution. Its name comes from hedoro, the Japanese word for sludge.",
    "img": "/nl/hedorah.png"
  },
  {
    "id": "ghidorah",
    "en": "King Ghidorah",
    "jp": "キングギドラ",
    "debut": "Ghidorah, the Three-Headed Monster",
    "year": "1964",
    "studio": "Toho film",
    "rarity": "SUPER RARE",
    "fact": "He was inspired by Yamata no Orochi, an eight-headed dragon from Japanese myth. The team thought about giving him seven or eight heads before settling on three."
  },
  {
    "id": "garamon",
    "en": "Garamon",
    "jp": "ガラモン",
    "debut": "Ultra Q, episode 13",
    "year": "1966",
    "studio": "TV series",
    "rarity": "COMMON",
    "fact": "Garamon's cries are really the buzzing of cicadas, because it was built by an invading race of Cicada Men."
  },
  {
    "id": "baltan",
    "en": "Alien Baltan",
    "jp": "バルタン星人",
    "debut": "Ultraman, episode 2",
    "year": "1966",
    "studio": "TV series",
    "rarity": "SUPER RARE",
    "fact": "Known as the 'Space Ninja', with a famously spooky laugh. Baltan is often called Ultraman's most popular enemy."
  },
  {
    "id": "metron",
    "en": "Alien Metron",
    "jp": "メトロン星人",
    "debut": "Ultraseven, episode 8",
    "year": "1967",
    "studio": "TV series",
    "rarity": "RARE",
    "fact": "Metron hid tiny red devices in cigarettes to make people go wild. He's famous for sitting down with the hero across a low table in a tiny flat."
  },
  {
    "id": "redking",
    "en": "Red King",
    "jp": "レッドキング",
    "debut": "Ultraman, episode 8",
    "year": "1966",
    "studio": "TV series",
    "rarity": "COMMON",
    "fact": "Red King made his debut in the very same episode as little Pigmon."
  },
  {
    "id": "pigmon",
    "en": "Pigmon",
    "jp": "ピグモン",
    "debut": "Ultraman, episode 8",
    "year": "1966",
    "studio": "TV series",
    "rarity": "COMMON",
    "fact": "Pigmon's costume was Garamon's old Ultra Q suit, repainted. Two kaiju for the price of one!"
  }
];

const CAPS = ['#FF1F8F', '#2ED3E0', '#FFD21F', '#FF7417', '#5BD34A', '#3FB7F0'];
const DOME = [{"left": 10, "top": 52, "c": "#FF1F8F", "rot": -20}, {"left": 28, "top": 62, "c": "#2ED3E0", "rot": 15}, {"left": 48, "top": 58, "c": "#FFD21F", "rot": -8}, {"left": 66, "top": 64, "c": "#FF7417", "rot": 25}, {"left": 80, "top": 50, "c": "#5BD34A", "rot": -30}, {"left": 18, "top": 34, "c": "#3FB7F0", "rot": 40}, {"left": 38, "top": 40, "c": "#FF1F8F", "rot": -15}, {"left": 58, "top": 38, "c": "#2ED3E0", "rot": 10}, {"left": 74, "top": 30, "c": "#FFD21F", "rot": -35}, {"left": 30, "top": 18, "c": "#FF7417", "rot": 20}, {"left": 52, "top": 20, "c": "#5BD34A", "rot": -5}, {"left": 44, "top": 74, "c": "#3FB7F0", "rot": 30}, {"left": 62, "top": 80, "c": "#FF1F8F", "rot": -20}, {"left": 22, "top": 78, "c": "#2ED3E0", "rot": 10}];
const KEY = 'kanatani-gacha-v1';
const colourFor = (k) => CAPS[KAIJU.indexOf(k) % CAPS.length];

export default function Gachapon() {
  const [got, setGot] = useState([]);
  const [turns, setTurns] = useState(0);
  const [pending, setPending] = useState(null);
  const [dropped, setDropped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const [hint, setHint] = useState('Turn the handle!');
  const [card, setCard] = useState(null);
  const knobRef = useRef(null);
  const dropRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      setGot(saved.filter(id => KAIJU.some(k => k.id === id)));
    } catch (e) { /* storage blocked: start fresh */ }
  }, []);

  const save = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ } };

  useEffect(() => {
    if (!card) return;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') closeCard(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card]);

  const pick = () => {
    const left = KAIJU.filter(k => !got.includes(k.id));
    const pool = left.length && Math.random() < 0.6 ? left : KAIJU;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const turn = () => {
    if (pending) { setHint('Tap your capsule to open it!'); return; }
    setBusy(true);
    setTurns(t => t + 1);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setHint('Gacha gacha…');
    const k = pick();
    setPending(k);
    setTimeout(() => {
      setDropped(true);
      setHint('Tap your capsule to open it!');
      setBusy(false);
      dropRef.current?.focus({ preventScroll: true });
    }, 950);
  };

  const open = () => {
    if (!pending) return;
    const k = pending;
    setPending(null);
    setDropped(false);
    const isNew = !got.includes(k.id);
    const list = isNew ? [...got, k.id] : got;
    if (isNew) { setGot(list); save(list); }
    setHint(list.length === KAIJU.length ? 'You found them all! おめでとう!' : 'Turn the handle again!');
    setCard({ k, isNew });
  };

  const closeCard = () => { setCard(null); knobRef.current?.focus({ preventScroll: true }); };
  const reset = () => { setGot([]); save([]); setHint('Turn the handle!'); };

  return (
    <Layout
      title="Kaiju Gachapon — Kanatani Toys"
      description="Turn the handle, open a capsule and collect all ten kaiju. A free little game from Kanatani Toys in Brighton."
      path="/gachapon"
      active="gacha"
      page="gacha"
    >
      <section className="floor">
        <div className="wrap gwrap">
          <div className="gintro">
            <span className="kicker">ガチャガチャ · KAIJU CAPSULES</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>Kaiju <span style={{ color: 'var(--sky)' }}>Gachapon!</span></h1>
            <p>Turn the handle to get a capsule, then tap it to open. Every kaiju card has its first film or show and a fun fact. Can you collect all ten?</p>
            <span className="dex">Collected <b>{got.length}</b> / {KAIJU.length}</span>
          </div>
          <div className={`machine${shake ? ' shake' : ''}`}>
            <div className="gprice">FREE<br />TO PLAY</div>
            <div className="dome" aria-hidden="true">
              {DOME.map((c, i) => (
                <span key={i} className="cap" style={{ left: `${c.left}%`, top: `${c.top}%`, '--c': c.c, transform: `rotate(${c.rot}deg)` }} />
              ))}
            </div>
            <div className="body">
              <div className="plate"><div className="jp">カナタニ怪獣ガチャ</div><div className="en">KANATANI KAIJU GACHAPON</div></div>
              <div className="controls">
                <button ref={knobRef} className="knob" type="button" aria-label="Turn the handle" onClick={turn} disabled={busy} style={{ transform: `rotate(${turns * 360}deg)` }} />
                <div className="chute">
                  <div className="flap" />
                  <button
                    ref={dropRef}
                    className={`drop${dropped ? ' in' : ''}`}
                    type="button"
                    aria-label="Open your capsule"
                    onClick={open}
                    style={pending ? { '--c': colourFor(pending) } : undefined}
                  />
                </div>
              </div>
              <div className="hint" aria-live="polite">{hint}</div>
            </div>
            <div className="feet" aria-hidden="true"><span /><span /></div>
          </div>
        </div>

        <div className="wrap coll">
          <h2 className="big" style={{ fontSize: 'clamp(32px,4.5vw,48px)' }}>Your kaiju collection</h2>
          <div className="slots">
            {KAIJU.map((k, i) => got.includes(k.id) ? (
              <button key={k.id} className="slot" type="button" onClick={() => setCard({ k, isNew: false })} style={{ background: colourFor(k) }}>
                {k.img && <img src={k.img} alt="" style={{ height: '55%', objectFit: 'contain' }} />}
                <span className="sj">{k.jp}</span>
                <span className="se">{k.en}</span>
              </button>
            ) : (
              <div key={k.id} className="slot locked" aria-label="Not found yet">
                <span className="sj">?</span>
                <span className="se">No. {i + 1}</span>
              </div>
            ))}
          </div>
          <button className="reset" type="button" onClick={reset}>Start my collection again</button>
        </div>
      </section>

      {card && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) closeCard(); }}>
          <div className="kcard" role="dialog" aria-modal="true" aria-labelledby="kn" style={{ '--c': colourFor(card.k) }}>
            <div className="ktop">
              <span className="rar">★ {card.k.rarity}</span>
              <span className="num">No. {KAIJU.indexOf(card.k) + 1} / {KAIJU.length}</span>
              {card.k.img ? (
                <div className="kphoto has"><img src={card.k.img} alt={`${card.k.en} sofubi in our shop`} /></div>
              ) : (
                <div className="kphoto"><span className="bigjp">{card.k.jp}</span></div>
              )}
            </div>
            <div className="kbody">
              <h3 className="kname" id="kn">{card.k.en}{card.isNew && <span className="newb">NEW!</span>}</h3>
              <div className="kmeta"><span>First seen: {card.k.debut}</span><span>{card.k.year}</span><span>{card.k.studio}</span></div>
              <div className="kfact"><b>FUN FACT</b>{card.k.fact}</div>
              <div className="kbtns">
                <Link className="btn" href={`/?q=${encodeURIComponent(card.k.en)}#shop`} style={{ background: 'var(--pink)' }}>Look for {card.k.en} toys →</Link>
                <button ref={closeRef} className="btn" type="button" onClick={closeCard} style={{ background: '#fff' }}>Keep playing</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
