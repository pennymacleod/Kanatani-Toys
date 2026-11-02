import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from '../lib/cart';
import CartDrawer from './CartDrawer';
import { useLang, JAPANESE_OFF } from '../lib/lang';
import { isHidden, isPaused } from '../lib/hidden';

// Shared nav. Keep this the single source of truth for the menu.
export const NAV = [
  { key: 'shop', label: 'Shop', ja: 'ショップ', href: '/#shop', bg: 'var(--pink)' },
  { key: 'showcase', label: 'Sofubi Showcase', ja: 'ソフビ・ショーケース', href: '/sofubi-showcase', bg: 'var(--sky)' },
  { key: 'story', label: 'Our Story', ja: '私たちについて', href: '/our-story', bg: 'var(--orange)' },
  { key: 'findus', label: 'Find Us', ja: 'アクセス', href: '/about', bg: 'var(--gold)', ink: true },
  { key: 'news', label: 'Kanatani News', ja: 'カナタニ・ニュース', href: '/news', bg: 'var(--tardis)' },
  {
    key: 'play', label: 'Play Zone', ja: 'プレイゾーン', bg: 'var(--green)',
    // A drop-down: tap "Play Zone" to open it.
    items: [
      { key: 'gacha', label: 'Kaiju Gachapon', ja: '怪獣ガチャポン', href: '/gachapon', bg: 'var(--green)', emoji: '🎰' },
      { key: 'badges', label: 'Badge Press', ja: '缶バッジ・プレス', href: '/badge-press', bg: 'var(--orange)', emoji: '🔘' },
      { key: 'tv', label: 'Kanatani TV', ja: 'カナタニTV', href: '/tv', bg: 'var(--red)', emoji: '📺' },
    ],
  },
];

// The Play Zone drop-down. Works by tap (phones/iPads) and click; closes when
// you tap outside it, press Escape, or go to another page.
function NavMenu({ item, active, t }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();
  const items = item.items.filter(i => !isHidden(i.href));
  const isActive = items.some(i => i.key === active);
  useEffect(() => {
    if (!open) return;
    const away = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc); };
  }, [open]);
  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [router.events]);
  if (!items.length) return null;
  return (
    <span className={'navdd' + (open ? ' open' : '')} ref={ref}>
      <button
        type="button"
        className="navddbtn"
        aria-expanded={open}
        aria-haspopup="true"
        aria-current={isActive ? 'page' : undefined}
        onClick={() => setOpen(o => !o)}
        style={{ background: item.bg }}
      >
        {t(item.label, item.ja)} <span className="caret" aria-hidden="true">▾</span>
      </button>
      {open && (
        <span className="navddmenu" role="menu">
          {items.map(i => (
            <Link key={i.key} href={i.href} role="menuitem" aria-current={active === i.key ? 'page' : undefined} style={{ background: i.bg }}>
              <span aria-hidden="true">{i.emoji}</span> {t(i.label, i.ja)}
              {isPaused(i.href) && <small className="ddsoon">{t('soon', '近日')}</small>}
            </Link>
          ))}
        </span>
      )}
    </span>
  );
}

export const SOCIALS = [
  { name: 'Instagram', handle: '@kanatani_toys', href: 'https://www.instagram.com/kanatani_toys', bg: 'var(--pink)' },
  { name: 'TikTok', handle: '@kanatani.toys', href: 'https://www.tiktok.com/@kanatani.toys', bg: 'var(--sky)' },
  { name: 'Facebook', handle: 'Kanatani Toys', href: 'https://www.facebook.com/share/1EYfzmmyZi/', bg: 'var(--green)' },
  { name: 'YouTube', handle: '@KANATANITOYS', href: 'https://www.youtube.com/@KANATANITOYS-g6q', bg: 'var(--orange)' },
];

const SITE = 'https://kanatanitoys.com';

