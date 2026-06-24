import { useState } from 'react';
import styles from '../styles/Home.module.css';

const fmt = (pence) => `£${(pence / 100).toFixed(2)}`;

export default function Cart({ cart, onClose, onChangeQty, onRemove }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const checkout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart.map(i => ({
            variationId: i.variationId,
            name: i.name,
            price: i.price,
            qty: i.qty,
          })),
        }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError(data.error || 'Checkout failed. Please try again.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Overlay */}
      <div className={styles.cartOverlay} onClick={onClose} />

      {/* Drawer */}
      <div className={styles.cartDrawer}>
        <div className={styles.cartHeader}>
          <span className={styles.cartTitle}>バスケット / BASKET</span>
          <button className={styles.cartClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.cartItems}>
          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>
              <span>🧸</span>
              <p>Your basket is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.cartItemImg}>
                {item.imageUrls?.[0]
                  ? <img src={item.imageUrls[0]} alt={item.name} />
                  : '🧸'}
              </div>
              <div className={styles.cartItemInfo}>
                <div className={styles.cartItemName}>{item.name}</div>
                <div className={styles.cartItemPrice}>{fmt(item.price)} each</div>
              </div>
              <div className={styles.qtyControl}>
                <button onClick={() => onChangeQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => onChangeQty(item.id, item.qty + 1)}>+</button>
              </div>
              <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>×</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total</span>
              <span className={styles.totalAmount}>{fmt(total)}</span>
            </div>
            {error && <p className={styles.checkoutError}>{error}</p>}
            <button
              className={styles.checkoutBtn}
              onClick={checkout}
              disabled={loading}
            >
              {loading ? 'Creating order...' : 'Checkout via Square →'}
            </button>
            <p className={styles.checkoutNote}>
              Secure payment · Order syncs to your Square till automatically
            </p>
          </div>
        )}
      </div>
    </>
  );
}
