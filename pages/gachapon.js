import { useEffect, useRef, useState } from 'react';
import { sounds, revealSound } from '../lib/gachaSounds';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useLang } from '../lib/lang';

// Messages under the machine, in both languages.
const HINTS = {
  turn: ['Turn the handle!', 'ハンドルを回してね！'],
  tap: ['Tap your capsule to open it!', 'カプセルをタップして開けてね！'],
  gacha: ['Gacha gacha…', 'ガチャガチャ…'],
  all: ['You found them all! おめでとう!', '全部集めたね！おめでとう！'],
  again: ['Turn the handle again!', 'もう一回ハンドルを回してね！'],
};
const RARITY_JA = { 'SUPER RARE': 'スーパーレア', RARE: 'レア', COMMON: 'ノーマル' };

// Ten kaiju to collect. Add `img` (a file in public/nl/) to show a photo of the figure.
const KAIJU = [
  {
    "id": "godzilla",
    "debut_ja": "『ゴジラ』",
    "studio_ja": "東宝映画",
    "fact_ja": "日本語の名前「ゴジラ」は、「ゴリラ」と「クジラ」を組み合わせたものです。",
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
    "debut_ja": "『モスラ』",
    "studio_ja": "東宝映画",
    "fact_ja": "モスラは「怪獣の女王」と呼ばれています。巨大な卵から幼虫として生まれ、やがて巨大な蛾に変身します。ゴジラ以外のどの怪獣よりもたくさんの映画に出演しています。",
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
    "debut_ja": "『大怪獣ガメラ』",
    "studio_ja": "大映映画",
    "fact_ja": "ガメラは手足を甲羅の中に引っ込めて、その穴からジェットを噴射して空を飛びます。日本では11月27日が「ガメラの日」です。",
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
    "debut_ja": "『ゴジラ対ヘドラ』",
    "studio_ja": "東宝映画",
    "fact_ja": "公害を食べる公害怪獣。名前は日本語の「ヘドロ」から来ています。",
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
    "debut_ja": "『三大怪獣 地球最大の決戦』",
    "studio_ja": "東宝映画",
    "fact_ja": "日本神話の八つの頭を持つ大蛇、ヤマタノオロチがモデル。頭を7つや8つにする案もありましたが、最終的に3つに決まりました。",
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
    "debut_ja": "『ウルトラQ』第13話",
    "studio_ja": "テレビシリーズ",
    "fact_ja": "ガラモンの鳴き声は、実はセミの鳴き声。侵略してきたセミ人間に作られたからです。",
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
    "debut_ja": "『ウルトラマン』第2話",
    "studio_ja": "テレビシリーズ",
    "fact_ja": "「宇宙忍者」と呼ばれ、不気味な笑い声で有名。ウルトラマンの敵の中で一番人気とよく言われます。",
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
    "debut_ja": "『ウルトラセブン』第8話",
    "studio_ja": "テレビシリーズ",
    "fact_ja": "タバコに小さな赤い結晶体を仕込んで、人々を凶暴にしました。小さなアパートでちゃぶ台を挟んでヒーローと向かい合うシーンが有名です。",
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
    "debut_ja": "『ウルトラマン』第8話",
    "studio_ja": "テレビシリーズ",
    "fact_ja": "レッドキングは、小さなピグモンとまったく同じ回でデビューしました。",
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
    "debut_ja": "『ウルトラマン』第8話",
    "studio_ja": "テレビシリーズ",
    "fact_ja": "ピグモンの着ぐるみは、『ウルトラQ』のガラモンの着ぐるみを塗り直したもの。一体で二度おいしい！",
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
  const [hint, setHint] = useState('turn');
  const { lang, t } = useLang();
  const [card, setCard] = useState(null);
  const knobRef = useRef(null);
  const dropRef = useRef(null);
  const closeRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const sfx = (fn) => { if (!mutedRef.current) fn(); };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
      setGot(saved.filter(id => KAIJU.some(k => k.id === id)));
      const m = localStorage.getItem('kanatani-gacha-muted') === '1';
      setMuted(m); mutedRef.current = m;
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
    if (pending) { setHint('tap'); return; }
    setBusy(true);
    setTurns(t => t + 1);
    setShake(false);
    requestAnimationFrame(() => setShake(true));
    setHint('gacha');
    sfx(sounds.crank);
    const k = pick();
    setPending(k);
    setTimeout(() => {
      setDropped(true);
      sfx(sounds.drop);
      setHint('tap');
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
    setHint(list.length === KAIJU.length ? 'all' : 'again');
    setCard({ k, isNew });
    sfx(sounds.pop);
    const done = list.length === KAIJU.length && isNew;
    setTimeout(() => sfx(() => (done ? sounds.complete() : revealSound(k.rarity))), 260);
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m); mutedRef.current = m;
    try { localStorage.setItem('kanatani-gacha-muted', m ? '1' : '0'); } catch (e) { /* ignore */ }
  };

  const closeCard = () => { setCard(null); knobRef.current?.focus({ preventScroll: true }); };
  const reset = () => { setGot([]); save([]); setHint('turn'); };

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
            <span className="kicker">{t('ガチャガチャ · KAIJU CAPSULES', 'ガチャガチャ · 怪獣カプセル')}</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>{lang === 'ja' ? <>怪獣<span style={{ color: 'var(--sky)' }}>ガチャポン！</span></> : <>Kaiju <span style={{ color: 'var(--sky)' }}>Gachapon!</span></>}</h1>
            <p>{t('Turn the handle to get a capsule, then tap it to open. Every kaiju card has its first film or show and a fun fact. Can you collect all ten?', 'ハンドルを回してカプセルをゲットしたら、タップして開けよう。怪獣カードには、初登場の映画や番組と、おもしろ豆知識がのっています。10体全部集められるかな？')}</p>
            <span className="dex">{lang === 'ja' ? <>コレクション <b>{got.length}</b> / {KAIJU.length}</> : <>Collected <b>{got.length}</b> / {KAIJU.length}</>}</span>
            <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? t('🔇 Sound off', '🔇 サウンドオフ') : t('🔊 Sound on', '🔊 サウンドオン')}</button>
          </div>
          <div className={`machine${shake ? ' shake' : ''}`}>
            <div className="gprice">{lang === 'ja' ? <>無料で<br />遊べる</> : <>FREE<br />TO PLAY</>}</div>
            <div className="dome" aria-hidden="true">
              {DOME.map((c, i) => (
                <span key={i} className="cap" style={{ left: `${c.left}%`, top: `${c.top}%`, '--c': c.c, transform: `rotate(${c.rot}deg)` }} />
              ))}
            </div>
            <div className="body">
              <div className="plate"><div className="jp">カナタニ怪獣ガチャ</div><div className="en">KANATANI KAIJU GACHAPON</div></div>
              <div className="controls">
                <button ref={knobRef} className="knob" type="button" aria-label={t('Turn the handle', 'ハンドルを回す')} onClick={turn} disabled={busy} style={{ transform: `rotate(${turns * 360}deg)` }} />
                <div className="chute">
                  <div className="flap" />
                  <button
                    ref={dropRef}
                    className={`drop${dropped ? ' in' : ''}`}
                    type="button"
                    aria-label={t('Open your capsule', 'カプセルを開ける')}
                    onClick={open}
                    style={pending ? { '--c': colourFor(pending) } : undefined}
                  />
                </div>
              </div>
              <div className="hint" aria-live="polite">{t(...HINTS[hint])}</div>
            </div>
            <div className="feet" aria-hidden="true"><span /><span /></div>
          </div>
        </div>

        <div className="wrap coll">
          <h2 className="big" style={{ fontSize: 'clamp(32px,4.5vw,48px)' }}>{t('Your kaiju collection', 'あなたの怪獣コレクション')}</h2>
          <div className="slots">
            {KAIJU.map((k, i) => got.includes(k.id) ? (
              <button key={k.id} className="slot" type="button" onClick={() => setCard({ k, isNew: false })} style={{ background: colourFor(k) }}>
                {k.img && <img src={k.img} alt="" style={{ height: '55%', objectFit: 'contain' }} />}
                <span className="sj">{k.jp}</span>
                <span className="se">{lang === 'ja' ? k.jp : k.en}</span>
              </button>
            ) : (
              <div key={k.id} className="slot locked" aria-label={t('Not found yet', 'まだ見つかっていません')}>
                <span className="sj">?</span>
                <span className="se">No. {i + 1}</span>
              </div>
            ))}
          </div>
          <button className="reset" type="button" onClick={reset}>{t('Start my collection again', 'コレクションを最初からやり直す')}</button>
        </div>
      </section>

      {card && (
        <div className="overlay" onClick={(e) => { if (e.target === e.currentTarget) closeCard(); }}>
          <div className="kcard" role="dialog" aria-modal="true" aria-labelledby="kn" style={{ '--c': colourFor(card.k) }}>
            <div className="ktop">
              <span className="rar">★ {t(card.k.rarity, RARITY_JA[card.k.rarity])}</span>
              <span className="num">No. {KAIJU.indexOf(card.k) + 1} / {KAIJU.length}</span>
              {card.k.img ? (
                <div className="kphoto has"><img src={card.k.img} alt={`${card.k.en} sofubi in our shop`} /></div>
              ) : (
                <div className="kphoto"><span className="bigjp">{card.k.jp}</span></div>
              )}
            </div>
            <div className="kbody">
              <h3 className="kname" id="kn">{lang === 'ja' ? card.k.jp : card.k.en}{card.isNew && <span className="newb">{t('NEW!', 'ゲット！')}</span>}</h3>
              <div className="kmeta"><span>{t('First seen:', '初登場：')} {t(card.k.debut, card.k.debut_ja)}</span><span>{lang === 'ja' ? `${card.k.year}年` : card.k.year}</span><span>{t(card.k.studio, card.k.studio_ja)}</span></div>
              <div className="kfact"><b>{t('FUN FACT', 'おもしろ豆知識')}</b>{t(card.k.fact, card.k.fact_ja)}</div>
              <div className="kbtns">
                <Link className="btn" href={`/?q=${encodeURIComponent(card.k.en)}#shop`} style={{ background: 'var(--pink)' }}>{lang === 'ja' ? `${card.k.jp}のおもちゃを探す →` : `Look for ${card.k.en} toys →`}</Link>
                <button ref={closeRef} className="btn" type="button" onClick={closeCard} style={{ background: '#fff' }}>{t('Keep playing', '続けて遊ぶ')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
