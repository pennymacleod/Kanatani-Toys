import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

export default function Privacy() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Privacy Policy — Kanatani Toys</title>
        <meta name="description" content="How Kanatani Toys collects, uses and protects your personal data." />
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
            <a href="/sofubi-showcase">Sofubi Showcase</a>
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
            <h1 className={styles.title}>Privacy Policy</h1>
          </div>

          <div className={styles.legalContent}>
            <p className={styles.legalUpdated}>Last updated: 15 July 2026</p>

            <h2>Who we are</h2>
            <p>Kanatani Toys is run by Penny Macleod, trading from Old Needlemakers, West Street, Lewes, East Sussex, BN7 2NZ. For any questions about this policy or your personal data, contact us at <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a>. We're the data controller for the personal data described below.</p>

            <h2>What data we collect</h2>
            <p>You don't need an account to browse or buy from this site, and we don't run any contact or newsletter sign-up forms that collect your personal data directly.</p>
            <p>When you place an order, you're taken to a secure payment page hosted by Square, our payment provider. Square collects your name, delivery address, email address and payment details in order to process your order and arrange delivery. Square acts as an independent data controller for this information — see <a href="https://squareup.com/legal/privacy" target="_blank" rel="noopener noreferrer">Square's Privacy Policy</a> for details of how they handle it.</p>
            <p>If you email us directly, we'll have your email address and whatever you tell us, used only to reply to you and handle your enquiry or order.</p>

            <h2>Cookies and third-party services</h2>
            <p>This site doesn't use cookies for tracking or advertising, and we don't run any analytics software ourselves.</p>
            <p>A couple of third-party services are used to make the site work, which may set their own cookies or log your IP address when loaded:</p>
            <ul>
              <li>Google Maps, used on our Find Us page to show our location</li>
              <li>Google Fonts, used to display the site's typefaces</li>
            </ul>
            <p>These are provided by Google — see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>. Our web host (Vercel) keeps standard server access logs, like IP address and browser type, for security and reliability, as is normal for any website.</p>

            <h2>How long we keep data</h2>
            <p>We don't store your personal data ourselves. Order and payment information is held by Square in line with their own retention policy.</p>

            <h2>Your rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul>
              <li>access the personal data held about you</li>
              <li>ask us to correct inaccurate data</li>
              <li>ask us to delete your data</li>
              <li>restrict or object to how it's used</li>
              <li>request your data in a portable format</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:kanatanitoys@gmail.com">kanatanitoys@gmail.com</a>. You also have the right to complain to the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">Information Commissioner's Office</a> if you think we've mishandled your data.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. Any changes will be posted on this page.</p>
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
