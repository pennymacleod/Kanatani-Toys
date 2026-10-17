import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';
import Nav from '../components/Nav';
import SocialLinks from '../components/SocialLinks';
import SocialFeeds from '../components/SocialFeeds';
import LegalLinks from '../components/LegalLinks';
import { HOURS, isOpenNow, nextOpenSunday, shopTime } from '../lib/shop';

export default function About() {
  const router = useRouter();
  // Date-dependent values are set after mount so the statically built page
  // never ships a stale "open now" or "next Sunday" to the browser.
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(shopTime()); }, []);
  const open = now ? isOpenNow(now) : false;
  const nextSunday = now
    ? nextOpenSunday(now).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : null;
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <>
      <Head>
        <title>Visit Us — Kanatani Toys, Brighton</title>
        <meta name="description" content="Find Kanatani Toys at Open Market, Unit 7, Marshalls Row, Brighton, BN1 4JU. Opening hours and directions." />
        <meta property="og:title" content="Visit Us — Kanatani Toys, Brighton" />
        <meta property="og:description" content="Find Kanatani Toys at Open Market, Unit 7, Marshalls Row, Brighton, BN1 4JU. Opening hours and directions." />
        <meta property="og:image" content="https://kanatanitoys.com/social-share.jpg" />
        <meta property="og:image:width" content="1254" />
        <meta property="og:image:height" content="1254" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://kanatanitoys.com/about" />
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
              <div className={homeStyles.logoSub}>カナタニ · TOYS · BRIGHTON</div>
            </div>
          </div>
          <Nav active="find-us" />
          <div className={homeStyles.headerRight}>
            <SocialLinks />
            <a href="/" className={homeStyles.cartBtn} style={{ textDecoration: 'none' }}>
              ← <span className={homeStyles.cartLabel}>Back to Shop</span>
            </a>
          </div>
        </header>

        <div className={styles.page}>
          {/* Hero */}
          <div className={styles.hero}>
            <p className={styles.eyebrow}>カナタニ · BRIGHTON &amp; HOVE</p>
            <h1 className={styles.title}>Find Us</h1>
            {now && (
              <div className={`${styles.statusBadge} ${open ? styles.statusOpen : styles.statusClosed}`}>
                {open ? '⬤ Open Now' : '⬤ Closed Now'}
              </div>
            )}
          </div>

          <div className={styles.layout}>
            {/* Left — info */}
            <div className={styles.infoCol}>

              {/* Address */}
              <div className={styles.card}>
                <div className={styles.cardLabel}>LOCATION</div>
                <div className={styles.address}>
                  <div>Kanatani Toys</div>
                  <div>Open Market, Unit 7</div>
                  <div>Marshalls Row</div>
                  <div>Brighton &amp; Hove, BN1 4JU</div>
                </div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Open+Market+Unit+7+Marshalls+Row+Brighton+BN1+4JU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  Get Directions →
                </a>
              </div>

              {/* Contact */}
              <div className={styles.card} id="contact">
                <div className={styles.cardLabel}>CONTACT</div>
                <a href="mailto:kanatanitoys@gmail.com" className={styles.email}>
                  kanatanitoys@gmail.com
                </a>
                <a href="tel:+447484826746" className={styles.email} style={{ display: 'block', marginTop: 6 }}>
                  +44 7484 826746
                </a>
              </div>

              {/* Hours */}
              <div className={styles.card}>
                <div className={styles.cardLabel}>OPENING HOURS</div>
                <div className={styles.hours}>
                  {HOURS.map(({ day, open: o, close: c, alternate }) => {
                    const today = !!now && now.toLocaleDateString('en-GB', { weekday: 'long' }) === day;
                    return (
                      <div key={day} className={`${styles.hourRow} ${today ? styles.hourToday : ''}`}>
                        <span className={styles.hourDay}>{day}</span>
                        <span className={styles.hourTime}>
                          {o ? `${o} – ${c}${alternate ? ' (every other week)' : ''}` : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                  {nextSunday && (
                    <div className={styles.hourRow}>
                      <span className={styles.hourDay}>Next Sunday open</span>
                      <span className={styles.hourTime}>{nextSunday}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right — map */}
            <div className={styles.mapCol}>
              <div className={styles.mapWrap}>
                {mapLoaded ? (
                  <iframe
                    title="Kanatani Toys location"
                    src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCdAxai6mQFAdEjuy2BwK1IhHlHrklNuVg&q=Open+Market,Marshalls+Row,Brighton,BN1+4JU"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setMapLoaded(true)}
                    className={styles.mapPlaceholder}
                  >
                    <span>📍</span>
                    <span>Click to load map</span>
                    <span className={styles.mapPlaceholderNote}>Loads Google Maps — see our Privacy Policy</span>
                  </button>
                )}
              </div>
              {/* Fallback static map link */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kanatani+Toys+Open+Market+Marshalls+Row+Brighton+BN1+4JU"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Open in Google Maps ↗
              </a>
            </div>
          </div>

          {/* Social feeds */}
          <div className={styles.hero} style={{ marginTop: 56, marginBottom: 24 }}>
            <p className={styles.eyebrow}>フォロー · FOLLOW ALONG</p>
            <h2 className={styles.title} style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}>Follow Us</h2>
          </div>
          <SocialFeeds />
        </div>

        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo.png" alt="" className={homeStyles.footerLogo} />
            <div>
              <div className={homeStyles.footerName}>KANATANI TOYS</div>
              <div className={homeStyles.footerSub}>Brighton · Tue–Sat + alternate Sundays</div>
            </div>
          </div>
          <div className={homeStyles.footerRight}>
            Open Market · Unit 7 · Marshalls Row · Brighton · BN1 4JU
            <LegalLinks />
          </div>
        </footer>
      </div>
    </>
  );
}
