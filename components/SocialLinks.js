import styles from '../styles/Home.module.css';

const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/kanatani_toys' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@kanatani.toys' },
  { name: 'Facebook', href: 'https://www.facebook.com/share/1EYfzmmyZi/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@KANATANITOYS-g6q' },
];

export default function SocialLinks() {
  return (
    <details className={styles.socialDropdown}>
      <summary className={styles.socialToggle}>Follow Us</summary>
      <div className={styles.socialMenu}>
        {SOCIALS.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            {name}
          </a>
        ))}
      </div>
    </details>
  );
}
