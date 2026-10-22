import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ARTISTS, CATEGORY_COLOURS } from '../../lib/artists';

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

// Instagram DM to the shop, for "ask about it" buttons.
const ASK = 'https://ig.me/m/kanatani_toys';

export default function ArtistPage({ slug }) {
  const i = ARTISTS.findIndex(a => a.slug === slug);
  const a = ARTISTS[i];
  const next = ARTISTS[(i + 1) % ARTISTS.length];
  const cat = a.categories[0];
  const role = ROLE[cat] || 'Artist';
  const [big, setBig] = useState(null);
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
      title={`${a.name} · ${role} · Kanatani Toys`}
      description={a.bio}
      path={`/artist/${a.slug}`}
      active="showcase"
      page="artist"
    >
      <section className="floor ap">
        <div className="wrap">
          <Link className="crumb" href="/sofubi-showcase">← All artists</Link>
          <div className="meetbox">
            <div className="mtext">
              <div className="mhead">
                <span className="mav"><img src={a.logo} alt={`${a.name} logo`} /></span>
                <span className="mkick">MEET THE ARTIST</span>
              </div>
              <h1 className="big mname">{a.name}</h1>
              <div className="mchips">
                {a.country && <span style={{ background: '#fff', color: '#141018' }}>★ {a.country.toUpperCase()}</span>}
                {a.categories.map(c => (
                  <span key={c} style={{ background: CATEGORY_COLOURS[c] || '#FF1F8F', color: '#fff' }}>{c}</span>
                ))}
              </div>
              <p className="mbio">{a.bio}</p>
              <div className="mbtns">
                <a className="btn" href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: '#141018' }}>Instagram · {a.handle}</a>
                <a className="btn" href="#work" style={{ background: 'var(--pink)', color: '#fff' }}>{a.work.length > 0 ? 'See what\u2019s in the shop ↓' : 'See their work ↓'}</a>
              </div>
            </div>
            <div className="mpanel">
              <div className="burst">{a.figure && <img className={`fig${a.photoFigure ? ' photo' : ''}`} src={a.figure} alt={`${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.work.length > 0 ? 'In the shop now' : a.name}</span></span>
          </div>

          {a.work.length > 0 && (
            <>
              <p className="wintro">Tap a photo to see it bigger. Want one? Send us a message and we&apos;ll tell you all about it.</p>
              <div className="wgrid">
                {a.work.map((w, i) => (
                  // A gallery, not a shop. `shop: "word"` swaps the DM button for a
                  // "Buy online" link once that piece is on Square.
                  <div key={w.name} className="wcard">
                    <button type="button" className={`wshot${w.photo === false ? '' : ' photo'}`} onClick={() => setBig(i)} aria-label={`Show ${w.name} bigger`}>
                      <img src={w.img} alt={w.name} loading="lazy" />
                    </button>
                    <div className="wname">{w.name}</div>
                    <div className="wbottom">
                      <span className="wprice">In the shop</span>
                      {w.shop
                        ? <Link className="btn wdm" href={`/?q=${encodeURIComponent(w.shop)}#shop`}>Buy online →</Link>
                        : <a className="btn wdm" href={ASK} target="_blank" rel="noopener noreferrer">💬 DM us about this</a>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="wempty">
            {a.work.length > 0
              ? <>More of {a.name}&apos;s work is in the cabinets and on the shelves at Unit 7, Brighton Open Market. Pop in and say hello!</>
              : <>You&apos;ll find {a.name}&apos;s work in the cabinets and on the shelves at Unit 7, Brighton Open Market. Pop in and say hello, or follow{' '}
                <a href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{a.handle}</a> for their latest work.</>}
          </div>

          <div className="anav">
            <a className="btn" href={ASK} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--pink)', color: '#fff' }}>💬 DM us on Instagram</a>
            <Link className="btn" href={`/artist/${next.slug}`} style={{ background: '#fff', color: '#141018' }}>Meet {next.name} →</Link>
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
