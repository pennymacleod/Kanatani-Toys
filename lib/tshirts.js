// T-shirts in the shop. Add new ones here (photo in public/nl/tshirts/).
// Each shirt gets its own page at /t-shirts/<slug>.
// Once a shirt is added to Square with its price and sizes, it can be bought
// online from the main shop too; until then the pages say "available online soon".
// `price` is £ (Penny, 6 Nov 2026: £28 each); `sizes` are the sizes left in the shop.
// `stock` is the starting count per size, used once by the Add Stock page's
// "Set up the T-shirts in Square" button (after that Square keeps the count).
// `inShop` is how many Penny has, for reference only (not shown on the page).
// `soldOut` = sizes that are gone: crossed out on the website straight away, and
// "Set up the T-shirts in Square" sets their Square count to 0 for the till.
export const SHIRTS = [
  { slug: 'small-town-ghoul', name: 'Small Town Ghoul', img: '/nl/tshirts/small-town-ghoul.jpg', colour: '#FFD21F', price: 28, sizes: ['S'], stock: { S: 1, M: 0, L: 0 }, soldOut: ['M', 'L'], inShop: 1 }, // only S left (Penny, 28 Nov 2026)
  { slug: 'creature', name: 'Creature', img: '/nl/tshirts/creature.jpg', colour: '#3FB7F0', price: 28, sizes: ['S'], stock: { S: 2, M: 0, L: 0 }, soldOut: ['M', 'L'], inShop: 2 }, // two S left (Penny, 28 Nov 2026)
];

export const IG = 'https://www.instagram.com/kanatani_toys';

export const TSHIRT_SIZES = ['S', 'M', 'L'];
export const TSHIRT_CATEGORY = 'T-shirts';
