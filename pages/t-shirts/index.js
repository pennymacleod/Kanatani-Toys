import Link from 'next/link';
import Layout from '../../components/Layout';
import { SHIRTS, IG } from '../../lib/tshirts';

export default function TShirts() {
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
              {SHIRTS.map(s => (
                <Link key={s.slug} href={`/t-shirts/${s.slug}`} className="card" style={{ background: s.colour }}>
                  <div className="shot"><img src={s.img} alt={`${s.name} t-shirt`} loading="lazy" /></div>
                  <div className="name" style={{ fontSize: 20 }}>{s.name}</div>
                  <div className="price"><span>Available online soon</span></div>
                </Link>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 36 }}>
            <Link className="btn" href="/about" style={{ background: 'var(--gold)' }}>Come and try them on →</Link>
            <a className="btn" href={IG} target="_blank" rel="noopener noreferrer" style={{ background: '#fff' }}>Ask about sizes on Instagram</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
