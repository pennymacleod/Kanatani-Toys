// Preview page for the sticker-wheel pop-up (Penny, 22 Nov 2026): the wheel opens
// straight away here. While SIGNUP_LIVE is false it's a preview and sends nothing.
// Not in the nav, noindex, robots-disallowed.
import Layout from '../components/Layout';

export default function Spin() {
  return (
    <Layout title="Spin to win — Kanatani Toys" description="Spin the Kanatani Toys sticker wheel." path="/spin" page="spin" noindex>
      <section className="floor textpage">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h1 className="big" style={{ color: 'var(--pink)' }}>SPIN TO WIN!</h1>
          <p style={{ fontWeight: 700 }}>Closed the wheel? Tap below to bring it back.</p>
          <p><a className="btn" href="/spin" style={{ background: 'var(--sky)', color: '#141018' }}>Show the wheel again</a></p>
        </div>
      </section>
    </Layout>
  );
}
