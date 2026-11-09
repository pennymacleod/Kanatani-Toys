// Shop tabs: All · Sofubi · T-shirts · Art · Badge Press · Other Strange Things.
// Square's own category names (e.g. "KT Sofubi", "KT Japan", "Extra Things")
// are folded into these, so Penny can keep organising the till however she
// likes without those names showing on the website.
// T-shirts and Badge Press have their own pages: when nothing in Square is in
// that tab yet, the tab takes people to the page instead (see TAB_PAGES).
export const OTHER = 'Other Strange Things';
// Penny, 9 Nov 2026: more tabs so fewer things land in "Other". Tabs with
// nothing in them are hidden on the shop page (except the ones with their own page).
export const SHOP_TABS = ['All', 'Sofubi', 'Art', 'Ghibli', 'Vintage', 'Japanese Home', 'T-shirts', 'Badge Press', OTHER];
// Japanese names for the tabs (language switch).
export const TAB_JA = { All: 'すべて', Sofubi: 'ソフビ', Art: 'アート', Ghibli: 'ジブリ', Vintage: 'ヴィンテージ', 'Japanese Home': '和雑貨', 'T-shirts': 'Tシャツ', 'Badge Press': '缶バッジ', [OTHER]: 'その他のストレンジなもの' };
export const TAB_PAGES = { 'T-shirts': '/t-shirts', 'Badge Press': '/badge-press' };

// Items that should always sit in a particular tab, whatever their Square
// category says. Matched against the product name (lower case), first match wins.
// Artists come first, so e.g. LRH Bootlegs' "Princess Mononoke – Kodama" stays Sofubi.
const NAME_OVERRIDES = [
  { match: 'finger puppet', tab: OTHER },
  { match: 'mystery badge', tab: 'Badge Press' },
  // Artists' pieces sold online ("Artist – piece")
  { match: ['lrh bootlegs', 'picoco', 'kamakiri', 'gabulien', 'magic horse', 'ofuton', 'drmo', 'darumo', 'sintoy', 'goatee', 'pepperjerry', 'munchikinamo', 'miji world', 'cyber neko', 'astrotoys', 'wandering planet'], tab: 'Sofubi' },
  { match: ['celine lau', 'max exotic', 'kinky lola', 'twobeans', 'two beans', 'novoreno', 'caroline carter', 'sana jpeg', 'twofold', 'daedaloom'], tab: 'Art' },
];

// Words in the product name, used when the Square category doesn't say.
const NAME_WORDS = [
  { tab: 'Vintage', re: /vintage|retro|show[aā]|19[5-9]0s|'[5-9]0s|bullmark|popy|marusan|pre-?owned/ },
  { tab: 'Sofubi', re: /sofubi|soft ?vinyl|ソフビ|\bkaiju\b|godzilla|ultraman|gamera|kinnikuman|figure/ },
  { tab: 'Ghibli', re: /ghibli|totoro|kiki'?s|spirited away|chihiro|no[- ]?face|kaonashi|ponyo|howl|mononoke|kodama|catbus|\bjiji\b|calcifer|soot sprite|susuwatari|laputa|nausica|porco|arrietty|marnie|cat returns/ },
  { tab: 'Japanese Home', re: /\btea\b|matcha|\bcups?\b|\bmugs?\b|bowl|chopstick|plate|furoshiki|tenugui|noren|incense|ceramic|bento|towel|\bfan\b|sake|coaster|maneki|lucky cat|daruma|kokeshi|chopsticks|teapot|kitchen/ },
  { tab: 'Art', re: /print|sticker|\bzine|fanzine|postcard|poster|\bcards?\b|\brug\b|scarf|earring|necklace|jewel|keychain|key ?ring|patch|enamel pin|tote/ },
  { tab: 'T-shirts', re: /t-?shirt|\btee\b|hoodie|sweatshirt/ },
  { tab: 'Badge Press', re: /\bbadge/ },
];

export function shopTab(squareCategory, name = '') {
  const n = name.toLowerCase();
  const override = NAME_OVERRIDES.find(o => [].concat(o.match).some(m => n.includes(m)));
  if (override) return override.tab;

  const c = (squareCategory || '').toLowerCase();
  if (c.includes('sofubi')) return 'Sofubi';
  if (c.includes('ghibli')) return 'Ghibli';
  if (/vintage|retro/.test(c)) return 'Vintage';
  if (/home|kitchen|tea\b|ceramic/.test(c)) return 'Japanese Home';
  if (/cloth|t-?shirt|\btee|apparel|hoodie|wear|merch/.test(c)) return 'T-shirts';
  if (/badge/.test(c)) return 'Badge Press';
  if (/\bart\b|print|sticker|zine|postcard|illustrat/.test(c)) return 'Art';

  const w = NAME_WORDS.find(x => x.re.test(n));
  return w ? w.tab : OTHER;
}
