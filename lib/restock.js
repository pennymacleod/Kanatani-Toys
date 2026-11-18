// Pieces that show SOLD in Square but are still in the shop (Penny, 18 Nov
// 2026). The Add Stock page's "Put these back in stock" button finds each one
// in Square (words matched in the item + choice name, any of the spellings)
// and puts it back to `qty`, but only if Square has it at 0 or switched to
// "Sold out". It never touches a piece that still has stock, and if a line
// matches more than one sold piece it changes nothing and lists them instead.
// `until`: the button ignores the list after this date, so pressing it later
// can't bring back something that has really sold since.
export const RESTOCK_UNTIL = '2026-11-21';

export const RESTOCK = [
  { label: 'Smoggun', any: [['smog']], qty: 1 },
  { label: 'Tenshi Fukadume green (Ofuton Heaven)', any: [['fukadume']], qty: 1 },
  { label: 'Deep Sea Warrior', any: [['deep sea']], qty: 1 },
  { label: 'Zigonellian Ultraman', any: [['zigon'], ['sigon'], ['gigon'], ['zygon']], qty: 1 },
  { label: 'Moonstock green & pink glow marble', any: [['moon', 'marble'], ['moon', 'glow']], qty: 1 },
  { label: 'Softwood Bee iron monkey', any: [['iron', 'monk']], qty: 1 },
  { label: 'Real Umon', any: [['umon']], qty: 1 },
];
