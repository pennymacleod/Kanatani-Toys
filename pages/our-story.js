import Link from 'next/link';
import Layout from '../components/Layout';

export default function OurStory() {
  return (
    <Layout
      title="Our Story — Kanatani Toys"
      description="We're Penny and Hiro. We love Japanese sofubi, the handmade toy scene and the strange people who make it. From a tiny shop in Lewes to Brighton Open Market."
      path="/our-story"
      active="story"
      page="ourstory"
    >
      <section className="floor">
        <div className="wrap st-hero">
          <span className="kicker">OUR STORY · STRANGE TOYS FOR STRANGE PEOPLE</span>
          <h1 className="big" style={{ fontSize: 'clamp(50px,8vw,104px)' }}>No Toy, <span style={{ color: 'var(--sky)' }}>No Life</span></h1>
          <p>We&apos;re Penny and Hiro. We love Japanese sofubi, the handmade toy scene and the strange people who make it. Kanatani Toys is where we get to share it.</p>
        </div>

        <div className="wrap pair">
          <div className="photo">
            <div className="frame" style={{ '--c': 'var(--sky)', '--r': '-2.5deg' }}>
              <img src="/nl/lewes-shop.jpg" alt="Penny and Hiro outside the old Kanatani Toys shop in The Needlemakers, Lewes" style={{ objectPosition: '35% 50%' }} />
            </div>
            <span className="tag2">The Needlemakers, Lewes</span>
          </div>
          <div className="copy">
            <span className="eyebrow">HOW IT STARTED</span>
            <h2 className="big">A tiny little shop in Lewes</h2>
            <p>Kanatani Toys opened in November 2025 in The Needlemakers in Lewes. We wanted to bring the Japanese toys, art and collectibles we love to the UK: kaiju and Godzilla, sofubi, designer toys and vintage finds.</p>
            <p>We travel to Japan to hand-pick vintage and second-hand treasures, and every single thing on our shelves is something we genuinely love.</p>
          </div>
        </div>

        <div className="wrap pair flip">
          <div className="photo">
            <div className="frame" style={{ '--c': 'var(--pink)', '--r': '2deg' }}>
              <img src="/nl/brighton-us.jpg" alt="Penny and Hiro outside Kanatani Toys in Brighton" style={{ objectPosition: '30% 30%' }} />
            </div>
            <span className="tag2" style={{ left: 'auto', right: -10, transform: 'rotate(4deg)' }}>Unit 7, Open Market</span>
          </div>
          <div className="copy">
            <span className="eyebrow">WHERE WE ARE NOW</span>
            <h2 className="big">Hello, Brighton!</h2>
            <p>We&apos;d built up a lovely group of customers in Lewes, and that gave us the confidence to take the leap. In September 2026 we moved to Brighton Open Market and rebuilt our shop, so we could focus much more on the art side of the toy scene.</p>
            <p>We&apos;re loving our first month here so far!</p>
          </div>
        </div>
      </section>

      <section className="art">
        <div className="wrap inner">
          <div>
            <span className="kicker" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>ソフビ · THE SOFUBI SHOWCASE</span>
            <h2 className="big" style={{ fontSize: 'clamp(36px,5vw,60px)', marginTop: 16 }}>Hunting for crazy creations</h2>
            <p>We&apos;re lucky to connect with lots of amazing independent artists who specialise in Sofubi, and we love showcasing their crazy creations in the shop. We want to give the strange and the weird a home here in Brighton.</p>
            <p>Many of these artists have never been shown in the UK. Their work usually only appears at galleries or toy conventions, not on a shop shelf every day. So we built a home where it can be on our shelves all the time, and where people can discover this fantastic art.</p>
            <p>Alongside the sofubi you&apos;ll find lots of other independent makers: printmakers, sticker makers, t-shirt printers, and the list goes on. We&apos;re here to showcase it all.</p>
            <Link className="btn" href="/sofubi-showcase" style={{ background: 'var(--pink)', color: '#fff', marginTop: 8 }}>Meet the artists →</Link>
          </div>
        </div>
      </section>

      <section className="floor">
        <div className="wrap sign-off">
          <h2 className="big" style={{ fontSize: 'clamp(34px,5vw,56px)', color: 'var(--pink)', margin: 0 }}>Come and say hello</h2>
          <p>We&apos;re open Tuesday to Saturday, 11 to 5, and every other Sunday, 12 to 3.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn" href="/about" style={{ background: 'var(--gold)' }}>Find us →</Link>
            <Link className="btn" href="/#shop" style={{ background: '#fff' }}>Shop the toys</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
