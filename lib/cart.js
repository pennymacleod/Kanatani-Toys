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
  const add = (item) => setCart(prev => {
    const ex = prev.find(i => i.id === item.id);
    if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
    return [...prev, {
      id: item.id,
      variationId: item.variationId || null,
      name: item.name,
      price: item.price,
      imageUrls: (item.imageUrls || []).slice(0, 1),
      qty: 1,
    }];
  });
  const remove = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id, qty) => (qty <= 0
    ? remove(id)
    : setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i)));
  const clear = () => setCart([]);

  const count = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, count, add, remove, changeQty, clear, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

export const fmt = (pence) => `£${(pence / 100).toFixed(2)}`;