// Little flags for the language switch (SVG, so they show on every device).
const FlagUK = () => (
  <svg viewBox="0 0 60 30" width="28" height="14" aria-hidden="true">
    <clipPath id="ukc"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="ukt"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#ukc)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#ukt)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);
const FlagJP = () => (
  <svg viewBox="0 0 30 20" width="21" height="14" aria-hidden="true">
    <rect width="30" height="20" fill="#fff" />
    <circle cx="15" cy="10" r="6" fill="#BC002D" />
  </svg>
);

const CONGA = ['kaiju', 'pinkyeti', 'purpledog', 'cubehead', 'orangefuzz'];

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
  const { lang, setLang, t } = useLang();

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
            {t('Basket', 'カート')} ({count})
          </button>
          <div className="langsw" role="group" aria-label="Language / 言語">
            <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => setLang('en')}><FlagUK /> EN</button>
            {JAPANESE_OFF
              ? <button type="button" className="soonlang" disabled title="Japanese coming soon"><FlagJP /> 日本語 <small>coming soon</small></button>
              : <button type="button" className={lang === 'ja' ? 'on' : ''} aria-pressed={lang === 'ja'} onClick={() => setLang('ja')}><FlagJP /> 日本語</button>}
          </div>
          <div className="wrap" style={{ paddingTop: 40 }}>
            <Link href="/" aria-label="Kanatani Toys home" style={{ display: 'block', width: 'max-content', maxWidth: '100%', margin: '0 auto' }}>
              <div className="sign"><div className="k">KANATANI</div><div className="t">TOYS</div></div>
            </Link>
            <nav aria-label="Main">
              {NAV.filter(n => n.items || !isHidden(n.href)).map(n => n.items ? (
                <NavMenu key={n.key} item={n} active={active} t={t} />
              ) : (
                <Link
                  key={n.key}
                  href={n.href}
                  aria-current={active === n.key ? 'page' : undefined}
                  style={{ background: n.bg, color: n.ink ? 'var(--ink)' : undefined }}
                >
                  {t(n.label, n.ja)}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <div className="walkrow">
          <div className="scallop up" />
          {/* Hiro's monsters doing a conga along the border */}
          <span className="conga" aria-hidden="true">
            {CONGA.map((c, i) => (
              <span key={c} className={`walker w-${c}`} style={{ '--d': `${-i * 0.23}s`, '--i': i }}><img src={`/nl/walker${c === 'kaiju' ? '' : `-${c}`}.png`} alt="" /></span>
            ))}
          </span>
        </div>

        <main>{isPaused(path) ? (
          <div className="paused">
            <div className="pausedinner" aria-hidden="true">{children}</div>
            <div className="pausedcover">
              <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(30px,5vw,52px)', color: 'var(--sky)' }}>{t('Coming soon', '近日公開')}</span></span>
              <p>{t('We\u2019re still putting the finishing touches on this one. Check back soon!', 'ただいま準備中です。もうしばらくお待ちください！')}</p>
            </div>
          </div>
        ) : children}</main>

        <div className="scallop up" style={{ marginBottom: -1 }} />
        <footer>
          <div className="wrap footbar">
            <span className="footlogo">KANATANI <span>TOYS</span></span>
            <span style={{ fontWeight: 700 }}>{t('Strange Toys for Strange People', 'ストレンジな人のための、ストレンジなおもちゃ')} · @kanatani_toys</span>
          </div>
          <div className="wrap footlinks">
            <span>{t('Unit 7, Open Market, Marshalls Row, Brighton BN1 4JU', 'Unit 7, Open Market, Marshalls Row, Brighton BN1 4JU（イギリス・ブライトン）')}</span>
            <span className="footnav">
              {SOCIALS.map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>
              ))}
              <Link href="/privacy">{t('Privacy', 'プライバシー')}</Link>
              <Link href="/terms">{t('Terms', '利用規約')}</Link>
            </span>
          </div>
        </footer>
      </div>

      <CartDrawer />
    </>
  );
}
