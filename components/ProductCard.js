import { useState } from 'react';
import Link from 'next/link';
import { useCart, fmt } from '../lib/cart';
import { useLang } from '../lib/lang';
import { TAB_JA } from '../lib/categories';

const COLOURS = ['#FF1F8F', '#FFD21F', '#3FB7F0'];

// Only honest labels, straight from Square stock numbers.
function tagFor(stock, ja) {
  if (stock === 0) return ja ? '売り切れ' : 'SOLD OUT';
  if (stock === 1) return ja ? 'ラスト1点' : 'LAST ONE';
  if (stock !== null && stock <= 5) return ja ? `残り${stock}点` : `ONLY ${stock} LEFT`;
  return null;
}

export default function ProductCard({ product, index = 0 }) {
  const { add, setOpen } = useCart();
  const { lang, t } = useLang();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === 0;
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
      <Link href={`/product/${product.id}`} className="shot" style={{ display: 'block' }} tabIndex={-1} aria-hidden="true">
        {product.imageUrls?.[0] ? (
          <img src={product.imageUrls[0]} alt={product.name} loading="lazy" style={{ background: '#fff', objectFit: 'contain' }} />
        ) : (
          <div className="ph"><img src="/nl/pink_head_bold.png" alt="" /><span>{t('Photo coming soon', '写真は準備中')}</span></div>
        )}
        {tag && !outOfStock && <span className="tag">{tag}</span>}
        {outOfStock && <span className="soldstamp" aria-label={t('Sold', '売り切れ')}>{t('SOLD', '売切')}</span>}
      </Link>
      {product.category && product.category !== 'Other' && <div className="maker">{t(product.category, TAB_JA[product.category])}</div>}
      <div className="name"><Link href={`/product/${product.id}`}>{product.name}</Link></div>
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
