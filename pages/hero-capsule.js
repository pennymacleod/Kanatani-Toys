import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useCart, fmt } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';
import { useLang } from '../lib/lang';

// Hero Beam Capsule: a £5 mystery hero gachapon, played as a tiny
// giant-monster battle. A monster stomps towards the city, you hammer the red
// button to charge the beam, the machine blasts it (KA-BOOM!) and a capsule
// drops out. Original monsters only (no real characters drawn). It finds the
// Square item called "Mystery Hero Capsule" by name; until that exists it
// plays as a demo.
const MUTE_KEY = 'kanatani-gacha-muted';
const HERO_KEY = 'kanatani-hero-beaten';
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const CAPS = ['var(--pink)', 'var(--sky)', 'var(--green)', 'var(--gold)', 'var(--orange)', 'var(--pink)'];
const TAPS = 8; // presses needed to charge the beam

// Three made-up monsters, a new colour every go.
const MONSTERS = [
  { name: ['Gobblezilla', 'ガブラザウルス'], path: 'M30 200 L30 95 Q38 40 78 50 L86 22 L98 48 L112 28 L116 56 Q148 62 146 108 L172 96 L162 130 L146 136 L148 200 Z M55 70 a7 7 0 1 0 0.1 0', eye: [60, 72] },
  { name: ['Octo-Blob', 'タコブロブ'], path: 'M40 200 Q30 150 52 140 Q20 100 60 60 Q100 20 140 60 Q180 100 148 140 Q170 150 160 200 L140 168 L120 200 L100 168 L80 200 L60 168 Z', eye: [100, 92] },
  { name: ['Spike Crab', 'トゲガニ'], path: 'M20 200 L40 150 L10 120 L45 125 L60 95 L80 120 L100 80 L120 120 L140 95 L155 125 L190 120 L160 150 L180 200 Z', eye: [100, 130] },
];
const MCOL = ['#5BD34A', '#FF7417', '#3FB7F0', '#FF1F8F', '#9b5cff'];

