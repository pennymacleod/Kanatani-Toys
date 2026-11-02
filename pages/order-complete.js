import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useCart } from '../lib/cart';

export default function OrderComplete() {
  const { clear } = useCart();

  // Square only sends people here after a successful payment, so empty the basket.
  useEffect(() => { clear(); }, []);

  return (
    <Layout title="Order Complete — Kanatani Toys" path="/order-complete" noindex>
      <section className="floor textpage">
        <div className="wrap">
          <div className="sheet" style={{ textAlign: 'center' }}>
            <span className="kicker">ありがとう · THANK YOU</span>
            <div style={{ fontSize: 72, margin: '20px 0 0' }} aria-hidden="true">🎉</div>
            <h1 className="big">Order confirmed!</h1>
            <p>Thank you for your order. You&apos;ll get a confirmation email shortly, and we&apos;ll pack your new weird little friend with care.</p>
            <Link className="btn" href="/#shop" style={{ background: 'var(--sky)', marginTop: 16 }}>← Back to the shop</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
