import { useState } from 'react';
import styles from '../styles/Home.module.css';

const LINKS = [
  { key: 'shop', label: 'Shop', hash: true, href: '#shop' },
  { key: 'our-story', label: 'Our Story', href: '/our-story' },
  { key: 'sofubi-showcase', label: 'Sofubi Showcase', href: '/sofubi-showcase' },
  { key: 'find-us', label: 'Find Us', href: '/about' },
  { key: 'testimonials', label: 'Testimonials', hash: true, href: '#testimonials' },
];

export default function Nav({ active, home = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
        {LINKS.map(link => (
          <a
            key={link.key}
            href={link.hash && !home ? `/${link.href}` : link.href}
            className={active === link.key ? styles.navActive : undefined}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className={styles.navToggle}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {open ? '✕' : '☰'}
      </button>
    </>
  );
}
