import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ARTISTS, CATEGORY_COLOURS, CATEGORY_JA, COUNTRY_JA } from '../../lib/artists';
import { useLang } from '../../lib/lang';

// What to call an artist, from their first category. Only sofubi artists
// are part of the Sofubi Showcase; everyone else is just an artist we stock.
const ROLE = {
  Sofubi: 'Sofubi artist',
  Resin: 'Resin artist',
  '3D printed': '3D printed artist',
  'Art prints': 'Artist',
  Stickers: 'Sticker artist',
  Clothing: 'Clothing designer',
};
const ROLE_JA = {
  Sofubi: 'ソフビ作家',
  Resin: 'レジン作家',
  '3D printed': '3Dプリント作家',
  'Art prints': 'アーティスト',
  Stickers: 'ステッカー作家',
  Clothing: '服飾デザイナー',
};

// Instagram DM to the shop, for "ask about it" buttons.
const ASK = 'https://ig.me/m/kanatani_toys';

// Each gallery photo gets its own link (#piece-name) that opens it big, so the
// DM we copy for the customer shows Penny exactly which piece they mean.
const pieceId = (name) => 'p-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function ArtistPage({ slug }) {
  const i = ARTISTS.findIndex(a => a.slug === slug);
  const a = ARTISTS[i];
  const next = ARTISTS[(i + 1) % ARTISTS.length];
  const cat = a.categories[0];
  const role = ROLE[cat] || 'Artist';
  const [big, setBig] = useState(null);
  const [copied, setCopied] = useState(null);
  const { lang, t } = useLang();

  // Open the photo a DM link points at (e.g. /artist/goatee#p-neurami).
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    const n = a.work.findIndex(w => pieceId(w.name) === h);
    if (n >= 0) setBig(n);
  }, [slug]);

  // Instagram can't take a photo or message from a website, so copy a
  // message with a link to the photo; the customer pastes it into the DM.
  const onAsk = (w) => {
    const link = `${window.location.origin}/artist/${a.slug}#${pieceId(w.name)}`;
    const msg = lang === 'ja'
      ? `こんにちは！${a.name}の「${w.name}」について聞きたいです：${link}`
      : `Hi! I'd like to ask about "${w.name}" by ${a.name}: ${link}`;
    try { navigator.clipboard?.writeText(msg).catch(() => {}); } catch (e) {}
    setCopied(w.name);
  };
  useEffect(() => {
    if (big === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setBig(null);
      else if (e.key === 'ArrowLeft') setBig(i => (i - 1 + a.work.length) % a.work.length);
      else if (e.key === 'ArrowRight') setBig(i => (i + 1) % a.work.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big, a.work.length]);

  return (
    <Layout
      title={lang === 'ja' ? `${a.name} · ${ROLE_JA[cat] || 'アーティスト'} · Kanatani Toys` : `${a.name} · ${role} · Kanatani Toys`}
      description={a.bio}
      path={`/artist/${a.slug}`}
      active="showcase"
      page="artist"
    >
      <section className="floor ap">
        <div className="wrap">
          <Link className="crumb" href="/sofubi-showcase">{t('← All artists', '← アーティスト一覧')}</Link>
          <div className="meetbox">
            <div className="mtext">
              <div className="mhead">
                <span className="mav"><img src={a.logo} alt={`${a.name} logo`} /></span>
                <span className="mkick">{t('MEET THE ARTIST', 'アーティスト紹介')}</span>
              </div>
              <h1 className="big mname">{a.name}</h1>
              <div className="mchips">
                {a.country && <span style={{ background: '#fff', color: '#141018' }}>★ {lang === 'ja' ? (COUNTRY_JA[a.country] || a.country) : a.country.toUpperCase()}</span>}
                {a.categories.map(c => (
                  <span key={c} style={{ background: CATEGORY_COLOURS[c] || '#FF1F8F', color: '#fff' }}>{t(c, CATEGORY_JA[c])}</span>
                ))}
              </div>
              <p className="mbio">{t(a.bio, a.bio_ja)}</p>
              <div className="mbtns">
                <a className="btn" href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#141018' }}>Instagram · {a.handle}</a>
                {a.website && <a className="btn" href={a.website} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--sky)', color: '#141018' }}>{t('Website ↗', 'ウェブサイト ↗')}</a>}
                <a className="btn" href="#work" style={{ background: 'var(--pink)', color: '#fff' }}>{a.work.length > 0 ? t('See what\u2019s in the shop ↓', 'お店にある作品を見る ↓') : t('See their work ↓', '作品を見る ↓')}</a>
              </div>
            </div>
            <div className="mpanel">
              <div className="burst">{a.figure && <img className={`fig${a.printFigure ? ' printfig' : a.photoFigure ? ' photo' : ''}${a.figureFlush ? ' flush' : ''}`} src={a.figure} alt={a.printFigure ? `${a.name} print` : `${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.work.length > 0 ? t('In the shop now', '店頭にあります') : a.name}</span></span>
          </div>

          {a.work.length > 0 && (
            <>
              <p className="wintro">{t('Tap a photo to see it bigger. Want one? Tap \u201cDM us about this\u201d: we\u2019ll copy a message with a link to that photo, then you open Instagram and paste it in.', '写真をタップすると大きく見られます。欲しいものがあったら「DMで聞く」をタップしてね。その写真へのリンク付きメッセージをコピーするので、Instagramを開いて貼り付けてください。')}</p>
              <div className="wgrid">
                {a.work.map((w, i) => (
                  // A gallery, not a shop. `shop: "word"` swaps the DM button for a
                  // "Buy online" link once that piece is on Square.
                  <div key={w.name} className="wcard" id={pieceId(w.name)}>
                    <button type="button" className={`wshot${w.photo === false ? '' : ' photo'}`} onClick={() => setBig(i)} aria-label={`Show ${w.name} bigger`}>
                      <img src={w.img} alt={w.name} loading="lazy" />
                    </button>
                    <div className="wname">{w.name}</div>
                    <div className="wbottom">
                      <span className="wprice">{t('In the shop', '店頭にあります')}</span>
                      {w.shop
                        ? <Link className="btn wdm" href={`/?q=${encodeURIComponent(w.shop)}#shop`}>{t('Buy online →', 'オンラインで買う →')}</Link>
                        : <button type="button" className="btn wdm" onClick={() => onAsk(w)}>💬 {t('DM us about this', 'DMで聞く')}</button>}
                    </div>
                    {copied === w.name && (
                      <div className="wcopied" role="status">
                        <div><b>1.</b> {t('Message copied ✓', 'メッセージをコピーしました ✓')}</div>
                        <div><b>2.</b> {t('Open Instagram and paste it in the chat:', 'Instagramを開いて、チャットに貼り付けてね：')}</div>
                        <a className="btn wig" href={ASK} target="_blank" rel="noopener noreferrer">{t('Open Instagram →', 'Instagramを開く →')}</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="wempty">
            {a.work.length > 0
              ? (lang === 'ja'
                ? <>{a.name}の作品は、ブライトン・オープンマーケットのUnit 7のショーケースや棚にもっとあります。ぜひ遊びに来てね！</>
                : <>More of {a.name}&apos;s work is in the cabinets and on the shelves at Unit 7, Brighton Open Market. Pop in and say hello!</>)
              : (lang === 'ja'
                ? <>{a.name}の作品は、ブライトン・オープンマーケットのUnit 7のショーケースや棚に並んでいます。ぜひ遊びに来てね。最新作は{' '}
                  <a href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{a.handle}</a> をフォローしてチェック！</>
                : <>You&apos;ll find {a.name}&apos;s work in the cabinets and on the shelves at Unit 7, Brighton Open Market. Pop in and say hello, or follow{' '}
                  <a href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{a.handle}</a> for their latest work.</>)}
          </div>

          <div className="anav">
            <a className="btn" href={ASK} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--pink)', color: '#fff' }}>💬 {t('DM us on Instagram', 'InstagramでDMする')}</a>
            <Link className="btn" href={`/artist/${next.slug}`} style={{ background: '#fff', color: '#141018' }}>{lang === 'ja' ? `${next.name}に会う →` : `Meet ${next.name} →`}</Link>
          </div>
        </div>
      </section>

      {big !== null && a.work[big] && (
        <div className="lightbox" onClick={() => setBig(null)} role="dialog" aria-modal="true" aria-label={a.work[big].name}>
          <button type="button" className="lbbtn lbclose" onClick={(e) => { e.stopPropagation(); setBig(null); }} aria-label="Close">✕</button>
          {a.work.length > 1 && <button type="button" className="lbbtn lbprev" onClick={(e) => { e.stopPropagation(); setBig(i => (i - 1 + a.work.length) % a.work.length); }} aria-label="Previous">‹</button>}
          <img src={a.work[big].img} alt={a.work[big].name} onClick={(e) => e.stopPropagation()} />
          {a.work.length > 1 && <button type="button" className="lbbtn lbnext" onClick={(e) => { e.stopPropagation(); setBig(i => (i + 1) % a.work.length); }} aria-label="Next">›</button>}
          <div className="lbcount">{a.work[big].name}{a.work[big].jp ? ` · ${a.work[big].jp}` : ''}</div>
        </div>
      )}
    </Layout>
  );
}

export function getStaticPaths() {
  return { paths: ARTISTS.map(a => ({ params: { slug: a.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
