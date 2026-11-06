import { TILL_ARTISTS, TILL_RENAME, TILL_REMOVE } from './tillArtists';
// Extra rules for which Square items show on the website.

// Items taken off the website by hand, matched by name (Oct 2026: the pink
// sparkly cat sold in the shop but kept showing online). Each entry is a list
// of words that must ALL be in the Square item name. Delete an entry to bring
// the item back.
export const HIDDEN_PRODUCTS = [
  ['pink', 'cat'],
  // Penny, 5 Nov 2026: not ready to sell online yet. Delete a line to put it live.
  ['peacock'],          // Ofuton Heaven peacock
  ['kama', 'kitty'],    // Kama Kitty
  ['riders', 'embroidered', 'keychain'], // Celine's keychains: till only (Penny, 6 Nov 2026)
];

// Items sold ONLY through the badge press (the Badge Press page and the little
// press in the basket), never as a card in the shop, a product page or the
// sitemap (Penny, 6 Nov 2026). The press finds them through /api/catalog.
export const PRESS_ONLY_PRODUCTS = [
  ['mystery', 'badge'],
];

export function isPressOnly(name) {
  const n = String(name || '').toLowerCase();
  return PRESS_ONLY_PRODUCTS.some(words => words.every(w => n.includes(w)));
}

// Artists' till buttons ("13 KAMAKIRI", "33 PICOCO – Afterglow"...) and the
// pieces added under them are for the shop till only. They never show in the
// website shop; the artists' own pages show their work instead (Penny, 6 Nov 2026).
export function isTillArtistItem(name) {
  const m = String(name || '').trim().toLowerCase().match(/^\d{2}\s+(.+)$/);
  if (!m) return false;
  return TILL_ARTISTS.some(a => a && (m[1] === a.toLowerCase() || m[1].startsWith(a.toLowerCase() + ' ')))
    || Object.values(TILL_RENAME).concat(TILL_REMOVE).some(l => String(name).trim().toLowerCase().startsWith(l.toLowerCase()));
}

export function isHiddenProduct(name) {
  const n = String(name || '').toLowerCase();
  return isTillArtistItem(name) || HIDDEN_PRODUCTS.some(words => words.every(w => n.includes(w)));
}

// Items that have sold but still show as available (Square isn't counting
// their stock). Same word-matching as above. They show as SOLD and drop to
// the bottom of the shop. Delete an entry if the item comes back in.
export const SOLD_PRODUCTS = [
  ['delilah'],      // Delilah Neko, pink glitter (sold Oct 2026)
  ['pink', 'glitter'], // same toy: the Square name has 'pink glitter' in it
  ['lilan'],
  ['mola', 'racer'], // Mola Mola Racer (sold Oct 2026)
];

export function isSoldProduct(name) {
  const n = String(name || '').toLowerCase();
  return SOLD_PRODUCTS.some(words => words.every(w => n.includes(w)));
}

// Square's "Sold out" switch on the till is stored per location on the
// variation. Treat it as 0 in stock, even when Square isn't counting stock.
export function soldOutAt(variation, locationId, itemName) {
  if (itemName && isSoldProduct(itemName)) return true;
  const o = variation?.item_variation_data?.location_overrides || [];
  return o.some(x => x.location_id === locationId && x.sold_out === true);
}
