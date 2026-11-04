// Artist buttons for the Square till (made from the private Add Stock page).
// Each becomes a variable-price item named "NN Name" in the "Artists"
// category, with its square's colour, so whoever's on the till taps the
// artist and types the price. Penny's numbered squares, Nov 2026
// (alphabetical; new artists get the next number at the end so nobody's
// number changes). Inori and Techin are independent sellers in the shop.
export const TILL_ARTISTS = [
  'AstroToys', 'AvaBanana', 'Box Tape', 'Caroline Carter', 'Celine Lau',
  'Christina Queen of Cats', 'Cyber Neko', 'Daedaloom', 'El Titi', 'Gloopy Goblin',
  'Goatee', 'Inori', 'KAMAKIRI', 'Kinky Lola', 'Lucy spacecrvfts',
  'Max Exotic', 'MIJI WORLD', 'Modoki Pro', 'Munchikinamo', 'NOVORENO',
  'Ofuton Heaven', 'Paul Superpower Vision', 'Pepperjerry', 'Pepperminty', 'Sana Jpeg',
  'SINTOY', 'Son of a Creatureman', 'Techin', 'The Grumblets', 'Two Beans',
  'Wandering Planet',
];

// Same colours as the squares picture.
export const TILL_COLOURS = ['FF1F8F', '3FB7F0', 'F2B705', '5BD34A', 'FF7417', '9B5DE5', '1A3FA6', 'D8352A', '00C2A8', 'FFD6E8'];

export const tillName = (i, name) => `${String(i + 1).padStart(2, '0')} ${name}`;
export const TILL_CATEGORY = 'Artists';
