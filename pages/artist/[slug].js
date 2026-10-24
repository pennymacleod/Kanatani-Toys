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
    const msg = `Hi! I'd like to ask about "${w.name}" by ${a.name}: ${link}`;
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
              <div className="burst">{a.figure && <img className={`fig${a.printFigure ? ' printfig' : a.photoFigure ? ' photo' : ''}${a.figureFlush ? ' flush' : ''}`} src={a.figure} alt={a.printFigure ? `${a.name} print` : `${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.work.length > 0 ? 'In the shop now' : a.name}</span></span>
          </div>

          {a.work.length > 0 && (
            <>
              <p className="wintro">Tap a photo to see it bigger. Want one? Tap &ldquo;DM us about this&rdquo;: we&apos;ll copy a message with a link to that photo, then you open Instagram and paste it in.</p>
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
                      <span className="wprice">In the shop</span>
                      {w.shop
                        ? <Link className="btn wdm" href={`/?q=${encodeURIComponent(w.shop)}#shop`}>Buy online →</Link>
                        : <button type="button" className="btn wdm" onClick={() => onAsk(w)}>💬 DM us about this</button>}
                    </div>
                    {copied === w.name && (
                      <div className="wcopied" role="status">
                        <div><b>1.</b> Message copied ✓</div>
                        <div><b>2.</b> Open Instagram and paste it in the chat:</div>
                        <a className="btn wig" href={ASK} target="_blank" rel="noopener noreferrer">Open Instagram →</a>
                      </div>
                    )}
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
