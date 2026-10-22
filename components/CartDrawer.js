import { useEffect, useState } from 'react';
import { useCart, fmt } from '../lib/cart';

export default function CartDrawer() {
  const { cart, open, setOpen, changeQty, remove } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

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
        return;
      }
      setError(data.error || 'Checkout failed. Please try again.');
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="nl-overlay" onClick={() => setOpen(false)} />
      <aside className="nl-drawer" role="dialog" aria-modal="true" aria-label="Your basket">
        <div className="nl-drawer-head">
          <span className="mid" style={{ fontSize: 28, color: '#fff' }}>Basket</span>
          <span className="nl-jp">バスケット</span>
          <button type="button" className="nl-x" onClick={() => setOpen(false)} aria-label="Close basket">✕</button>
        </div>

        <div className="nl-drawer-items">
          {cart.length === 0 ? (
            <div className="nl-empty">
              <img src="/nl/pink_head_bold.png" alt="" />
              <p>Your basket is empty!</p>
              <a className="btn" href="/#shop" onClick={() => setOpen(false)} style={{ background: 'var(--sky)', fontSize: 18 }}>Find a weird little friend →</a>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="nl-line">
              <div className="nl-line-img">
                {item.imageUrls?.[0] ? <img src={item.imageUrls[0]} alt="" /> : <img src="/nl/pink_head_bold.png" alt="" />}
              </div>
              <div className="nl-line-info">
                <div className="nl-line-name">{item.name}</div>
                <div className="nl-line-price">{fmt(item.price)} each</div>
                <div className="nl-qty">
                  <button type="button" onClick={() => changeQty(item.id, item.qty - 1)} aria-label={`One less ${item.name}`}>−</button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => changeQty(item.id, item.qty + 1)} aria-label={`One more ${item.name}`} disabled={item.stock != null && item.qty >= item.stock} style={item.stock != null && item.qty >= item.stock ? { opacity: .35, cursor: 'not-allowed' } : undefined}>+</button>
                </div>
              </div>
              <button type="button" className="nl-remove" onClick={() => remove(item.id)} aria-label={`Remove ${item.name}`}>✕</button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="nl-drawer-foot">
            <div className="nl-total"><span>Total</span><span className="price">{fmt(total)}</span></div>
            {error && <p className="nl-error">{error}</p>}
            <button type="button" className="btn" onClick={checkout} disabled={loading} style={{ background: 'var(--pink)', color: '#fff', width: '100%' }}>
              {loading ? 'Opening checkout…' : 'Checkout securely →'}
            </button>
            <p className="nl-small">Secure payment with Square</p>
          </div>
        )}
      </aside>
    </>
  );
}
