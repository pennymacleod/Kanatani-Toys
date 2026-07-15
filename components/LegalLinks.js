import styles from '../styles/Home.module.css';

export default function LegalLinks() {
  return (
    <div className={styles.legalLinks}>
      <a href="/privacy">Privacy Policy</a>
      <span>·</span>
      <a href="/terms">Terms &amp; Conditions</a>
    </div>
  );
}
