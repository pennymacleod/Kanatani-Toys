import Link from 'next/link';
import Layout from '../../components/Layout';
import { ARTISTS, CATEGORY_COLOURS } from '../../lib/artists';

export default function ArtistPage({ slug }) {
  const i = ARTISTS.findIndex(a => a.slug === slug);
  const a = ARTISTS[i];
  const next = ARTISTS[(i + 1) % ARTISTS.length];
  const cat = a.categories[0];

  return (
    <Layout
      title={`${a.name} · Sofubi Showcase · Kanatani Toys`}
      description={a.bio}
      path={`/artist/${a.slug}`}
      active="showcase"
      page="artist"
    >
      <section className="floor ap">
        <div className="wrap">
          <Link className="crumb" href="/sofubi-showcase">← All Sofubi Showcase artists</Link>
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
              <div className="burst">{a.figure && <img className="fig" src={a.figure} alt={`${a.name} figure`} />}</div>
            </div>
          </div>

          <div className="workh" id="work">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(26px,4vw,40px)', color: 'var(--sky)' }}>{a.name} at Kanatani</span></span>
          </div>

          {a.work.length > 0 ? (
            <div className="wgrid">
              {a.work.map(w => (
                <Link key={w.name} className="wcard" href={`/?q=${encodeURIComponent(w.name.split(' ')[0])}#shop`}>
                  <div className="wshot"><img src={w.img} alt="" /></div>
                  <div className="wname">{w.name}</div>
                  <div className="wrow"><span className="wprice">In the shop</span><span>Find it →</span></div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="wempty">
              {a.name}&apos;s pieces are in the Sofubi Showcase cabinet at the shop. Photos are coming soon, so pop in and see them, or follow{' '}
              <a href={a.instagram} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{a.handle}</a> for their latest work.
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
