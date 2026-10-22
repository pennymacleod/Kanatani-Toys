import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import CartDrawer from './CartDrawer';

// Shared nav. Keep this the single source of truth for the menu.
export const NAV = [
  { key: 'shop', label: 'Shop', href: '/#shop', bg: 'var(--pink)' },
  { key: 'showcase', label: 'Sofubi Showcase', href: '/sofubi-showcase', bg: 'var(--sky)' },
  { key: 'story', label: 'Our Story', href: '/our-story', bg: 'var(--orange)' },
  { key: 'findus', label: 'Find Us', href: '/about', bg: 'var(--gold)', ink: true },
  { key: 'news', label: 'Kanatani News', href: '/news', bg: 'var(--tardis)' },
  { key: 'gacha', label: 'Kaiju Gachapon', href: '/gachapon', bg: 'var(--green)' },
  { key: 'badges', label: 'Badge Press', href: '/badge-press', bg: 'var(--orange)' },
];

export const SOCIALS = [
  { name: 'Instagram', handle: '@kanatani_toys', href: 'https://www.instagram.com/kanatani_toys', bg: 'var(--pink)' },
  { name: 'TikTok', handle: '@kanatani.toys', href: 'https://www.tiktok.com/@kanatani.toys', bg: 'var(--sky)' },
  { name: 'Facebook', handle: 'Kanatani Toys', href: 'https://www.facebook.com/share/1EYfzmmyZi/', bg: 'var(--green)' },
  { name: 'YouTube', handle: '@KANATANITOYS', href: 'https://www.youtube.com/@KANATANITOYS-g6q', bg: 'var(--orange)' },
];

const SITE = 'https://kanatanitoys.com';

export default function Layout({
  title = 'Kanatani Toys — Strange Toys for Strange People',
  description = 'Japanese toys, art and collectibles — kaiju, sofubi, designer toys and independent artists. Hand-picked in Japan, genuinely loved. Shop online or visit us at the Open Market in Brighton.',
  path = '/',
  active,
  page,
  noindex = false,
  ogType = 'website',
  head,
  children,
}) {
  const { count, setOpen } = useCart();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${SITE}/social-share.jpg`} />
        <meta property="og:image:width" content="1254" />
        <meta property="og:image:height" content="1254" />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={`${SITE}${path}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${SITE}/social-share.jpg`} />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FF1F8F" />
        {noindex && <meta name="robots" content="noindex" />}
        <link rel="icon" href="/logo.png" />
        {head}
      </Head>

      <div className={page ? `pg-${page}` : undefined}>
        <div className="scallop" />
        <header className="night">
          <button type="button" className="basket" onClick={() => setOpen(true)} aria-label={`Open basket, ${count} item${count === 1 ? '' : 's'}`}>
            Basket ({count})
          </button>
          <div className="wrap" style={{ paddingTop: 40 }}>
            <Link href="/" aria-label="Kanatani Toys home" style={{ display: 'block', width: 'max-content', maxWidth: '100%', margin: '0 auto' }}>
              <div className="sign"><div className="k">KANATANI</div><div className="t">TOYS</div></div>
            </Link>
            <nav aria-label="Main">
              {NAV.map(n => (
                <Link
                  key={n.key}
                  href={n.href}
                  aria-current={active === n.key ? 'page' : undefined}
                  style={{ background: n.bg, color: n.ink ? 'var(--ink)' : undefined }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div className="scallop up" />

        <main>{children}</main>

        <div className="scallop up" style={{ marginBottom: -1 }} />
        <footer>
          <div className="wrap footbar">
            <span className="footlogo">KANATANI <span>TOYS</span></span>
            <span style={{ fontWeight: 700 }}>Strange Toys for Strange People · @kanatani_toys</span>
          </div>
          <div className="wrap footlinks">
            <span>Unit 7, Open Market, Marshalls Row, Brighton BN1 4JU</span>
            <span className="footnav">
              {SOCIALS.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>
              ))}
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </span>
          </div>
        </footer>
      </div>

      <CartDrawer />
    </>
  );
}