export default function HeroCapsule() {
  const { add, setOpen, qtyOf } = useCart();
  const [item, setItem] = useState(undefined);
  const [step, setStep] = useState('idle'); // idle | fight | beam | boom | pop
  const [power, setPower] = useState(0);
  const [mon, setMon] = useState({ i: 0, c: MCOL[0] });
  const [beaten, setBeaten] = useState(0);
  const [msg, setMsg] = useState(['A monster is coming! Press START, then hammer the red button to charge the beam!', '怪獣が来るぞ！スタートを押して、赤いボタンを連打してビームをチャージ！']);
  const { lang, t } = useLang();
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const powerRef = useRef(0);
  const stepRef = useRef('idle');

  useEffect(() => {
    try {
      const m = localStorage.getItem(MUTE_KEY) === '1'; setMuted(m); mutedRef.current = m;
      setBeaten(parseInt(localStorage.getItem(HERO_KEY) || '0', 10) || 0);
    } catch (e) { /* ignore */ }
    fetch('/api/catalog')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setItem((d?.products || []).find(p => /mystery\s*hero/i.test(p.name)) || null))
      .catch(() => setItem(null));
  }, []);

  // The charge slowly drains, so you have to keep pressing.
  useEffect(() => {
    if (step !== 'fight') return undefined;
    const id = setInterval(() => {
      powerRef.current = Math.max(0, powerRef.current - 2);
      setPower(powerRef.current);
    }, 120);
    return () => clearInterval(id);
  }, [step]);

  const sfx = (fn) => { if (!mutedRef.current) fn(); };
  const toggleMute = () => {
    const m = !muted; setMuted(m); mutedRef.current = m;
    try { localStorage.setItem(MUTE_KEY, m ? '1' : '0'); } catch (e) { /* ignore */ }
  };

  const inBasket = item ? qtyOf(item.variationId || item.id) : 0;
  const soldOut = item && item.stock != null && inBasket >= item.stock;
  const live = item && !soldOut;
  const price = item ? fmt(item.price) : '£5';
  const go = (s) => { stepRef.current = s; setStep(s); };

  const start = () => {
    if (soldOut) return;
    setMon({ i: Math.floor(Math.random() * MONSTERS.length), c: MCOL[Math.floor(Math.random() * MCOL.length)] });
    powerRef.current = 0; setPower(0);
    go('fight'); sfx(sounds.clunk);
    setMsg(['Hammer the red button! Charge the beam before it reaches the city!', '赤いボタンを連打！街に来る前にビームをチャージ！']);
  };

  const fire = async () => {
    go('beam'); sfx(sounds.rare);
    setMsg(['HERO BEAM!!!', 'ヒーロービーム！！！']); await wait(900);
    go('boom'); sfx(sounds.complete);
    setMsg(['KA-BOOM! The city is saved!', 'ドカーン！街は救われた！']); await wait(1300);
    const n = beaten + 1; setBeaten(n);
    try { localStorage.setItem(HERO_KEY, String(n)); } catch (e) { /* ignore */ }
    go('pop'); sfx(sounds.pop);
    if (live) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Hero Capsule' });
      setMsg(ok
        ? ['Your reward: a mystery hero capsule is in your basket! Who you get stays a surprise.', 'ごほうびのミステリーヒーローカプセルがカートに入りました！中身はお楽しみ！']
        : ['That\'s all the capsules we have for now!', 'カプセルは今あるだけで全部です！']);
    } else {
      setMsg([`Hero capsules are ${price} in the shop. Online capsules are coming soon!`, `ヒーローカプセルは店頭で${price}です。オンライン販売はもうすぐ！`]);
    }
  };

  const tap = () => {
    if (stepRef.current === 'idle' || stepRef.current === 'pop') { start(); return; }
    if (stepRef.current !== 'fight') return;
    powerRef.current = Math.min(100, powerRef.current + 100 / TAPS + 2);
    setPower(powerRef.current); sfx(sounds.crank);
    if (powerRef.current >= 100) fire();
  };

  const M = MONSTERS[mon.i];
  const btnLabel = soldOut ? t('ALL OUT', '品切れ')
    : step === 'fight' ? t('PRESS! PRESS!', '連打！')
      : step === 'idle' || step === 'pop' ? t('START', 'スタート') : '…';
  const panel = step === 'fight' ? `POWER ${Math.round(power)}%` : step === 'beam' ? 'BEAM!!!' : step === 'boom' ? 'KA-BOOM!' : step === 'pop' ? 'YOU WIN!' : 'READY…';

  return (
    <Layout
      title="Hero Beam Capsule — Kanatani Toys"
      description="Stop the giant monster! Charge the hero beam and win a mystery hero gachapon capsule for £5 from Kanatani Toys in Brighton."
      path="/hero-capsule"
      active="hero"
      page="hero"
    >
      <section className="floor">
        <div className="wrap hwrap">
          <div className="hintro">
            <span className="kicker">{t('NEW GAME · MONSTER ATTACK!', '新ゲーム · 怪獣襲来！')}</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>{lang === 'ja' ? <>ヒーロー<span style={{ color: 'var(--red)' }}>ビーム</span>カプセル</> : <>Hero <span style={{ color: 'var(--red)' }}>Beam</span> Capsule</>}</h1>
            <p>{lang === 'ja'
              ? `巨大怪獣が街に向かってくる！赤いボタンを連打してヒーロービームをチャージ、怪獣を吹っ飛ばそう。勝ったらごほうびに、小さな特撮ヒーローが入ったミステリーカプセル。1回${price}。`
              : `A giant monster is stomping towards the city! Hammer the big red button to charge the hero beam and blast it away. Win, and your reward is a mystery capsule with a little tokusatsu hero inside. ${price} a go.`}</p>
            <p>{t('A different monster every time. Every capsule is a surprise from our gachapon stash. Collect them all, swap your doubles!', '毎回ちがう怪獣が登場。カプセルの中身はカナタニのガチャポンから、何が出るかはお楽しみ！')}</p>
            <div className="brow">
              <span className="hprice">{price}</span>
              {beaten > 0 && <span className="dex">{lang === 'ja' ? <>倒した怪獣 <b>{beaten}</b></> : <>Monsters beaten <b>{beaten}</b></>}</span>}
              <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? t('🔇 Sound off', '🔇 サウンドオフ') : t('🔊 Sound on', '🔊 サウンドオン')}</button>
            </div>
            <p className="small">{t('One random figure per win. Collect it from the shop or we post it to you.', '1回につきランダムで1体。店頭受け取り、または発送します。')}</p>
          </div>

          <div className="harea">
            <div className={`hscene s-${step}`}>
              <div className="hstars" aria-hidden="true" />
              <div className="hrays" aria-hidden="true" />
              <span className="hbeam l" aria-hidden="true" /><span className="hbeam r" aria-hidden="true" />
              <svg className="hcity" viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
                <g fill="#141018"><rect x="10" y="80" width="40" height="70" /><rect x="55" y="55" width="30" height="95" /><rect x="90" y="95" width="45" height="55" /><rect x="140" y="70" width="35" height="80" /><rect x="180" y="40" width="28" height="110" /><rect x="212" y="85" width="50" height="65" /><rect x="268" y="60" width="40" height="90" /><rect x="314" y="90" width="36" height="60" /><rect x="356" y="70" width="30" height="80" /><rect x="392" y="100" width="50" height="50" /><rect x="448" y="60" width="32" height="90" /><rect x="484" y="85" width="36" height="65" /></g>
                <g className="hwin" fill="#F2B705"><rect x="60" y="65" width="6" height="6" /><rect x="74" y="80" width="6" height="6" /><rect x="186" y="55" width="6" height="6" /><rect x="196" y="90" width="6" height="6" /><rect x="275" y="75" width="6" height="6" /><rect x="20" y="95" width="6" height="6" /><rect x="362" y="85" width="6" height="6" /><rect x="455" y="75" width="6" height="6" /></g>
              </svg>

              {(step === 'fight' || step === 'beam' || step === 'boom') && (
                <svg className="hmon" viewBox="0 0 200 200" aria-hidden="true">
                  <path d={M.path} fill={mon.c} stroke="#141018" strokeWidth="6" strokeLinejoin="round" fillRule="evenodd" />
                  <circle cx={M.eye[0]} cy={M.eye[1]} r="13" fill="#fff" stroke="#141018" strokeWidth="5" />
                  <circle cx={M.eye[0] - 3} cy={M.eye[1] + 1} r="6" fill="#141018" />
                </svg>
              )}
              {step === 'fight' && <div className="hmonname" aria-hidden="true">{t(`${M.name[0]} attacks!`, `${M.name[1]}襲来！`)}</div>}
              {step === 'beam' && <span className="hzap" aria-hidden="true" />}
              {step === 'boom' && (
                <div className="hboom" aria-hidden="true">
                  <svg viewBox="0 0 300 300"><polygon points="150,10 178,95 270,60 210,135 295,170 200,185 230,280 150,215 70,285 95,185 5,170 90,135 30,60 122,95" fill="#F2B705" stroke="#141018" strokeWidth="8" strokeLinejoin="round" /><text x="150" y="168" textAnchor="middle" className="kb">KA-BOOM!</text></svg>
                  {[...Array(12)].map((_, i) => <span key={i} className="hstar" style={{ '--a': `${i * 30}deg`, '--c': CAPS[i % 6] }}>★</span>)}
                </div>
              )}

              <div className="hsign">HERO <b>BEAM</b> CAPSULE · {price}</div>
              <div className="hmachine">
                <span className="hcannon" aria-hidden="true" />
                <div className="hdome" aria-hidden="true">
                  {[[16, 70], [62, 82], [108, 70], [38, 32], [86, 36]].map(([x, y], i) => (
                    <span key={i} className="hcap" style={{ left: x, top: y, '--c': CAPS[i] }} />
                  ))}
                </div>
                <div className="hbody">
                  <div className="hpanel" aria-live="polite">{panel}</div>
                  <div className="hmeter" aria-hidden="true"><span style={{ width: `${power}%` }} /></div>
                  <button className="hbtn" type="button" onClick={tap} disabled={soldOut || step === 'beam' || step === 'boom'}
                    aria-label={step === 'fight' ? t('Charge the beam', 'ビームをチャージ') : t(`Start · ${price}`, `スタート · ${price}`)}>
                    {btnLabel}
                  </button>
                  <div className="hchute" aria-hidden="true" />
                </div>
              </div>
              <div className="hflash" aria-hidden="true" />

              {step === 'pop' && (
                <div className="hpop">
                  <div className="hbigcap" aria-hidden="true" />
                  <div className="hcard">
                    <div className="t">{t('City saved! You win a mystery hero!', '街を守った！ミステリーヒーローをゲット！')}</div>
                    <div className="s">{t(msg[0], msg[1])}</div>
                    <div className="hcardbtns">
                      {live && <button className="btn" type="button" onClick={() => setOpen(true)} style={{ background: 'var(--pink)', color: '#fff' }}>{t('View basket →', 'カートを見る →')}</button>}
                      <button className="btn" type="button" onClick={start} style={{ background: '#fff' }}>{t('Fight another monster', 'もう一回たたかう')}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {step !== 'pop' && <p className="hint" aria-live="polite">{t(msg[0], msg[1])}</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
}
