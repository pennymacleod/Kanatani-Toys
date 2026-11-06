// Artists' pieces sold on the website AND the till as their own Square items
// (not under the artist's till button, which stays off the website).
// The Add Stock page's "Put artist pieces on the website & till" button finds
// or makes each item by name in Square, sets the price, turns on stock
// tracking, shows it online and adds the photo if it has none. `stock` is the
// starting count, only used when tracking is first switched on.
// Prices and counts are from the artist's packing list.
export const ONLINE_ITEMS = [
  // (Celine Lau's scarf moved under her till button, see TILL_PIECES below.)
];

// Artists' pieces as choices on their own numbered till button (Penny, 6 Nov
// 2026: tapping "05 Celine Lau" should list her scarf and keychains with their
// prices and stock, so every sale is registered under her for month-end).
// The Add Stock page's "Put artist pieces on the website & till" button adds
// each piece as a variation of that artist's button. `online: true` pieces are
// ALSO sold on the website as their own product (`title`), even though the
// till button itself stays off the website; a sale online is still a sale of
// that variation of the artist's button. `match` = words (any one) that find a piece
// already on the button; `from` = older separate Square items for the same
// piece: their stock is carried over, then they are deleted.
export const TILL_PIECES = [
  {
    artist: 'Celine Lau',
    pieces: [
      // Packing list 22 Oct 2026: 5 scarves £30, 10 embroidery keychains £6.
      { name: 'In Another World scarf', match: ['scarf'], price: 30, stock: 5, online: true,
        title: 'Celine Lau – In Another World scarf',
        description: 'In Another World scarf by Celine Lau, London-based illustrator.',
        img: '/nl/work/celine-in-another-world-scarf.jpg',
        from: ['Scarves', 'Celine Lau – In Another World scarf'] },
      // Penny, 6 Nov 2026 (later): keychains on the website too.
      { name: 'Riders keychain', match: ['riders', 'keychain', 'key ring', 'keyring'], price: 6, stock: 10, online: true,
        title: 'Celine Lau – Riders keychain',
        description: 'Riders embroidered keychain by Celine Lau, London-based illustrator.',
        img: '/nl/work/celine-riders-keychain.jpg',
        from: ['Celine Lau – Riders embroidered keychain'] },
    ],
  },
];


// Items once listed above and since taken back off the website (kept off
// online if they were already made in Square).
export const RETIRED_ONLINE_ITEMS = [];
