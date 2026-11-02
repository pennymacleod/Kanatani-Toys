// T-shirts in the shop. Add new ones here (photo in public/nl/tshirts/).
// Each shirt gets its own page at /t-shirts/<slug>.
// Once a shirt is added to Square with its price and sizes, it can be bought
// online from the main shop too; until then the pages say "available online soon".
// `inShop` is how many Penny has, for reference only (not shown on the page).
export const SHIRTS = [
  { slug: 'dracula-roams', name: 'Dracula Roams', img: '/nl/tshirts/dracula-roams.jpg', colour: '#FF1F8F', inShop: 2 },
  { slug: 'small-town-ghoul', name: 'Small Town Ghoul', img: '/nl/tshirts/small-town-ghoul.jpg', colour: '#FFD21F', inShop: 2 },
  { slug: 'creature', name: 'Creature', img: '/nl/tshirts/creature.jpg', colour: '#3FB7F0', inShop: 6 },
];

export const IG = 'https://www.instagram.com/kanatani_toys';
