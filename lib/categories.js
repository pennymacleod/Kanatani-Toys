// The shop shows just four tabs: All · Sofubi · Merch · Clothing.
// Square's own category names (e.g. "KT Sofubi", "KT Japan", "Extra Things")
// are folded into these, so Penny can keep organising the till however she
// likes without those names showing on the website.
export const SHOP_TABS = ['All', 'Sofubi', 'Merch', 'Clothing'];

// Items that should always sit in a particular tab, whatever their Square
// category says. Matched against the product name (lower case).
const NAME_OVERRIDES = [
  { match: 'finger puppet', tab: 'Merch' },
];

export function shopTab(squareCategory, name = '') {
  const n = name.toLowerCase();
  const override = NAME_OVERRIDES.find(o => n.includes(o.match));
  if (override) return override.tab;

  const c = (squareCategory || '').toLowerCase();
  if (c.includes('sofubi')) return 'Sofubi';
  if (/cloth|t-?shirt|tee|apparel|hoodie|wear/.test(c)) return 'Clothing';
  return 'Merch';
}
