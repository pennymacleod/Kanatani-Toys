import Head from 'next/head';
import { useRouter } from 'next/router';
import aboutStyles from '../styles/About.module.css';
import styles from '../styles/SofubiShowcase.module.css';
import homeStyles from '../styles/Home.module.css';
import Nav from '../components/Nav';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

const IMAGES = [
  { src: '/sofubi-showcase/goatee-showcase-card.png', alt: 'Sofubi Showcase — Goatee, Italy' },
  { src: '/sofubi-showcase/pepperjerry-showcase-card.png', alt: 'Sofubi Showcase — Pepperjerry, Urban Devil, Taiwan' },
];

export default function SofubiShowcase() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Sofubi Showcase — Kanatani Toys</title>
        <meta name="description" content="Meet the independent sofubi artists behind the figures — Goatee (Italy) and Pepperjerry / Urban Devil (Taiwan)." />
        <meta property="og:title" content="Sofubi Showcase — Kanatani Toys" />
        <meta property="og:description" content="Meet the independent sofubi artists behind the figures — Goatee (Italy) and Pepperjerry / Urban Devil (Taiwan)." />
        <meta property="og:image" content="https://kanatanitoys.com/social-share.jpg" />
        <meta property="og:image:width" content="1254" />
        <meta property="og:image:height" content="1254" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kanatanitoys.com/sofubi-showcase" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://kanatanitoys.com/social-share.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={homeStyles.root}>
        {/* Header */}
        <header className={homeStyles.header}>
          <div className={homeStyles.headerLogo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Kanatani Toys" className={homeStyles.logo} />
            <div>
              <div className={homeStyles.logoText}>KANATANI</div>
              <div className={homeStyles.logoSub}>カナタニ · TOYS · LEWES</div>
            </div>
          </div>
          <Nav active="sofubi-showcase" />
          <div className={homeStyles.headerRight}>
            <SocialLinks />
            <a href="/" className={homeStyles.cartBtn} style={{ textDecoration: 'none' }}>
              ← <span className={homeStyles.cartLabel}>Back to Shop</span>
            </a>
          </div>
        </header>

        <div className={aboutStyles.page}>
          <h1 className={styles.srOnly}>Sofubi Showcase</h1>

          <div className={styles.grid}>
            {IMAGES.map((img) => (
              <img key={img.src} src={img.src} alt={img.alt} className={styles.image} />
            ))}
          </div>
        </div>

        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo.png" alt="" className={homeStyles.footerLogo} />
            <div>
              <div className={homeStyles.footerName}>KANATANI TOYS</div>
              <div className={homeStyles.footerSub}>Strange Toys for Strange People</div>
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
