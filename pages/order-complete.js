import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function OrderComplete() {
  return (
    <>
      <Head><title>Order Complete — Kanatani Toys</title></Head>
      <div className={styles.root} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 28, marginBottom: 12 }}>Order Confirmed!</h1>
        <p style={{ color: '#888', maxWidth: 400, lineHeight: 1.7, marginBottom: 28 }}>
          Thank you for your order. You'll receive a confirmation email shortly. Your order has been recorded in our Square system and we'll pack it with care.
        </p>
        <a href="/" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, letterSpacing: 2, padding: '10px 24px', borderRadius: 6, border: '1px solid #333', color: 'inherit', textDecoration: 'none' }}>
          ← BACK TO SHOP
        </a>
      </div>
    </>
  );
}
