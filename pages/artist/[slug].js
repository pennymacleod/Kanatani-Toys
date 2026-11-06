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

  // Pieces also sold on the website (`shop: "Square item name"`): look them up
  // live so the card shows the real price and stock and links straight to the
  // product page (Penny, 6 Nov 2026).
  const [online, setOnline] = useState({});
  useEffect(() => {
    if (!a.work.some(w => w.shop)) return;
    let gone = false;
    fetch('/api/catalog').then(r => r.json()).then(d => {
      if (gone) return;
      const m = {};
      for (const p of d.products || []) m[String(p.name).trim().toLowerCase()] = p;
      setOnline(m);
    }).catch(() => {});
    return () => { gone = true; };
  }, [slug]);
  const findOnline = (w) => w.shop && online[String(w.shop).trim().toLowerCase()];
  const stockOf = (p) => {
    const v = (p.allVariations || []).map(x => x.stock);
    if (v.some(x => x === null)) return null;
    return v.length ? v.reduce((n, x) => n + (x || 0), 0) : p.stock;
  };

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
                <a className="btn" href="#work" style={{ background: 'var(--pink)', color: '#fff' }}>{a.comingSoon ? t('See what\u2019s coming ↓', '入荷予定の作品を見る ↓') : t('See what\u2019s in the shop ↓', 'お店にある作品を見る ↓')}</a>
              </div>
            </div>
            <div className="mpanel">
              <div className="burst">{a.figure && <img className={`fig${a.printFigure ? ' printfig' : a.photoFigure ? ' photo' : ''}${a.figureFlush ? ' flush' : ''}`} src={a.figure} alt={a.printFigure ? `${a.name} print` : `${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.comingSoon ? t('Coming soon to the shop', '近日入荷') : t('In the shop now', '店頭にあります')}</span></span>
          </div>

          {(
            <>
              {a.work.length > 0 && <p className="wintro">{t('Tap a photo to see it bigger.', '写真をタップすると大きく見られます。')}</p>}
              {a.work.length === 0 && (
                <p className="wintro">{a.comingSoon
                  ? t(`${a.name}'s work is on its way to the shop. Follow them on Instagram to see it first.`, `${a.name}の作品は入荷準備中です。Instagramでいち早くチェックしてください。`)
                  : t(`${a.name}'s work is in our cabinets and on the shelves. Pop in to see it, or follow them on Instagram.`, `${a.name}の作品は店内のケースや棚に並んでいます。ぜひお店で見てください。Instagramもチェック！`)}</p>
              )}
              {a.work.length > 0 && <div className="wgrid">
                {a.work.map((w, i) => (
                  // A gallery, not a shop. `shop: "word"` swaps the DM button for a
                  // "Buy online" link once that piece is on Square.
                  <div key={w.name} className="wcard" id={pieceId(w.name)}>
                    <button type="button" className={`wshot${w.photo === false ? '' : ' photo'}`} onClick={() => setBig(i)} aria-label={`Show ${w.name} bigger`}>
                      <img src={w.img} alt={w.name} loading="lazy" />
                    </button>
                    <div className="wname">{w.name}</div>
                    {(() => {
                      const p = findOnline(w);
                      const left = p ? stockOf(p) : null;
                      const soldOut = w.sold || (p && left === 0);
                      return (
                        <div className="wbottom">
                          <span className="wprice">{soldOut ? t('SOLD OUT', '売り切れ')
                            : a.comingSoon ? t('Coming soon', '近日入荷')
                            : w.shop ? `${p ? `£${(p.price / 100).toFixed(2).replace(/\.00$/, '')} · ` : ''}${t('Online & in the shop', 'オンライン・店頭で販売中')}`
                            : t('In the shop', '店頭にあります')}</span>
                          {w.shop && !soldOut
                            ? <Link className="btn wdm" href={p ? `/product/${p.id}` : `/?q=${encodeURIComponent(w.shop)}#shop`}>{t('Buy it now →', '今すぐ買う →')}</Link>
                            : !soldOut && <a className="btn wdm" href={ASK} target="_blank" rel="noopener noreferrer">💬 {t('Ask about it', 'DMで聞く')}</a>}
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>}
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
