// Artists' pieces sold on the website AND the till as their own Square items
// (not under the artist's till button, which stays off the website).
// The Add Stock page's "Put artist pieces on the website & till" button finds
// or makes each item by name in Square, sets the price, turns on stock
// tracking, shows it online and adds the photo if it has none. `stock` is the
// starting count, only used when tracking is first switched on.
// Prices and counts are from the artist's packing list.
export const ONLINE_ITEMS = [
  // Celine Lau, packing list 22 Oct 2026: 5 scarves £30, 10 embroidery keychains £6.
  // Penny, 6 Nov 2026: only the scarves online; a till button simply called "Scarves".
  // The keychains stay under Celine's artist till button (not online).
  { name: 'Scarves', aka: ['Celine Lau – In Another World scarf'], artist: 'Celine Lau', description: 'In Another World scarf by Celine Lau, London-based illustrator.', price: 30, stock: 5, img: '/nl/work/celine-in-another-world-scarf.jpg' },
];

// Items once listed above and since taken back off the website (kept off
// online if they were already made in Square).
export const RETIRED_ONLINE_ITEMS = [
  'Celine Lau – Riders embroidered keychain',
];
