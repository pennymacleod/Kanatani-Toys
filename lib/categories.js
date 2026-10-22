// The shop shows four tabs: All · Sofubi · Merch · Other Strange Things.
// Merch is clothing and Kanatani merch (t-shirts etc.); everything else that
// isn't sofubi is "Other Strange Things".
// Square's own category names (e.g. "KT Sofubi", "KT Japan", "Extra Things")
// are folded into these, so Penny can keep organising the till however she
// likes without those names showing on the website.
export const SHOP_TABS = ['All', 'Sofubi', 'Merch', 'Other Strange Things'];
export const OTHER = 'Other Strange Things';

// Items that should always sit in a particular tab, whatever their Square
// category says. Matched against the product name (lower case).
const NAME_OVERRIDES = [
  { match: 'finger puppet', tab: OTHER },
];

export function shopTab(squareCategory, name = '') {
  const n = name.toLowerCase();
  const override = NAME_OVERRIDES.find(o => n.includes(o.match));
  if (override) return override.tab;

  const c = (squareCategory || '').toLowerCase();
  if (c.includes('sofubi')) return 'Sofubi';
  if (/merch|cloth|t-?shirt|tee|apparel|hoodie|wear/.test(c)) return 'Merch';
  return OTHER;
}
