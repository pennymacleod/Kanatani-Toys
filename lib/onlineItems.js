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
// When PICOCO's pre-orders will be ready to post (shown on the website).
const PICOCO_READY = 'Pre-order: ready to post from about 14 November';

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
  {
    artist: 'LRH Bootlegs',
    pieces: [
      // Leon's packing list, 30 Oct 2026 (Penny, 7 Nov: on the till under 32 LRH Bootlegs AND online).
      { name: "Garamon Leg Day – orange, red & blue", match: ["Garamon Leg Day – orange, red & blue"], price: 25, stock: 1, online: true,
        title: "LRH Bootlegs – Garamon Leg Day (orange, red & blue, glow in the dark)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. Glow-in-the-dark legs.",
        img: '/nl/work/lrh-garamon-orange-red-blue.jpg' },
      { name: "Garamon Leg Day – blue & coffee", match: ["Garamon Leg Day – blue & coffee"], price: 25, stock: 1, online: true,
        title: "LRH Bootlegs – Garamon Leg Day (blue & coffee, glow in the dark)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. Glow-in-the-dark head.",
        img: '/nl/work/lrh-garamon-blue-coffee.jpg' },
      { name: "Garamon Leg Day – green & red", match: ["Garamon Leg Day – green & red"], price: 25, stock: 1, online: true,
        title: "LRH Bootlegs – Garamon Leg Day (green & red)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-garamon-green-red.jpg' },
      { name: "Garamon Leg Day – green, black & red", match: ["Garamon Leg Day – green, black & red"], price: 25, stock: 1, online: true,
        title: "LRH Bootlegs – Garamon Leg Day (green, black & red)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-garamon-green-black-red.jpg' },
      { name: "Garamon Leg Day – orange & purple", match: ["Garamon Leg Day – orange & purple"], price: 25, stock: 1, online: true,
        title: "LRH Bootlegs – Garamon Leg Day (orange & purple)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-garamon-orange-purple.jpg' },
      { name: "Neronga – original", match: ["Neronga – original"], price: 50, stock: 1, online: true,
        title: "LRH Bootlegs – Neronga",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-neronga.jpg' },
      { name: "Neronga – fully painted", match: ["Neronga – fully painted"], price: 50, stock: 1, online: true,
        title: "LRH Bootlegs – Neronga (fully painted)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-neronga-painted.jpg' },
      { name: "The Cat Returns – Bodyguard, plain", match: ["The Cat Returns – Bodyguard, plain"], price: 35, stock: 1, online: true,
        title: "LRH Bootlegs – The Cat Returns – Bodyguard",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-the-cat-returns-bodyguard.jpg' },
      { name: "The Cat Returns – Bodyguard, glitter", match: ["The Cat Returns – Bodyguard, glitter"], price: 35, stock: 1, online: true,
        title: "LRH Bootlegs – The Cat Returns – Bodyguard (glitter)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-the-cat-returns-bodyguard-glitter.jpg' },
      { name: "Lost In Translation – red", match: ["Lost In Translation – red"], price: 35, stock: 1, online: true,
        title: "LRH Bootlegs – Lost In Translation (red)",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-lost-in-translation-red.jpg' },
      { name: "Mescaline Toe Bean", match: ["Mescaline Toe Bean"], price: 35, stock: 1, online: true,
        title: "LRH Bootlegs – Mescaline Toe Bean",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. Hand-painted.",
        img: '/nl/work/lrh-mescaline-toe-bean.jpg' },
      { name: "Dream Eater", match: ["Dream Eater"], price: 30, stock: 1, online: true,
        title: "LRH Bootlegs – Dream Eater",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. Hand-painted.",
        img: '/nl/work/lrh-dream-eater.jpg' },
      { name: "Videodrome", match: ["Videodrome"], price: 10, stock: 3, online: true,
        title: "LRH Bootlegs – Videodrome",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. The blue one glows in the dark.",
        img: '/nl/work/lrh-videodrome.jpg' },
      { name: "Shadow People", match: ["Shadow People"], price: 10, stock: 5, online: true,
        title: "LRH Bootlegs – Shadow People",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK.",
        img: '/nl/work/lrh-shadow-people.jpg' },
      { name: "Princess Mononoke – Kodama", match: ["Princess Mononoke – Kodama"], price: 10, stock: 5, online: true,
        title: "LRH Bootlegs – Princess Mononoke – Kodama",
        description: "Art toy by LRH Bootlegs (Leon Hart), UK. The blue one glows in the dark.",
        img: '/nl/work/lrh-princess-monoke-kodama.jpg' },
    ],
  },
  {
    artist: 'PICOCO',
    pieces: [
      // PICOCO's own prices (email 4 Nov 2026). Penny, 7 Nov: on the website as
      // PRE-ORDERS, ready in about a week. Delete `preorder` once they're in the shop.
      { name: "SYNESTHESIA (1/1)", match: ["synesthesia"], price: 160, stock: 1, online: true, preorder: PICOCO_READY,
        title: "PICOCO \u2013 SYNESTHESIA (one of a kind, 1/1)",
        description: "One-of-a-kind art toy by PICOCO.",
        img: '/nl/work/picoco-synesthesia.jpg' },
      { name: "PICOCO AFTERGLOW", match: ["afterglow"], price: 140, stock: 1, online: true, preorder: PICOCO_READY,
        title: "PICOCO \u2013 AFTERGLOW (glow in the dark)",
        description: "Glow-in-the-dark art toy by PICOCO.",
        img: '/nl/work/picoco-afterglow.jpg' },
      { name: "PICOCO 1st", match: ["1st"], price: 115, stock: 2, online: true, preorder: PICOCO_READY,
        title: "PICOCO \u2013 PICOCO 1st",
        description: "Art toy by PICOCO.",
        img: '/nl/work/picoco-1st-blue.jpg' },
    ],
  },
  {
    artist: 'Max Exotic',
    pieces: [
      // Penny's shelf prices, 9 Nov 2026. `imgs` = our own photos, always shown on the website (Penny, 9 Nov 2026).
      { name: "Pokémon fanzine (book)", match: ["fanzine"], price: 15, stock: 2, online: true,
        title: "Max Exotic \u2013 Pokémon fanzine (book)",
        description: "Pokémon fanzine by Max Exotic, Paris-based artist.",
        img: '/nl/work/maxexotic-pokemon-fanzine.jpg',
        imgs: ['/nl/work/maxexotic-pokemon-fanzine.jpg', '/nl/work/maxexotic-pokemon-fanzine-inside.jpg'] },
      { name: "Rug \u2013 plante verte", match: ["plante"], price: 139, stock: 1, online: true,
        title: "Max Exotic \u2013 Plante verte tufted rug",
        description: "Hand-tufted rug by Max Exotic, Paris-based artist.",
        img: '/nl/work/maxexotic-rug-plante-verte.jpg',
        imgs: ['/nl/work/maxexotic-rug-plante-verte.jpg'] },
      { name: "Rug \u2013 Bulbasaur", match: ["bulbasaur"], price: 104, stock: 1, online: true,
        title: "Max Exotic \u2013 Bulbasaur tufted rug",
        description: "Hand-tufted rug by Max Exotic, Paris-based artist.",
        img: '/nl/work/maxexotic-rug-bulbasaur.jpg',
        imgs: ['/nl/work/maxexotic-rug-bulbasaur.jpg'] },
    ],
  },
];


// Items once listed above and since taken back off the website (kept off
// online if they were already made in Square).
export const RETIRED_ONLINE_ITEMS = [];
