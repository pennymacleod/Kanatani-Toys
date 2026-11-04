// Artist buttons for the Square till (made from the private Add Stock page).
// Each becomes a variable-price item named "NN Name" in the "Artists"
// category, with its square's colour, so whoever's on the till taps the
// artist and types the price. Penny's numbered squares, Nov 2026
// (alphabetical; new artists get the next number at the end so nobody's
// number changes). Inori and Techin are independent sellers in the shop.
// null = number retired (button removed); numbers are never reused or shifted.
export const TILL_ARTISTS = [
  'AstroToys', 'AvaBanana', null, 'Caroline Carter', 'Celine Lau',
  null, 'Cyber Neko', 'Daedaloom', 'El Titi', 'Gloopy Goblin',
  'Goatee', 'Inori', 'KAMAKIRI', 'Kinky Lola', 'Lucy spacecrvfts',
  'Max Exotic', 'MIJI WORLD', 'Modoki Pro', 'Munchikinamo', 'NOVORENO',
  'Ofuton Heaven', 'Paul Superpower Vision', 'Pepperjerry', 'Pepperminty', 'Sana Jpeg',
  'SINTOY', 'Son of a Creatureman & Christina', 'Techin', 'The Grumblets', 'Two Beans',
  'Wandering Planet',
  // Added 4 Nov 2026 (at the end, so nobody's number changes)
  'LRH Bootlegs', 'PICOCO', 'Phoebe Phillips', 'NO.517 Toy', 'Cosmo Toys',
];

// Same colours as the squares picture.
export const TILL_COLOURS = ['FF1F8F', '3FB7F0', 'F2B705', '5BD34A', 'FF7417', '9B5DE5', '1A3FA6', 'D8352A', '00C2A8', 'FFD6E8'];

export const tillName = (i, name) => `${String(i + 1).padStart(2, '0')} ${name}`;
export const TILL_CATEGORY = 'Artists';

// Buttons to take off the till, and buttons to rename (Penny, 4 Nov 2026:
// Box Tape gone; Christina Queen of Cats and Son of a Creatureman are a
// husband-and-wife team paid together, so they share number 27).
export const TILL_REMOVE = ['03 Box Tape', '06 Christina Queen of Cats'];
export const TILL_RENAME = { '27 Son of a Creatureman': '27 Son of a Creatureman & Christina' };

// [{ number: '01', name: 'AstroToys', label: '01 AstroToys', colour }] without retired numbers.
export const TILL_BUTTONS = TILL_ARTISTS
  .map((n, i) => n && { number: String(i + 1).padStart(2, '0'), name: n, label: tillName(i, n), colour: TILL_COLOURS[i % TILL_COLOURS.length] })
  .filter(Boolean);
