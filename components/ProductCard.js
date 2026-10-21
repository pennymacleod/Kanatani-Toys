import { useState } from 'react';
import Link from 'next/link';
import { useCart, fmt } from '../lib/cart';

const COLOURS = ['#FF1F8F', '#FFD21F', '#3FB7F0'];

// Only honest labels, straight from Square stock numbers.
function tagFor(stock) {
  if (stock === 0) return 'SOLD OUT';
  if (stock === 1) return 'LAST ONE';
  if (stock !== null && stock <= 5) return `ONLY ${stock} LEFT`;
  return null;
}

export default function ProductCard({ product, index = 0 }) {
  const { add, setOpen } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const outOfStock = product.stock === 0;
  const tag = tagFor(product.stock);

  const onAdd = () => {
    if (outOfStock) return;
    if (justAdded) {
      setOpen(true);
      setJustAdded(false);
      return;
    }
    add({ ...product, id: product.variationId || product.id });
    setJustAdded(true);
  };

  return (
    <div
      className="card"
      style={{ background: COLOURS[index % COLOURS.length], opacity: outOfStock ? 0.7 : 1 }}
    >
      <Link href={`/product/${product.id}`} className="shot" style={{ display: 'block' }} tabIndex={-1} aria-hidden="true">
        {product.imageUrls?.[0] ? (
          <img src={product.imageUrls[0]} alt={product.name} loading="lazy" style={{ background: '#fff', objectFit: 'contain' }} />
        ) : (
          <div className="ph"><img src="/nl/pink_head_bold.png" alt="" /><span>Photo coming soon</span></div>
        )}
        {tag && <span className="tag">{tag}</span>}
      </Link>
      {product.category && product.category !== 'Other' && <div className="maker">{product.category}</div>}
      <div className="name"><Link href={`/product/${product.id}`}>{product.name}</Link></div>
      <div className="cardfoot">
        <div className="price"><span>{fmt(product.price)}</span></div>
        <button
          type="button"
          className={`addbtn${justAdded ? ' done' : ''}`}
          onClick={onAdd}
          disabled={outOfStock}
        >
          {outOfStock ? 'Sold out' : justAdded ? 'View basket →' : 'Add +'}
        </button>
      </div>
    </div>
  );
}
