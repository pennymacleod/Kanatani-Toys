import '../styles/globals.css';
import '../styles/newlook.css';
import '../styles/additions.css';
import { Analytics } from '@vercel/analytics/react';
import { CartProvider } from '../lib/cart';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <Analytics />
    </CartProvider>
  );
}
