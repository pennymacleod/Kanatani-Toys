import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/About.module.css';
import homeStyles from '../styles/Home.module.css';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

const HOURS = [
  { day: 'Monday',    open: null,    close: null },
  { day: 'Tuesday',   open: '10:30', close: '17:00' },
  { day: 'Wednesday', open: '10:30', close: '17:00' },
  { day: 'Thursday',  open: '10:30', close: '17:00' },
  { day: 'Friday',    open: '10:30', close: '17:00' },
  { day: 'Saturday',  open: '10:30', close: '17:00' },
  { day: 'Sunday',    open: null,    close: null },
];

function isOpenNow() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const hour = now.getHours();
  const min = now.getMinutes();
  const current = hour * 60 + min;
  const todayHours = HOURS[day === 0 ? 6 : day - 1];
  if (!todayHours.open) return false;
  const [oh, om] = todayHours.open.split(':').map(Number);
  const [ch, cm] = todayHours.close.split(':').map(Number);
  return current >= oh * 60 + om && current < ch * 60 + cm;
}

export default function About() {
  const router = useRouter();
  const open = isOpenNow();

  return (
    <>
      <Head>
        <title>Visit Us — Kanatani Toys, Lewes</title>
        <meta name="description" content="Find Kanatani Toys at Old Needlemakers, West Street, Lewes, BN7 2NZ. Opening hours and directions." />
        <meta property="og:title" content="Visit Us — Kanatani Toys, Lewes" />
        <meta property="og:description" content="Find Kanatani Toys at Old Needlemakers, West Street, Lewes, BN7 2NZ. Opening hours and directions." />
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
              <div className={homeStyles.logoSub}>カナタニ · TOYS · LEWES</div>
            </div>
          </div>
          <nav className={homeStyles.nav}>
            <a href="/#shop">Shop</a>
            <a href="/our-story">Our Story</a>
            <a href="/about" className={homeStyles.navActive}>Find Us</a>
          </nav>
          <div className={homeStyles.headerRight}>
            <SocialLinks />
            <a href="/" className={homeStyles.cartBtn} style={{ textDecoration: 'none' }}>
              ← Back to Shop
            </a>
          </div>
        </header>

        <div className={styles.page}>
          {/* Hero */}
          <div className={styles.hero}>
            <p className={styles.eyebrow}>カナタニ · LEWES · EAST SUSSEX</p>
            <h1 className={styles.title}>Find Us</h1>
            <div className={`${styles.statusBadge} ${open ? styles.statusOpen : styles.statusClosed}`}>
              {open ? '⬤ Open Now' : '⬤ Closed Now'}
            </div>
          </div>

          <div className={styles.layout}>
            {/* Left — info */}
            <div className={styles.infoCol}>

              {/* Address */}
              <div className={styles.card}>
                <div className={styles.cardLabel}>LOCATION</div>
                <div className={styles.address}>
                  <div>Kanatani Toys</div>
                  <div>Old Needlemakers</div>
                  <div>West Street</div>
                  <div>Lewes, BN7 2NZ</div>
                </div>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Old+Needlemakers+West+Street+Lewes+BN7+2NZ"
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
              </div>

              {/* Hours */}
              <div className={styles.card}>
                <div className={styles.cardLabel}>OPENING HOURS</div>
                <div className={styles.hours}>
                  {HOURS.map(({ day, open: o, close: c }) => {
                    const today = new Date().toLocaleDateString('en-GB', { weekday: 'long' }) === day;
                    return (
                      <div key={day} className={`${styles.hourRow} ${today ? styles.hourToday : ''}`}>
                        <span className={styles.hourDay}>{day}</span>
                        <span className={styles.hourTime}>
                          {o ? `${o} – ${c}` : 'Closed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — map */}
            <div className={styles.mapCol}>
              <div className={styles.mapWrap}>
                <iframe
                  title="Kanatani Toys location"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCdAxai6mQFAdEjuy2BwK1IhHlHrklNuVg&q=Old+Needlemakers,West+Street,Lewes,BN7+2NZ"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Fallback static map link */}
              <a
                href="https://www.google.com/maps/place/Old+Needlemakers,+West+St,+Lewes+BN7+2NZ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                Open in Google Maps ↗
              </a>
            </div>
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
