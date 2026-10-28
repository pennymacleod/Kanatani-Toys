// Extra rules for which Square items show on the website.

// Items taken off the website by hand, matched by name (Oct 2026: the pink
// sparkly cat sold in the shop but kept showing online). Each entry is a list
// of words that must ALL be in the Square item name. Delete an entry to bring
// the item back.
export const HIDDEN_PRODUCTS = [
  ['pink', 'cat'],
];

export function isHiddenProduct(name) {
  const n = String(name || '').toLowerCase();
  return HIDDEN_PRODUCTS.some(words => words.every(w => n.includes(w)));
}

// Square's "Sold out" switch on the till is stored per location on the
// variation. Treat it as 0 in stock, even when Square isn't counting stock.
export function soldOutAt(variation, locationId) {
  const o = variation?.item_variation_data?.location_overrides || [];
  return o.some(x => x.location_id === locationId && x.sold_out === true);
}
