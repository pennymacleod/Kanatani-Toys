import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

// T-shirts in the shop. Add new ones here (photo in public/nl/tshirts/).
// Once a shirt is added to Square with its price and sizes, it can be bought
// online from the main shop too; until then this page sends people to the shop.
// `inShop` is how many Penny has, for reference only (not shown on the page).
const SHIRTS = [
  { name: 'Dracula Roams', img: '/nl/tshirts/dracula-roams.jpg', colour: '#FF1F8F', inShop: 2 },
  { name: 'Small Town Ghoul', img: '/nl/tshirts/small-town-ghoul.jpg', colour: '#FFD21F', inShop: 2 },
  { name: 'Creature', img: '/nl/tshirts/creature.jpg', colour: '#3FB7F0', inShop: 6 },
];

const IG = 'https://www.instagram.com/kanatani_toys';

export default function TShirts() {
  const [big, setBig] = useState(null);

  useEffect(() => {
    if (big === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setBig(null);
      else if (e.key === 'ArrowLeft') setBig(i => (i - 1 + SHIRTS.length) % SHIRTS.length);
      else if (e.key === 'ArrowRight') setBig(i => (i + 1) % SHIRTS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big]);

  return (
    <Layout
      title="T-shirts — Kanatani Toys"
      description="Monster and horror t-shirts at Kanatani Toys, Unit 7, Brighton Open Market."
      path="/t-shirts"
      active="tshirts"
    >
      <section className="floor">
        <div className="wrap" style={{ textAlign: 'center', paddingTop: 56 }}>
          <span className="kicker">Tシャツ · MONSTER TEES</span>
          <h1 className="big" style={{ fontSize: 'clamp(50px,8vw,104px)', margin: '18px 0 16px', color: 'var(--pink)' }}>
            T-<span style={{ color: 'var(--sky)' }}>shirts!</span>
          </h1>
          <p style={{ fontSize: 21, fontWeight: 600, maxWidth: '32em', margin: '0 auto' }}>
            Monsters, ghouls and creatures to wear. Available online soon, or come and try them on in the shop!
          </p>
        </div>
      </section>

      <section className="floor" style={{ padding: '40px 0 80px' }}>
        <div className="wrap">
          <div className="cabinet">
            <div className="shelf tees">
              {SHIRTS.map((s, i) => (
                <div key={s.name} className="card" style={{ background: s.colour }}>
                  <button type="button" className="shot teezoom" onClick={() => setBig(i)} aria-label={`Show the ${s.name} t-shirt bigger`}>
                    <img src={s.img} alt={`${s.name} t-shirt`} loading="lazy" />
                    <span className="zoomhint" aria-hidden="true">Tap to enlarge</span>
                  </button>
                  <div className="name" style={{ fontSize: 20 }}>{s.name}</div>
                  <div className="price"><span>Available online soon</span></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 36 }}>
            <Link className="btn" href="/about" style={{ background: 'var(--gold)' }}>Come and try them on →</Link>
            <a className="btn" href={IG} target="_blank" rel="noopener noreferrer" style={{ background: '#fff' }}>Ask about sizes on Instagram</a>
          </div>
        </div>
      </section>

      {big !== null && (
        <div className="lightbox" onClick={() => setBig(null)} role="dialog" aria-modal="true" aria-label={`${SHIRTS[big].name} t-shirt`}>
          <button type="button" className="lbbtn lbclose" onClick={(e) => { e.stopPropagation(); setBig(null); }} aria-label="Close">✕</button>
          <button type="button" className="lbbtn lbprev" onClick={(e) => { e.stopPropagation(); setBig(i => (i - 1 + SHIRTS.length) % SHIRTS.length); }} aria-label="Previous t-shirt">‹</button>
          <img src={SHIRTS[big].img} alt={`${SHIRTS[big].name} t-shirt`} onClick={(e) => e.stopPropagation()} />
          <button type="button" className="lbbtn lbnext" onClick={(e) => { e.stopPropagation(); setBig(i => (i + 1) % SHIRTS.length); }} aria-label="Next t-shirt">›</button>
          <div className="lbcount">{SHIRTS[big].name} · available online soon</div>
        </div>
      )}
    </Layout>
  );
}
