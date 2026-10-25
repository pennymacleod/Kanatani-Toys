import { useState } from 'react';
import Layout from '../components/Layout';
import ArtistBox from '../components/ArtistBox';
import { ARTISTS, COMING_SOON, CATEGORIES, CATEGORY_COLOURS, CATEGORY_JA } from '../lib/artists';
import { useLang } from '../lib/lang';

const TILES = ['ソ', 'フ', 'ビ', 'シ', 'ョ', 'ー', 'ケ', 'ー', 'ス'];

export default function SofubiShowcase() {
  const [cat, setCat] = useState('All');
  const { lang, t } = useLang();
  const match = (a) => cat === 'All' || a.categories.includes(cat);
  // On "All", group artists in tab order: Sofubi, Resin, 3D printed, Art prints, Stickers, Clothing.
  const rank = (a) => Math.min(...a.categories.map(c => { const i = CATEGORIES.indexOf(c); return i < 0 ? 99 : i; }));
  const byTab = (list) => list.map((a, i) => [a, i]).sort((x, y) => rank(x[0]) - rank(y[0]) || x[1] - y[1]).map(x => x[0]);
  const shown = byTab(ARTISTS.filter(match));
  const soon = byTab(COMING_SOON.filter(match));

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
        <h1 className="big" style={{ fontSize: lang === 'ja' ? 'clamp(40px,7vw,84px)' : 120, margin: '4px 0 18px', color: 'var(--pink)', whiteSpace: 'nowrap' }}>
          {lang === 'ja'
            ? <>ソフビ・<span style={{ color: 'var(--gold)' }}>ショーケース</span></>
            : <>Sofubi <span style={{ color: 'var(--gold)' }}>Showcase</span></>}
        </h1>
        <div className="mid" style={{ fontSize: 36, color: '#fff' }}>{t('Supporting independent artists from around the world', '世界中のインディペンデント・アーティストを応援しています')}</div>
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
                {t(c, CATEGORY_JA[c])}
              </button>
            ))}
          </div>

          {shown.length > 0 ? (
            <div className="agrid">
              {shown.map(a => <ArtistBox key={a.slug} artist={a} />)}
            </div>
          ) : (
            <p className="empty">{t('No artists in this category yet. Check back soon!', 'このカテゴリーのアーティストはまだいません。またチェックしてね！')}</p>
          )}

          {soon.length > 0 && (
            <>
              <div className="soonhead">
                <span className="plaque"><span className="mid" style={{ fontSize: 40, color: 'var(--sky)' }}>{t('Coming soon', '近日登場')}</span></span>
                <p>{t('New artists on their way to the shop. Follow them on Instagram so you don\u2019t miss them!', '新しいアーティストがお店にやってきます。見逃さないよう、Instagramでフォローしてね！')}</p>
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
