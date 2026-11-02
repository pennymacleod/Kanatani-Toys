import '../styles/globals.css';
import '../styles/newlook.css';
import '../styles/additions.css';
import { Analytics } from '@vercel/analytics/react';
import { CartProvider } from '../lib/cart';
import { LangProvider } from '../lib/lang';

export default function App({ Component, pageProps }) {
  return (
    <LangProvider>
      <CartProvider>
        <Component {...pageProps} />
        <Analytics />
      </CartProvider>
    </LangProvider>
  );
}
