import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout title="Page Not Found — Kanatani Toys" path="/404" noindex>
      <section className="floor textpage">
        <div className="wrap">
          <div className="sheet" style={{ textAlign: 'center' }}>
            <span className="kicker">404 · 迷子</span>
            <img src="/nl/pink_head_bold.png" alt="" style={{ width: 180, display: 'block', margin: '24px auto 0' }} />
            <h1 className="big">Lost in the wild!</h1>
            <p>This page doesn&apos;t exist. Maybe it wandered off with a stray kaiju. Let&apos;s get you back to the toys.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
              <Link className="btn" href="/#shop" style={{ background: 'var(--sky)' }}>← Back to the shop</Link>
              <Link className="btn" href="/about" style={{ background: '#fff' }}>Find us</Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
