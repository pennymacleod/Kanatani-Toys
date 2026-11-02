import { useState, useEffect } from 'react';

// How light a photo is (0 dark – 1 light), so the SOLD stamp can be white on
// dark photos and black on light ones. Returns null if the photo can't be read.
function lightness(img) {
  try {
    const c = document.createElement('canvas'); c.width = c.height = 24;
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, 24, 24);
    const d = x.getImageData(0, 0, 24, 24).data; let t = 0;
    for (let i = 0; i < d.length; i += 4) t += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
    return t / (d.length / 4);
  } catch (e) { return null; }
}
import Link from 'next/link';
import { useCart, fmt } from '../lib/cart';
import { useLang } from '../lib/lang';
import { TAB_JA } from '../lib/categories';

const COLOURS = ['#FF1F8F', '#FFD21F', '#3FB7F0'];

// Only honest labels, straight from Square stock numbers.
function tagFor(stock, ja) {
  if (stock === 0) return ja ? '売り切れ' : 'SOLD OUT';
  if (stock !== null && stock > 1 && stock <= 5) return ja ? `残り${stock}点` : `ONLY ${stock} LEFT`;
  return null;
}

function ShotWrap({ sold, href, children }) {
  if (sold) return <div className="shot" style={{ display: 'block', cursor: 'default' }}>{children}</div>;
  return <Link href={href} className="shot" style={{ display: 'block' }} tabIndex={-1} aria-hidden="true">{children}</Link>;
}

export default function ProductCard({ product, index = 0 }) {
  const { add, setOpen } = useCart();
  const { lang, t } = useLang();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === 0;
  const [light, setLight] = useState(null);
  // For sold items, check the photo in the background (a separate copy, so the
  // photo on the card always shows even if Square's server won't let us read it).
  useEffect(() => {
    const src = product.imageUrls?.[0];
    if (!outOfStock || !src) return;
    const im = new Image(); im.crossOrigin = 'anonymous';
    im.onload = () => { const l = lightness(im); if (l != null) setLight(l > 0.6); };
    im.src = src;
  }, [outOfStock, product.imageUrls]);
  const tag = tagFor(product.stock, lang === 'ja');

  const onAdd = () => {
    if (outOfStock) return;
    if (justAdded) {
      setOpen(true);
      setJustAdded(false);
      return;
    }
    const ok = add({ ...product, id: product.variationId || product.id });
    if (!ok) { setOpen(true); return; }
    setJustAdded(true);
  };

  return (
    <div
      className={`card${outOfStock ? ' sold' : ''}`}
      style={{ background: COLOURS[index % COLOURS.length] }}
    >
      {/* Sold items stay in the cabinet (at the bottom) but can't be opened. */}
      <ShotWrap sold={outOfStock} href={`/product/${product.id}`}>
        {product.imageUrls?.[0] ? (
          <img src={product.imageUrls[0]} alt={product.name} loading="lazy" style={{ background: '#fff', objectFit: 'contain' }}
 />
        ) : (
          <div className="ph"><img src="/nl/pink_head_bold.png" alt="" /><span>{t('Photo coming soon', '写真は準備中')}</span></div>
        )}
        {tag && !outOfStock && <span className="tag">{tag}</span>}
        {outOfStock && <span className={`soldstamp${light ? ' onlight' : ''}`} aria-label={t('Sold', '売り切れ')}>{t('SOLD', '売切')}</span>}
      </ShotWrap>
      {product.category && product.category !== 'Other' && <div className="maker">{t(product.category, TAB_JA[product.category])}</div>}
      <div className="name">{outOfStock ? product.name : <Link href={`/product/${product.id}`}>{product.name}</Link>}</div>
      <div className="cardfoot">
        <div className="price"><span>{fmt(product.price)}</span></div>
        <button
          type="button"
          className={`addbtn${justAdded ? ' done' : ''}`}
          onClick={onAdd}
          disabled={outOfStock}
        >
          {outOfStock ? t('Sold out', '売り切れ') : justAdded ? t('View basket →', 'カートを見る →') : t('Add +', 'カートに入れる +')}
        </button>
      </div>
    </div>
  );
}
