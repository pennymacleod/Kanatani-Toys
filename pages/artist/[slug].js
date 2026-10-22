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

export default function ArtistPage({ slug }) {
  const i = ARTISTS.findIndex(a => a.slug === slug);
  const a = ARTISTS[i];
  const next = ARTISTS[(i + 1) % ARTISTS.length];
  const cat = a.categories[0];
  const role = ROLE[cat] || 'Artist';

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
                <a className="btn" href="#work" style={{ background: 'var(--pink)', color: '#fff' }}>See their work ↓</a>
              </div>
            </div>
            <div className="mpanel">
              <div className="burst">{a.figure && <img className={`fig${a.photoFigure ? ' photo' : ''}`} src={a.figure} alt={`${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.name}</span></span>
          </div>

          {a.work.length > 0 ? (
            <div className="wgrid">
              {a.work.map(w => {
                // `photo: true` = a real photo (fills the square); otherwise a
                // cut-out on white (shown whole). `link: false` = no shop link yet.
                const body = (
                  <>
                    <div className={`wshot${w.photo ? ' photo' : ''}`}><img src={w.img} alt={w.name} /></div>
                    <div className="wname">{w.name}</div>
                    <div className="wrow"><span className="wprice">In the shop</span>{w.link !== false && <span>Find it →</span>}</div>
                  </>
                );
                return w.link === false
                  ? <div key={w.name} className="wcard">{body}</div>
                  : <Link key={w.name} className="wcard" href={`/?q=${encodeURIComponent(w.search || w.name.split(' ')[0])}#shop`}>{body}</Link>;
              })}
            </div>
          ) : (
            <div className="wempty">
              You&apos;ll find {a.name}&apos;s work in the cabinets or on the shelves at the shop. Pop in and see it, or follow{' '}
              <a href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{a.handle}</a> on Instagram for their latest work.
            </div>
          )}

          <div className="anav">
            <Link className="btn" href="/sofubi-showcase" style={{ background: '#fff', color: '#141018' }}>← All artists</Link>
            <Link className="btn" href={`/artist/${next.slug}`} style={{ background: 'var(--pink)', color: '#fff' }}>Meet {next.name} →</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export function getStaticPaths() {
  return { paths: ARTISTS.map(a => ({ params: { slug: a.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
