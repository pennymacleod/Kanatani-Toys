import { useState } from 'react';
import Layout from '../components/Layout';
import ArtistBox from '../components/ArtistBox';
import { ARTISTS, COMING_SOON, CATEGORIES, CATEGORY_COLOURS } from '../lib/artists';

const TILES = ['ソ', 'フ', 'ビ', 'シ', 'ョ', 'ー', 'ケ', 'ー', 'ス'];

export default function SofubiShowcase() {
  const [cat, setCat] = useState('All');
  const match = (a) => cat === 'All' || a.categories.includes(cat);
  const shown = ARTISTS.filter(match);
  const soon = COMING_SOON.filter(match);

  return (
    <Layout
      title="Sofubi Showcase — Kanatani Toys"
      description="Independent sofubi and toy artists from around the world, on our shelves in Brighton every day. Meet the makers."
      path="/sofubi-showcase"
      active="showcase"
      page="showcase"
    >
      <section id="artists" className="ssb">
        <div className="tiles3" aria-hidden="true">{TILES.map((t, i) => <span key={i}>{t}</span>)}</div>
        <h1 className="big" style={{ fontSize: 120, margin: '4px 0 18px', color: 'var(--pink)', whiteSpace: 'nowrap' }}>
          Sofubi <span style={{ color: 'var(--gold)' }}>Showcase</span>
        </h1>
        <div className="mid" style={{ fontSize: 36, color: '#fff' }}>Supporting independent artists from around the world</div>
      </section>

      <section className="floor" style={{ padding: '50px 0 80px' }}>
        <div className="wrap">
          <div className="tabs" role="group" aria-label="Filter artists">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                className={`tab${cat === c ? ' on' : ''}`}
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
                style={{ '--c': CATEGORY_COLOURS[c] }}
              >
                {c}
              </button>
            ))}
          </div>

          {shown.length > 0 ? (
            <div className="agrid">
              {shown.map(a => <ArtistBox key={a.slug} artist={a} />)}
            </div>
          ) : (
            <p className="empty">No artists in this category yet. Check back soon!</p>
          )}

          {soon.length > 0 && (
            <>
              <div className="soonhead">
                <span className="plaque"><span className="mid" style={{ fontSize: 40, color: 'var(--sky)' }}>Coming soon</span></span>
                <p>New artists on their way to the shop. Follow them on Instagram so you don&apos;t miss them!</p>
              </div>
              <div className="agrid">
                {soon.map(a => <ArtistBox key={a.name} artist={a} soon />)}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
