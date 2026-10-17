import styles from '../styles/About.module.css';

// Plain links that open in a new tab — no embedded feeds, so no third-party
// scripts or cookies load on the page.
const PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    emoji: '📸',
    href: 'https://www.instagram.com/kanatani_toys',
    handle: '@kanatani_toys',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    emoji: '🎵',
    href: 'https://www.tiktok.com/@kanatani.toys',
    handle: '@kanatani.toys',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    emoji: '👍',
    href: 'https://www.facebook.com/share/1EYfzmmyZi/',
    handle: 'Kanatani Toys',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    emoji: '▶️',
    href: 'https://www.youtube.com/@KANATANITOYS-g6q',
    handle: '@KANATANITOYS-g6q',
  },
];

export default function SocialFeeds() {
  return (
    <div className={styles.feedGrid}>
      {PLATFORMS.map(p => (
        <div key={p.id} className={styles.feedCard}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.feedToggle}
            style={{ textDecoration: 'none', boxSizing: 'border-box' }}
          >
            <span className={styles.feedToggleEmoji}>{p.emoji}</span>
            <span className={styles.feedToggleLabel}>{p.label}</span>
            <span className={styles.feedToggleHandle}>{p.handle}</span>
            <span className={styles.feedToggleIcon}>↗</span>
          </a>
        </div>
      ))}
    </div>
  );
}
