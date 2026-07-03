import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

const fmt = (pence) => `£${(pence / 100).toFixed(2)}`;

export default function ProductCard({ product, onAddToCart, cart, onOpenCart }) {
  const router = useRouter();
  const outOfStock = product.stock === 0;
  const lowStock = product.stock !== null && product.stock > 0 && product.stock <= 5;
  const inCart = cart?.some(i => i.id === product.id);

  const badge = outOfStock ? 'Sold Out' : lowStock ? 'Low Stock' : null;

  const handleClick = (e) => {
    e.stopPropagation(); // don't navigate when clicking the button
    if (outOfStock) return;
    if (inCart) {
      onOpenCart?.();
    } else {
      onAddToCart(product);
    }
  };

  return (
    <div
      className={styles.card}
      style={{ opacity: outOfStock ? 0.6 : 1, cursor: 'pointer' }}
      onClick={() => router.push(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className={styles.cardImg}>
        {product.imageUrls?.[0]
          ? <img
              src={product.imageUrls[0]}
              alt={product.name}
              loading="lazy"
              style={{ width:'100%', height:'100%', objectFit:'contain', position:'absolute', inset:0 }}
              onError={e => { e.target.style.display='none'; }}
            />
          : <span className={styles.cardEmoji}>🧸</span>
        }
        {badge && (
          <span className={`${styles.badge} ${styles[`badge${badge.replace(' ', '')}`]}`}>
            {badge}
          </span>
        )}
        {lowStock && (
          <span className={styles.stockWarn}>Only {product.stock} left</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <div className={styles.category}>{product.category}</div>
        <h3 className={styles.productName}>{product.name}</h3>
        {product.description && (
          <p className={styles.description}>{product.description}</p>
        )}
        <div className={styles.cardFooter}>
          <span className={styles.price}>{fmt(product.price)}</span>
          <button
            className={`${styles.addBtn} ${inCart ? styles.addBtnDone : ''}`}
            onClick={handleClick}
            disabled={outOfStock}
          >
            {outOfStock ? 'Sold Out' : inCart ? 'View Basket →' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
