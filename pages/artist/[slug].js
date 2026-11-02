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
  const { lang, t } = useLang();

  // Open the photo a DM link points at (e.g. /artist/goatee#p-neurami).
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    const n = a.work.findIndex(w => pieceId(w.name) === h);
    if (n >= 0) setBig(n);
  }, [slug]);

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
              {a.bio && <p className="mbio">{t(a.bio, a.bio_ja || a.bio)}</p>}
              <div className="mbtns">
                {a.instagram && <a className="btn" href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#141018' }}>Instagram · {a.handle}</a>}
                {a.website && <a className="btn" href={a.website} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--sky)', color: '#141018' }}>{t('Website ↗', 'ウェブサイト ↗')}</a>}
                <a className="btn" href="#work" style={{ background: 'var(--pink)', color: '#fff' }}>{t('See what\u2019s in the shop ↓', 'お店にある作品を見る ↓')}</a>
              </div>
            </div>
            <div className="mpanel">
              <div className="burst">{a.figure && <img className={`fig${a.printFigure ? ' printfig' : a.photoFigure ? ' photo' : ''}${a.figureFlush ? ' flush' : ''}`} src={a.figure} alt={a.printFigure ? `${a.name} print` : `${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{t('In the shop now', '店頭にあります')}</span></span>
          </div>

          {(
            <>
              {a.work.length > 0 && <p className="wintro">{t('Tap a photo to see it bigger.', '写真をタップすると大きく見られます。')}</p>}
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
                      <span className="wprice">{w.sold ? t('SOLD OUT', '売り切れ') : t('In the shop', '店頭にあります')}</span>
                      {w.shop
                        ? <Link className="btn wdm" href={`/?q=${encodeURIComponent(w.shop)}#shop`}>{t('Buy online →', 'オンラインで買う →')}</Link>
                        : !w.sold && <a className="btn wdm" href={ASK} target="_blank" rel="noopener noreferrer">💬 {t('Ask about it', 'DMで聞く')}</a>}
                    </div>
                  </div>
                ))}
                {/* Always four spaces, like Ofuton Heaven: empty ones say photos coming soon. */}
                {Array.from({ length: Math.max(0, 4 - a.work.length) }).map((_, k) => (
                  <div key={`soon-${k}`} className="wcard wsoon">
                    <div className="wshot"><div className="ph"><img src="/nl/pink_head_bold.png" alt="" /><span>{t('Photos coming soon', '写真は準備中')}</span></div></div>
                    <div className="wname">{t('Photos coming soon', '写真は準備中')}</div>
                    <div className="wbottom"><span className="wprice">{t('In the shop', '店頭にあります')}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}


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
