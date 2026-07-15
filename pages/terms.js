import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms &amp; Conditions — Kanatani Toys</title>
        <meta name="description" content="Terms and conditions for shopping with Kanatani Toys." />
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={homeStyles.root}>
        <header className={homeStyles.header}>
          <div className={homeStyles.headerLogo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Kanatani Toys" className={homeStyles.logo} />
            <div>
              <div className={homeStyles.logoText}>KANATANI</div>
              <div className={homeStyles.logoSub}>カナタニ · TOYS · LEWES</div>
            </div>
          </div>
          <nav className={homeStyles.nav}>
            <a href="/#shop">Shop</a>
            <a href="/our-story">Our Story</a>
            <a href="/about">Find Us</a>
            <a href="/#testimonials">Testimonials</a>
          </nav>
          <div className={homeStyles.headerRight}>
            <SocialLinks />
            <a href="/" className={homeStyles.cartBtn} style={{ textDecoration: 'none' }}>
              ← Back to Shop
            </a>
          </div>
        </header>

        <div className={styles.page}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>カナタニ · LEGAL</p>
            <h1 className={styles.title}>Terms &amp; Conditions</h1>
          </div>

          <div className={styles.legalContent}>
            <p className={styles.legalUpdated}>Last updated: 15 July 2026</p>

            <h2>About us</h2>
            <p>Kanatani Toys is run by Penny Macleod, trading from Old Needlemakers, West Street, Lewes, East Sussex, BN7 2NZ ("we", "us", "our"). Contact us at <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a>.</p>

            <h2>Our products</h2>
            <p>We sell Japanese toys, art and collectibles, including vintage, second-hand and limited-run items. Because many items are vintage, one-off or hand-picked, stock is limited and availability isn't guaranteed until your order is confirmed. Product descriptions and images aim to be accurate, but vintage and second-hand items may show natural signs of age or wear, which we'll describe where relevant.</p>

            <h2>Prices and payment</h2>
            <p>All prices are shown in GBP and include VAT where applicable. Prices may change at any time, but changes won't affect orders already confirmed. Payment is taken securely through Square at the time of ordering — we never see or store your card details.</p>

            <h2>Orders</h2>
            <p>When you place an order, you'll be taken to a secure Square-hosted checkout page to complete payment. Your order is confirmed once payment is successful. We'll do our best to fulfil every order, but if an item turns out to be unavailable after you've ordered, we'll contact you and offer a refund or alternative.</p>

            <h2>Delivery</h2>
            <p>We aim to dispatch orders promptly, but delivery times may vary depending on the item and courier. Delivery costs and estimated timeframes are shown at checkout.</p>

            <h2>Returns and cancellations</h2>
            <p>If you're a consumer buying online, you have the right to cancel your order within 14 days of receiving it, under the Consumer Contracts Regulations 2013, without giving a reason. To cancel, contact us at <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a>. You'll need to return the item at your own cost, in the condition you received it, and we'll refund you within 14 days of receiving it back.</p>
            <p>This right doesn't apply to items that are personalised, made to order, or which you've opened in a way that means they can no longer be resold as new (we'll make this clear at the time if it applies).</p>

            <h2>Faulty or damaged items</h2>
            <p>If an item arrives faulty, damaged or not as described, you're entitled to a repair, replacement or refund under the Consumer Rights Act 2015. Contact us at <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a> with details and photos where possible, and we'll sort it out.</p>

            <h2>Our liability</h2>
            <p>We're not liable for any loss that wasn't reasonably foreseeable at the time you ordered, or for indirect losses. Nothing in these terms affects your statutory rights as a consumer.</p>

            <h2>Governing law</h2>
            <p>These terms are governed by the law of England and Wales, and any disputes will be handled by the courts of England and Wales.</p>

            <h2>Contact us</h2>
            <p>Questions about an order or these terms? Email <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a>.</p>
          </div>
        </div>

        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo.png" alt="" className={homeStyles.footerLogo} />
            <div>
              <div className={homeStyles.footerName}>KANATANI TOYS</div>
              <div className={homeStyles.footerSub}>Lewes, East Sussex · Tue–Sat</div>
            </div>
          </div>
          <div className={homeStyles.footerRight}>
            Old Needlemakers · West Street · Lewes · BN7 2NZ
            <LegalLinks />
          </div>
        </footer>
      </div>
    </>
  );
}
