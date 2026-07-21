import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import aboutStyles from '../styles/About.module.css';
import styles from '../styles/SofubiShowcase.module.css';
import homeStyles from '../styles/Home.module.css';
import SocialLinks from '../components/SocialLinks';
import LegalLinks from '../components/LegalLinks';

const SQUARE_VERSION = '2025-01-23';

const ARTISTS = [
  {
    slug: 'goatee',
    name: 'Goatee',
    country: 'Italy',
    flag: '🇮🇹',
    image: '/sofubi-showcase/goatee.jpg',
    poster: '/sofubi-showcase/goatee-poster.jpg',
    imageAlt: 'Sofubi figure by Goatee — a three-eyed alien-style character with a red scarf',
    matchKeywords: ['goatee'],
    links: [{ label: 'Instagram · @goateexdg', href: 'https://www.instagram.com/goateexdg' }],
    bio: [
      "A child of the '80s, deeply influenced by the artistic movements and creative energy of the '90s.",
      "Always hyper-creative, with a gypsy heart, part bully, part teddy bear and in sync with the universe. Raised between the streets of Northern Italy and London, I've spent my life creating music, street art, and countless artistic projects.",
      'My latest venture is Goatee, a project dedicated to sofubi toys, art toys, paintings, and whatever else the future may inspire. The journey is just beginning.',
    ],
  },
  {
    slug: 'pepperjerry',
    name: 'Pepperjerry',
    country: 'Taiwan',
    flag: '🇹🇼',
    image: '/sofubi-showcase/pepperjerry.jpg',
    poster: '/sofubi-showcase/pepperjerry-poster.jpg',
    imageAlt: 'Sofubi figure by Pepperjerry — Urban Devil, a red devil-style character in a yellow t-shirt and camo shorts',
    figureName: 'Urban Devil®',
    matchKeywords: ['urban devil', 'pepperjerry'],
    links: [
      { label: 'Instagram · @urbandevilrocks', href: 'https://www.instagram.com/urbandevilrocks' },
      { label: 'urbandevilrocks.com', href: 'https://www.urbandevilrocks.com' },
      { label: 'Facebook · PepperjerrysUrbanDevil', href: 'https://www.facebook.com/PepperjerrysUrbanDevil' },
    ],
    bio: [
      'PEPPERJERRY, from Taipei, Taiwan, Founder, creator, artist & designer of the indie designer brand IP "Urban Devil®" (Established in 2012) is fascinated with all things about American pop culture, lowbrow art, and rock styles. As well as odd and crazy illustrations and graphic arts.',
      "Growing up in the most diverse and splendid 80's to 90's, Inspired an American POP Culture, experienced the impact of underground art, lowbrow art, and subculture, and allowed madness and rock music to germinate deeply in his creation. Its most significant influence and exploration was The American entertainment industry includes movies, TV series, MTV, cartoons, comics, video games, rock music, toys, and fashion clothing. It has also gradually affected the subsequent art design styles, aesthetics, and character drawing.",
      'Graduated from The Art Institute of Seattle – Graphic Design, and during the working period as a video game artist in the gaming industry in the U.S., was deeply influenced by the trend of American West Coast art and culture.',
      'After returning to Taipei, Taiwan, worked as a media art editor, clothing artist, TV show and variety show animator, Japanese animation producer, AR, VR, MR augmented reality curator, production manager, digital content industry planner, integrated marketing specialist, and cultural and creative art director.',
    ],
  },
  {
    slug: 'astrotoys',
    name: 'AstroToys',
    country: 'Germany',
    flag: '🇩🇪',
    image: '/sofubi-showcase/astrotoys.jpg',
    poster: '/sofubi-showcase/astrotoys-poster.jpg',
    imageAlt: 'Sofubi figure by AstroToys — NitroHainer, a robotic shark-armour character in blue',
    figureName: 'NitroHainer',
    matchKeywords: ['nitrohainer', 'astrotoys'],
    links: [{ label: 'Instagram · @astro_toys', href: 'https://www.instagram.com/astro_toys' }],
    bio: [
      'AstroToys is a Germany-based independent toy artist. Since 2019, he has been hand-sculpting original characters, creating silicone molds, and casting his own resin figures.',
      'Over time, he specialized in 3D modeling to design larger-scale collectibles featuring LED lighting and interactive action mechanisms.',
      'In early 2026, he fulfilled a longtime dream by transforming his favorite original character, NitroHainer, into a sofubi toy line.',
      'Alongside toy design, he enjoys creating digital art and collaborating with artists from around the world.',
    ],
    figureNote:
      'NitroHainer is a robotic shark rockstar with a passion for loud guitars, powerful riffs, and high-energy performances. Blending shark instincts with futuristic technology, he lives to entertain and always steals the show!',
  },
];

