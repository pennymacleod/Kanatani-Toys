// Shop tabs: All · Sofubi · T-shirts · Art · Badge Press · Other Strange Things.
// Square's own category names (e.g. "KT Sofubi", "KT Japan", "Extra Things")
// are folded into these, so Penny can keep organising the till however she
// likes without those names showing on the website.
// T-shirts and Badge Press have their own pages: when nothing in Square is in
// that tab yet, the tab takes people to the page instead (see TAB_PAGES).
export const OTHER = 'Other Strange Things';
export const SHOP_TABS = ['All', 'Sofubi', 'T-shirts', 'Art', 'Badge Press', OTHER];
export const TAB_PAGES = { 'T-shirts': '/t-shirts', 'Badge Press': '/badge-press' };

// Items that should always sit in a particular tab, whatever their Square
// category says. Matched against the product name (lower case).
const NAME_OVERRIDES = [
  { match: 'finger puppet', tab: OTHER },
  { match: 'mystery badge', tab: 'Badge Press' },
];

export function shopTab(squareCategory, name = '') {
  const n = name.toLowerCase();
  const override = NAME_OVERRIDES.find(o => n.includes(o.match));
  if (override) return override.tab;

  const c = (squareCategory || '').toLowerCase();
  if (c.includes('sofubi')) return 'Sofubi';
  if (/cloth|t-?shirt|\btee|apparel|hoodie|wear|merch/.test(c)) return 'T-shirts';
  if (/badge/.test(c)) return 'Badge Press';
  if (/\bart\b|print|sticker|zine|postcard|illustrat/.test(c)) return 'Art';
  return OTHER;
}
