// Artists' pieces sold on the website AND the till as their own Square items
// (not under the artist's till button, which stays off the website).
// The Add Stock page's "Put artist pieces on the website & till" button finds
// or makes each item by name in Square, sets the price, turns on stock
// tracking, shows it online and adds the photo if it has none. `stock` is the
// starting count, only used when tracking is first switched on.
// Prices and counts are from the artist's packing list.
export const ONLINE_ITEMS = [
  // Celine Lau, packing list 22 Oct 2026: 5 scarves £30, 10 embroidery keychains £6.
  { name: 'Celine Lau – In Another World scarf', artist: 'Celine Lau', price: 30, stock: 5, img: '/nl/work/celine-in-another-world-scarf.jpg' },
  { name: 'Celine Lau – Riders embroidered keychain', artist: 'Celine Lau', price: 6, stock: 10, img: '/nl/work/celine-riders-keychain.jpg' },
];