export default function SofubiShowcase({ productLinks }) {
  const router = useRouter();
  const [lightboxSlug, setLightboxSlug] = useState(null);
  const [outOfStockSlug, setOutOfStockSlug] = useState(null);

  const lightboxArtist = ARTISTS.find(a => a.slug === lightboxSlug) || null;
  const outOfStockArtist = ARTISTS.find(a => a.slug === outOfStockSlug) || null;

  useEffect(() => {
    if (!lightboxArtist && !outOfStockArtist) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxSlug(null);
        setOutOfStockSlug(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxArtist, outOfStockArtist]);

  return (
    <>
      <Head>
        <title>Sofubi Showcase — Kanatani Toys</title>
        <meta name="description" content="Meet the independent sofubi artists behind the figures — Goatee (Italy), Pepperjerry / Urban Devil (Taiwan), and AstroToys (Germany)." />
        <meta property="og:title" content="Sofubi Showcase — Kanatani Toys" />
        <meta property="og:description" content="Meet the independent sofubi artists behind the figures — Goatee (Italy), Pepperjerry / Urban Devil (Taiwan), and AstroToys (Germany)." />
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
          <nav className={homeStyles.nav}>
            <a href="/#shop">Shop</a>
            <a href="/our-story">Our Story</a>
            <a href="/sofubi-showcase" className={homeStyles.navActive}>Sofubi Showcase</a>
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

        <div className={aboutStyles.page}>
          {/* Hero */}
          <div className={aboutStyles.hero}>
            <p className={aboutStyles.eyebrow}>ソフビ・ショーケース</p>
            <h1 className={aboutStyles.title}>Sofubi Showcase</h1>
          </div>

          <p className={styles.intro}>
            Supporting independent sofubi artists from around the world. Each showcase spotlights an artist and
            the figure they've created — their story, their process, and the character behind the vinyl.
          </p>

          <div className={styles.grid}>
            {ARTISTS.map((artist) => (
              <div key={artist.name} className={styles.card}>
                <div className={styles.cardBody}>
                  <div className={styles.artistLabel}>ARTIST</div>
                  <h2 className={styles.artistName}>{artist.name}</h2>

                  <div className={styles.meta}>
                    <span className={styles.country}>
                      <span className={styles.flag}>{artist.flag}</span>
                      {artist.country}
                    </span>
                    <span className={styles.links}>
                      {artist.links.map((link) => (
                        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label}
                        </a>
                      ))}
                    </span>
                  </div>

                  {artist.figureName && (
                    <div className={styles.figureName}>{artist.figureName}</div>
                  )}

                  <div className={styles.bio}>
                    {artist.bio.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {artist.figureNote && (
                    <div className={styles.figureNote}>
                      <div className={styles.figureNoteLabel}>ABOUT THE FIGURE</div>
                      <div className={styles.bio}>
                        <p>{artist.figureNote}</p>
                      </div>
                    </div>
                  )}

                  <div className={styles.actions}>
                    {productLinks[artist.slug]?.inStock ? (
                      <a href={`/product/${productLinks[artist.slug].id}`} className={styles.viewProductBtn}>
                        View Product →
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={styles.viewProductBtn}
                        onClick={() => setOutOfStockSlug(artist.slug)}
                      >
                        View Product →
                      </button>
                    )}
                  </div>
                </div>

                <div className={styles.imageWrap}>
                  <img
                    src={artist.image}
                    alt={artist.imageAlt}
                    className={styles.image}
                    onClick={() => setLightboxSlug(artist.slug)}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className={styles.outro}>
            Know an independent sofubi artist we should feature? Get in touch — kanatanitoys@gmail.com
          </p>
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

        {lightboxArtist && (
          <div className={styles.lightboxOverlay} onClick={() => setLightboxSlug(null)}>
            <button
              className={styles.lightboxClose}
              onClick={(e) => { e.stopPropagation(); setLightboxSlug(null); }}
              aria-label="Close"
            >
              ✕
            </button>
            <img
              className={styles.lightboxImg}
              src={lightboxArtist.poster}
              alt={`${lightboxArtist.name} — Sofubi Showcase card`}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {outOfStockArtist && (
          <div className={styles.modalOverlay} onClick={() => setOutOfStockSlug(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.modalClose}
                onClick={() => setOutOfStockSlug(null)}
                aria-label="Close"
              >
                ✕
              </button>
              <div className={styles.modalLabel}>OUT OF STOCK</div>
              <h3 className={styles.modalTitle}>
                {outOfStockArtist.figureName || outOfStockArtist.name} isn't in the shop right now
              </h3>
              <p className={styles.modalText}>
                This piece isn't currently stocked at Kanatani Toys. Follow {outOfStockArtist.name}{' '}
                to see their latest drops, or check back here — we update this page as new pieces come in.
              </p>
              {outOfStockArtist.links[0] && (
                <a
                  href={outOfStockArtist.links[0].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.modalLink}
                >
                  {outOfStockArtist.links[0].label} →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const productLinks = {};
  ARTISTS.forEach((a) => { productLinks[a.slug] = null; });

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  const base = process.env.SQUARE_ENVIRONMENT === 'sandbox'
    ? 'https://connect.squareupsandbox.com'
    : 'https://connect.squareup.com';

  if (!token || !locationId) {
    return { props: { productLinks } };
  }

  try {
    let allItems = [];
    let cursor = null;
    do {
      const url = `${base}/v2/catalog/list?types=ITEM${cursor ? `&cursor=${cursor}` : ''}`;
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, 'Square-Version': SQUARE_VERSION },
      });
      if (!r.ok) break;
      const data = await r.json();
      allItems = allItems.concat(data.objects || []);
      cursor = data.cursor || null;
    } while (cursor);

    const matches = {};
    const variationIds = [];

    ARTISTS.forEach((artist) => {
      const found = allItems.find((o) =>
        o.type === 'ITEM' &&
        o.is_deleted !== true &&
        o.item_data?.name &&
        artist.matchKeywords.some((kw) => o.item_data.name.toLowerCase().includes(kw))
      );
      if (found) {
        const variationId = found.item_data?.variations?.[0]?.id || null;
        matches[artist.slug] = { itemId: found.id, variationId };
        if (variationId) variationIds.push(variationId);
      }
    });

    let stockMap = {};
    if (variationIds.length > 0) {
      const invRes = await fetch(`${base}/v2/inventory/counts/batch-retrieve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Square-Version': SQUARE_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catalog_object_ids: variationIds, location_ids: [locationId] }),
      });
      if (invRes.ok) {
        const invData = await invRes.json();
        (invData.counts || []).forEach((c) => {
          stockMap[c.catalog_object_id] = (stockMap[c.catalog_object_id] || 0) + parseInt(c.quantity || 0, 10);
        });
      }
    }

    Object.entries(matches).forEach(([slug, m]) => {
      const stock = m.variationId ? (stockMap[m.variationId] ?? null) : null;
      productLinks[slug] = { id: m.itemId, inStock: stock !== 0 };
    });

    return { props: { productLinks } };
  } catch {
    return { props: { productLinks } };
  }
}
