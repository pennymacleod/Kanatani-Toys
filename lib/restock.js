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
  { label: 'Deep Sea Warrior', any: [['deep', 'sea'], ['deepsea']], qty: 1 },
  { label: 'Signalion Ultraman', any: [['signal'], ['zigon'], ['sigon'], ['gigon']], qty: 1 },
  { label: 'Monstock Batura green & pink glow marbled', any: [['monstock', 'batura'], ['batura']], qty: 1 },
  { label: 'Iron Monkey', any: [['iron', 'monkey']], qty: 1 },
  { label: 'Invader Sebek', any: [['sebek']], qty: 1 },
  { label: 'Finger Frights', any: [['finger', 'fright']], qty: 1 },
  { label: 'Real Uamou Mix', any: [['uamou']], qty: 1 },
];

// Shop sofubi to put into the "KT Sofubi" category, so they come up when the
// Kanatani Sofubi category tile is tapped on the till (Penny, 18 Nov 2026).
// The Add Stock page's "Put these in KT Sofubi" button adds the category to
// each item (keeping any categories it already has). Artists' till buttons are
// never touched; if a line matches more than one item it changes nothing and
// lists them instead.
export const KT_SOFUBI = [
  { label: 'Real Uamou Mix', any: [['uamou']] },
  { label: 'Monstock Batura green & pink glow marbled', any: [['monstock'], ['batura']] },
  { label: 'Iron Monkey', any: [['iron', 'monkey']] },
  { label: 'Invader Sebek', any: [['sebek']] },
  { label: 'Fukadume Baby', any: [['fukadume', 'baby'], ['fukadume']] },
  { label: 'Deep Sea Warrior', any: [['deep', 'sea'], ['deepsea']] },
  { label: 'Octo', any: [['octo']] },
  { label: 'Signalion Ultraman', any: [['signal'], ['zigon'], ['sigon'], ['gigon']] },
  { label: 'Smoggun', any: [['smog']] },
  { label: 'Godzilla 1999 Heat Ray version', any: [['godzilla', '1999'], ['godzilla', 'heat']] },
];
