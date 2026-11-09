// Ready-made stock lists for the Add Stock page's "Add a list" box.
// Prices are Penny's £ shelf prices (not the artist's yen). Quantities are
// what the artist sent; Penny checks them against a stock take before adding.
export const STOCK_LISTS = {
  'Ofuton Heaven': [
    { name: 'Corochan melon cream soda', price: '55', qty: '1' },
    { name: 'Tenshi green', price: '35', qty: '1' },
    { name: 'Fukadume original', price: '35', qty: '1' },
    { name: 'Fukadume green dot pants', price: '35', qty: '1' },
    { name: 'Fukadume spring candy', price: '35', qty: '1' },
    { name: 'Corophy', price: '12', qty: '4' },
    { name: 'Slime being stepped on – purple', price: '21', qty: '1' },
    { name: 'Slime being stepped on – orange', price: '21', qty: '1' },
    { name: 'Gift money envelope', price: '3.99', qty: '9' },
  ],
  // PICOCO's own prices from their email, 4 Nov 2026.
  PICOCO: [
    { name: 'SYNESTHESIA (1/1)', price: '160', qty: '1' },
    { name: 'PICOCO AFTERGLOW', price: '140', qty: '1' },
    { name: 'PICOCO 1st', price: '115', qty: '2' },
  ],
  // Kamakiri didn't send quantities: 1 each is a placeholder until the stock take.
  KAMAKIRI: [
    { name: 'Magic Horse – original', price: '35', qty: '1' },
    { name: 'Magic Horse – bright yellow', price: '35', qty: '1' },
    { name: 'Magic Horse – akaoni', price: '37', qty: '1' },
    { name: 'Magic Horse – Halloween popping candy', price: '37', qty: '1' },
    { name: 'Magic Horse – alien', price: '37', qty: '1' },
    { name: 'Gabulien – red', price: '35', qty: '1' },
    { name: 'Gabulien – yellow', price: '35', qty: '1' },
    { name: 'Gabulien – blue', price: '35', qty: '1' },
    { name: 'Gabulien – orange', price: '35', qty: '1' },
    { name: 'Gabulien – lime green', price: '35', qty: '1' },
    { name: 'Gabulien – purple', price: '35', qty: '1' },
    { name: 'Gabulien – lavender', price: '35', qty: '1' },
    { name: 'Gabulien – gold treasure', price: '50', qty: '1' },
  ],
  // Max Exotic: Penny's shelf prices, 9 Nov 2026 (2 books, 1 of each rug).
  'Max Exotic': [
    { name: 'Pokémon fanzine (book)', price: '15', qty: '2' },
    { name: 'Rug – plante verte', price: '139', qty: '1' },
    { name: 'Rug – Bulbasaur', price: '104', qty: '1' },
  ],
};
