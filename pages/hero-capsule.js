import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useCart, fmt } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';
import { useLang } from '../lib/lang';

// Hero Beam Capsule: a £5 mystery hero gachapon game, in an old-school
// Japanese giant-hero-v-monster style (no real characters drawn). It finds the
// Square item called "Mystery Hero Capsule" by name, so once Penny adds it in
// Square (£5, with stock) presses add capsules to the basket. Until then it
// plays as a demo.
const MUTE_KEY = 'kanatani-gacha-muted';
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const CAPS = ['var(--pink)', 'var(--sky)', 'var(--green)', 'var(--gold)', 'var(--orange)', 'var(--pink)'];

export default function HeroCapsule() {
  const { add, setOpen, qtyOf } = useCart();
  const [item, setItem] = useState(undefined);
  const [step, setStep] = useState('idle'); // idle | charge | beam | pop
  const [panel, setPanel] = useState('READY…');
  const [msg, setMsg] = useState(['Smash the big red button to fire the hero beam!', '大きな赤いボタンを押して、ヒーロービームを発射！']);
  const { lang, t } = useLang();
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const busy = step !== 'idle' && step !== 'pop';

  useEffect(() => {
    try { const m = localStorage.getItem(MUTE_KEY) === '1'; setMuted(m); mutedRef.current = m; } catch (e) { /* ignore */ }
    fetch('/api/catalog')
      .then(r => (r.ok ? r.json() : null))
      .then(d => setItem((d?.products || []).find(p => /mystery\s*hero/i.test(p.name)) || null))
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
  const price = item ? fmt(item.price) : '£5';

  const press = async () => {
    if (busy || soldOut) return;
    setStep('charge'); setPanel('CHARGING…'); setMsg(['Charging the hero beam…', 'ヒーロービーム、チャージ中…']);
    sfx(sounds.crank); await wait(900);
    setStep('beam'); setPanel('BEAM!!!'); setMsg(['BEAM!!!', 'ビーム！！！']); sfx(sounds.rare); await wait(1100);
    setStep('pop'); setPanel('DONE!'); sfx(sounds.pop);
    if (live) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Hero Capsule' });
      setMsg(ok
        ? ['A mystery hero capsule is in your basket! Who you get stays a surprise.', 'ミステリーヒーローカプセルがカートに入りました！中身は届くまでのお楽しみ！']
        : ['That\'s all the capsules we have for now!', 'カプセルは今あるだけで全部です！']);
    } else {
      setMsg([`Hero capsules are ${price} in the shop. Online capsules are coming soon!`, `ヒーローカプセルは店頭で${price}です。オンライン販売はもうすぐ！`]);
    }
  };
  const again = () => { setStep('idle'); setPanel('READY…'); };

  return (
    <Layout
      title="Hero Beam Capsule — Kanatani Toys"
      description="Smash the big red button and get a mystery hero gachapon capsule for £5 from Kanatani Toys in Brighton."
      path="/hero-capsule"
      active="hero"
      page="hero"
    >
      <section className="floor">
        <div className="wrap hwrap">
          <div className="hintro">
            <span className="kicker">{t('NEW GAME · MYSTERY HEROES', '新ゲーム · ミステリーヒーロー')}</span>
            <h1 className="big" style={{ fontSize: 'clamp(46px,6.4vw,84px)' }}>{lang === 'ja' ? <>ヒーロー<span style={{ color: 'var(--red)' }}>ビーム</span>カプセル</> : <>Hero <span style={{ color: 'var(--red)' }}>Beam</span> Capsule</>}</h1>
            <p>{lang === 'ja'
              ? `巨大怪獣が街を大暴れ！止められるのはヒーローだけ。大きな赤いボタンを押してビームを発射すると、マシンから小さな特撮ヒーローが入ったミステリーカプセルが出てきます。1回${price}。`
              : `A giant monster is stomping through the city and only a hero can stop it! Smash the big red button to fire the beam, and the machine drops a mystery capsule with a little tokusatsu hero inside. ${price} a go.`}</p>
            <p>{t('Every capsule is a surprise from our gachapon stash. Collect them all, swap your doubles!', '中身はカナタニのガチャポンから、何が出るかはお楽しみ。全部集めて、ダブったら交換しよう！')}</p>
            <div className="brow">
              <span className="hprice">{price}</span>
              <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? t('🔇 Sound off', '🔇 サウンドオフ') : t('🔊 Sound on', '🔊 サウンドオン')}</button>
            </div>
            <p className="small">{t('One random figure per go. Collect it from the shop or we post it to you.', '1回につきランダムで1体。店頭受け取り、または発送します。')}</p>
          </div>

          <div className="harea">
            <div className={`hscene s-${step}`}>
              <div className="hstars" aria-hidden="true" />
              <div className="hrays" aria-hidden="true" />
              <span className="hbeam l" aria-hidden="true" /><span className="hbeam r" aria-hidden="true" />
              <svg className="hcity" viewBox="0 0 520 150" preserveAspectRatio="none" aria-hidden="true">
                <g className="kaiju"><path d="M20 150 L20 60 Q30 20 60 30 L70 10 L80 32 L95 18 L98 40 Q120 45 118 80 L140 70 L132 95 L118 100 L120 150 Z" fill="#141018" /><circle cx="58" cy="44" r="5" fill="#F2B705" /></g>
                <g fill="#141018"><rect x="150" y="80" width="40" height="70" /><rect x="195" y="55" width="30" height="95" /><rect x="230" y="95" width="45" height="55" /><rect x="330" y="70" width="35" height="80" /><rect x="370" y="40" width="28" height="110" /><rect x="402" y="85" width="50" height="65" /><rect x="456" y="60" width="40" height="90" /></g>
                <g fill="#F2B705"><rect x="200" y="65" width="6" height="6" /><rect x="214" y="80" width="6" height="6" /><rect x="376" y="55" width="6" height="6" /><rect x="386" y="90" width="6" height="6" /><rect x="465" y="75" width="6" height="6" /><rect x="160" y="95" width="6" height="6" /></g>
              </svg>
              <div className="hsign">HERO <b>BEAM</b> CAPSULE · {price}</div>
              <div className="hmachine">
                <div className="hdome" aria-hidden="true">
                  {[[30, 110], [86, 126], [142, 112], [190, 128], [58, 64], [120, 70]].map(([x, y], i) => (
                    <span key={i} className="hcap" style={{ left: x, top: y, '--c': CAPS[i] }} />
                  ))}
                </div>
                <div className="hbody">
                  <div className="hpanel" aria-live="polite">{panel}</div>
                  <button className="hbtn" type="button" onClick={press} disabled={busy || soldOut} aria-label={t(`Fire the hero beam · ${price}`, `ヒーロービームを発射 · ${price}`)}>
                    {soldOut ? t('ALL OUT', '品切れ') : <>{t('PRESS', 'おして')}<br />{t('ME!', '！')}</>}
                  </button>
                  <div className="hchute" aria-hidden="true" />
                </div>
              </div>
              <div className="hflash" aria-hidden="true" />
              {step === 'pop' && (
                <div className="hpop">
                  <div className="hbigcap" aria-hidden="true" />
                  <div className="hcard">
                    <div className="t">{t('You got a mystery hero!', 'ミステリーヒーローをゲット！')}</div>
                    <div className="s">{t(msg[0], msg[1])}</div>
                    <div className="hcardbtns">
                      {live && <button className="btn" type="button" onClick={() => setOpen(true)} style={{ background: 'var(--pink)', color: '#fff' }}>{t('View basket →', 'カートを見る →')}</button>}
                      <button className="btn" type="button" onClick={again} style={{ background: '#fff' }}>{t('Play again', 'もう一回')}</button>
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
