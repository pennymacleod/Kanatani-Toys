// Pages that aren't ready yet. On the live site (kanatanitoys.com) these are
// taken out of the menu and anyone who visits them is sent to the homepage.
// The test site still shows everything so Penny can keep working on them.
// To bring a page back, delete its line below.
const HIDDEN_PAGES = [
  '/sofubi-showcase', // Sofubi Showcase (artist grid)
  '/artist',          // every artist's own page
];

// Pages that stay in the menu on the live site but show "Coming soon" over
// the top, so people can see them but can't play yet. Delete a line to switch
// that page on.
const PAUSED_PAGES = [
  '/gachapon',    // Kaiju Gachapon
  '/badge-press', // Badge Press
];

// HIDE_PAGES is set in next.config.js: on for the live site only.
const hidingOn = () => process.env.HIDE_PAGES === '1';

function isHidden(href) {
  if (!hidingOn() || !href) return false;
  const path = href.split('#')[0].split('?')[0];
  return HIDDEN_PAGES.some(p => path === p || path.startsWith(p + '/'));
}

function isPaused(path) {
  if (!hidingOn() || !path) return false;
  const p = path.split('#')[0].split('?')[0];
  return PAUSED_PAGES.includes(p);
}

module.exports = { HIDDEN_PAGES, PAUSED_PAGES, isHidden, isPaused };
