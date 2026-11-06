// T-shirts in the shop. Add new ones here (photo in public/nl/tshirts/).
// Each shirt gets its own page at /t-shirts/<slug>.
// Once a shirt is added to Square with its price and sizes, it can be bought
// online from the main shop too; until then the pages say "available online soon".
// `price` is £ (Penny, 6 Nov 2026: £28 each); `sizes` are the sizes left in the shop.
// `stock` is the starting count per size, used once by the Add Stock page's
// "Set up the T-shirts in Square" button (after that Square keeps the count).
// `inShop` is how many Penny has, for reference only (not shown on the page).
export const SHIRTS = [
  { slug: 'dracula-roams', name: 'Dracula Roams', img: '/nl/tshirts/dracula-roams.jpg', colour: '#FF1F8F', price: 28, sizes: ['M', 'L'], stock: { S: 0, M: 1, L: 1 }, inShop: 2 },
  { slug: 'small-town-ghoul', name: 'Small Town Ghoul', img: '/nl/tshirts/small-town-ghoul.jpg', colour: '#FFD21F', price: 28, sizes: ['S', 'M'], stock: { S: 1, M: 1, L: 0 }, inShop: 2 },
  { slug: 'creature', name: 'Creature', img: '/nl/tshirts/creature.jpg', colour: '#3FB7F0', price: 28, sizes: ['S', 'M'], stock: { S: 3, M: 3, L: 0 }, inShop: 6 },
];

export const IG = 'https://www.instagram.com/kanatani_toys';

export const TSHIRT_SIZES = ['S', 'M', 'L'];
export const TSHIRT_CATEGORY = 'T-shirts';
