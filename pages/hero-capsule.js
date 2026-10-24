import { useCallback, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { useCart, fmt } from '../lib/cart';
import { sounds } from '../lib/gachaSounds';
import { useLang } from '../lib/lang';
import { W, H, HEARTS, HEROES, BOSSES, loadImages, newGame, act, tick, draw } from '../lib/heroGame';

// Hero Capsule: a tiny platform game starring Hiro's creatures. Jump over the
// buildings, then punch the monster at the end until it's K.O. Winning puts a
// £5 mystery hero gachapon capsule in the basket. It finds the Square item
// called "Mystery Hero Capsule" by name; until that exists it plays as a demo.
const MUTE_KEY = 'kanatani-gacha-muted';
const WINS_KEY = 'kanatani-hero-wins';

export default function HeroCapsule() {
  const { add, setOpen, qtyOf } = useCart();
  const [item, setItem] = useState(undefined);
  const [phase, setPhase] = useState('pick'); // pick | run | boss | ko | won | lost
  const [hero, setHero] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const [wins, setWins] = useState(0);
  const [msg, setMsg] = useState(['', '']);
  const { lang, t } = useLang();
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const canvas = useRef(null);
  const G = useRef(null);       // live game state
  const imgs = useRef(null);

  useEffect(() => {
    try {
      const m = localStorage.getItem(MUTE_KEY) === '1'; setMuted(m); mutedRef.current = m;
      setWins(parseInt(localStorage.getItem(WINS_KEY) || '0', 10) || 0);
    } catch (e) { /* ignore */ }
    imgs.current = loadImages();
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

  const start = (h) => {
    G.current = newGame(h);
    setHero(h); setHearts(HEARTS); setPhase('run');
    setMsg(['Tap to jump over the buildings!', 'タップでビルを飛びこえよう！']);
  };

  // Game events -> sounds, messages and React state.
  const on = useCallback((type, g) => {
    if (type === 'jump') sfx(sounds.pop);
    if (type === 'bump') { sfx(sounds.slide); setHearts(g.hearts); }
    if (type === 'lost') { setPhase('lost'); setMsg(['Ouch! Too many bumps. Have another go!', 'いたっ！もう一回チャレンジ！']); }
    if (type === 'boss') { setPhase('boss'); setMsg(['A monster! Tap to PUNCH it!', '怪獣だ！タップでパンチ！']); }
    if (type === 'punch') sfx(sounds.clunk);
    if (type === 'ko') { setPhase('ko'); sfx(sounds.complete); setMsg(['K.O.!!!', 'ケーオー！！！']); }
    if (type === 'won') winRef.current();
  }, []);

  const action = useCallback(() => { if (G.current) act(G.current, on); }, [on]);

  // keyboard: space / up arrow
  useEffect(() => {
    const k = (e) => { if ((e.code === 'Space' || e.code === 'ArrowUp') && G.current && (G.current.phase === 'run' || G.current.phase === 'boss')) { e.preventDefault(); action(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [action]);

  const win = useCallback(() => {
    setPhase('won');
    setWins(n => { const v = n + 1; try { localStorage.setItem(WINS_KEY, String(v)); } catch (e) { /* ignore */ } return v; });
    if (item && !(item.stock != null && qtyOf(item.variationId || item.id) >= item.stock)) {
      const ok = add({ ...item, id: item.variationId || item.id, name: 'Mystery Hero Capsule' });
      setMsg(ok ? ['Your prize, a mystery hero capsule, is in your basket! Who you get stays a surprise.', 'ごほうびのミステリーヒーローカプセルがカートに入りました！中身はお楽しみ！']
        : ['That\'s all the capsules we have for now!', 'カプセルは今あるだけで全部です！']);
    } else {
      setMsg([`Hero capsules are ${price} in the shop. Online capsules are coming soon!`, `ヒーローカプセルは店頭で${price}です。オンライン販売はもうすぐ！`]);
    }
  }, [item, add, qtyOf, price]);

  const winRef = useRef(() => {});
  winRef.current = win;

  // game loop
  useEffect(() => {
    if (!['run', 'boss', 'ko'].includes(phase)) return undefined;
    const c = canvas.current; if (!c) return undefined;
    const ctx = c.getContext('2d');
    let raf;
    const frame = () => {
      const g = G.current; if (!g) return;
      tick(g, on);
      draw(ctx, g, imgs.current);
      if (g.phase === 'run' || g.phase === 'boss' || g.phase === 'ko') raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, on]);

  const playing = phase === 'run' || phase === 'boss';
  const btn = phase === 'boss' ? t('PUNCH!', 'パンチ！') : t('JUMP!', 'ジャンプ！');
  const B = G.current ? BOSSES[G.current.boss] : BOSSES[0];

  return (
    <Layout
      title="Hero Capsule — Kanatani Toys"
      description="Jump the buildings, punch the monster, win a £5 mystery hero gachapon capsule. A little platform game starring Hiro's creatures, from Kanatani Toys in Brighton."
      path="/hero-capsule"
      active="hero"
      page="hero"
    >
      <section className="floor">
        <div className="wrap hwrap">
          <div className="hintro">
            <span className="kicker">{t('NEW GAME · JUMP! PUNCH! WIN!', '新ゲーム · ジャンプ！パンチ！ゲット！')}</span>
            <h1 className="big" style={{ fontSize: 'clamp(44px,6vw,80px)' }}>{lang === 'ja' ? <>ヒーロー<span style={{ color: 'var(--red)' }}>カプセル</span></> : <>Hero <span style={{ color: 'var(--red)' }}>Capsule</span></>}</h1>
            <p>{lang === 'ja'
              ? `ヒロのクリーチャーで遊ぼう！タップでビルを飛びこえて、最後に待つ怪獣をパンチでノックアウト。勝ったらごほうびに、小さな特撮ヒーローが入ったミステリーカプセル（${price}）。`
              : `Play as one of Hiro's creatures! Tap to jump over the buildings, then punch out the monster waiting at the end. Win, and your prize is a mystery capsule with a little tokusatsu hero inside, ${price}.`}</p>
            <p>{t('Bump into three buildings and it\'s game over, but you can play as many times as you like. Every capsule is a surprise from our gachapon stash!', 'ビルに3回ぶつかったらゲームオーバー。でも何回でも遊べます。カプセルの中身はお楽しみ！')}</p>
            <div className="brow">
              <span className="hprice">{price}</span>
              {wins > 0 && <span className="dex">{lang === 'ja' ? <>KO数 <b>{wins}</b></> : <>Monsters K.O.'d <b>{wins}</b></>}</span>}
              <button className="sound" type="button" onClick={toggleMute} aria-pressed={!muted}>{muted ? t('🔇 Sound off', '🔇 サウンドオフ') : t('🔊 Sound on', '🔊 サウンドオン')}</button>
            </div>
            <p className="small">{t('One random figure per win. Collect it from the shop or we post it to you. Tip: you can use the space bar too.', '1勝につきランダムで1体。店頭受け取り、または発送します。スペースキーでも遊べます。')}</p>
          </div>

          <div className="harea">
            <div className="hgame">
              <canvas ref={canvas} width={W} height={H} onPointerDown={(e) => { e.preventDefault(); if (playing) action(); }} aria-label={t('Hero Capsule game', 'ヒーローカプセル ゲーム')} />
              {playing && <div className="hhearts" aria-label={`${hearts} lives`}>{[...Array(HEARTS)].map((_, i) => <span key={i} className={i < hearts ? '' : 'gone'}>♥</span>)}</div>}
              {phase === 'pick' && (
                <div className="hover">
                  <div className="ht">{t('Choose your hero!', 'ヒーローをえらんでね！')}</div>
                  <div className="hpick">
                    {HEROES.map((h, i) => (
                      <button key={h.key} type="button" onClick={() => start(i)} disabled={soldOut}>
                        <img src={h.src} alt="" /><span>{t(h.name[0], h.name[1])}</span>
                      </button>
                    ))}
                  </div>
                  {soldOut && <div className="hs">{t('All out for now!', '今は品切れです')}</div>}
                </div>
              )}
              {phase === 'lost' && (
                <div className="hover">
                  <div className="ht">{t('Oops! Game over', 'あらら！ゲームオーバー')}</div>
                  <div className="hs">{t(msg[0], msg[1])}</div>
                  <button className="btn" type="button" onClick={() => start(hero)} style={{ background: 'var(--pink)', color: '#fff' }}>{t('Try again', 'もう一回')}</button>
                </div>
              )}
              {phase === 'won' && (
                <div className="hover">
                  <div className="hbigcap" aria-hidden="true" />
                  <div className="ht">{t(`You K.O.'d ${B.name[0]}!`, `${B.name[1]}をKO！`)}</div>
                  <div className="hs">{t(msg[0], msg[1])}</div>
                  <div className="hcardbtns">
                    {live && <button className="btn" type="button" onClick={() => setOpen(true)} style={{ background: 'var(--pink)', color: '#fff' }}>{t('View basket →', 'カートを見る →')}</button>}
                    <button className="btn" type="button" onClick={() => setPhase('pick')} style={{ background: '#fff' }}>{t('Play again', 'もう一回あそぶ')}</button>
                  </div>
                </div>
              )}
            </div>
            {playing && <button className="hbig" type="button" onPointerDown={(e) => { e.preventDefault(); action(); }}>{btn}</button>}
            <p className="hint" aria-live="polite">{playing || phase === 'ko' ? t(msg[0], msg[1]) : ' '}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
