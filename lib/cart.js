import { createContext, useContext, useEffect, useState } from 'react';

// One basket for the whole site. It lives in _app so it survives moving
// between pages, and is copied to sessionStorage so a full page reload
// (or coming back from Square's checkout with the back button) keeps it too.
const CartContext = createContext(null);
const KEY = 'kanatani-basket-v1';

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || '[]');
      if (Array.isArray(saved)) setCart(saved);
    } catch (e) { /* storage blocked: start empty */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }, [cart, loaded]);

  // `item` must carry a unique `id` (the variation id when there is one).
  // `stock` (from Square) caps how many can go in the basket, so a one-off
  // sofubi can only be added once. Returns false if it's already at the limit.
  const atLimit = (line) => line && line.stock != null && line.qty >= line.stock;
  const add = (item) => {
    const ex = cart.find(i => i.id === item.id);
    if (atLimit(ex)) return false;
    setCart(prev => {
      const cur = prev.find(i => i.id === item.id);
      if (cur) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        id: item.id,
        variationId: item.variationId || null,
        name: item.name,
        price: item.price,
        stock: item.stock ?? null,
        imageUrls: (item.imageUrls || []).slice(0, 1),
        qty: 1,
      }];
    });
    return true;
  };
  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id, qty) => (qty <= 0
    ? remove(id)
    : setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const max = i.stock != null ? i.stock : Infinity;
      return { ...i, qty: Math.min(qty, max) };
    })));
  const qtyOf = (id) => cart.find(i => i.id === id)?.qty || 0;
  const clear = () => setCart([]);

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, count, add, remove, changeQty, clear, open, setOpen, qtyOf }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

export const fmt = (pence) => `£${(pence / 100).toFixed(2)}`;
