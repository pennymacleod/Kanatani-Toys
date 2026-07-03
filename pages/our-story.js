import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';

export default function OurStory() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Our Story — Kanatani Toys</title>
        <meta name="description" content="At Kanatani Toys, we're passionate about Japanese pop culture and the artists who continue to shape it. Discover our story." />
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
          <nav className={homeStyles.nav}>
            <a href="/#shop">Shop</a>
            <a href="/our-story" style={{ color: '#00b4ff' }}>Our Story</a>
            <a href="/about">Find Us</a>
          </nav>
          <a href="/" className={homeStyles.cartBtn} style={{ textDecoration: 'none' }}>
            ← Back to Shop
          </a>
        </header>

        <div className={styles.page}>
          {/* Hero */}
          <div className={styles.hero}>
            <p className={styles.eyebrow}>カナタニ · LEWES · EAST SUSSEX</p>
            <h1 className={styles.title}>Our Story</h1>
          </div>

          {/* Shopfront photo */}
          <div className={styles.storyPhotoWrap}>
            <img
              src="/store-front.png"
              alt="Kanatani Toys shopfront in Lewes, East Sussex"
              className={styles.storyPhoto}
            />
          </div>

          {/* Brand story */}
          <div className={styles.story}>
            <div className={styles.storyLabel}>OUR STORY</div>
            <p>At Kanatani Toys, we're passionate about Japanese pop culture and the incredible artists who continue to shape it.</p>
            <p>Our mission is to bring a carefully curated collection of Japanese toys, art and collectibles to the UK, celebrating everything from kaiju and Godzilla to sofubi, designer toys and independent artists.</p>
            <p>Several times a year we travel to Japan, personally hand-picking unique vintage and second-hand treasures that are then shipped back to our shop in the UK. Alongside these finds, we proudly showcase work from independent artists from Japan, the UK and around the world whose creations are inspired by Japanese pop culture.</p>
            <p>Every item in our shop is carefully chosen because we genuinely love it. Whether you're searching for a rare vintage figure, an independent sofubi release or something wonderfully weird, we hope you'll discover something special.</p>
            <p>Kanatani Toys is more than just a toy shop—it's a place to celebrate Japanese creativity, support talented artists, and share our passion for unique collectibles.</p>
            <p className={styles.storyTagline}>Strange Toys for Strange People.</p>
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
          </div>
        </footer>
      </div>
    </>
  );
}
