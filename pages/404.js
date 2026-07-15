import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Page Not Found — Kanatani Toys</title>
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
          <div className={styles.hero} style={{ padding: '60px 0' }}>
            <p className={styles.eyebrow}>404</p>
            <h1 className={styles.title}>Lost in the Wild</h1>
            <p style={{ fontFamily: 'Nunito, sans-serif', color: '#aab', fontSize: 15, maxWidth: 420, margin: '0 auto 24px' }}>
              This page doesn't exist — maybe it wandered off with a stray kaiju. Let's get you back to the shop.
            </p>
            <a href="/" className={styles.directionsBtn}>← Back to Shop</a>
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
