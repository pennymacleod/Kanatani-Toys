// Builds the website products for artists' pieces that live as variations of
// their numbered till button (lib/onlineItems.js TILL_PIECES, online: true).
// The product id is the VARIATION id, so checkout sells that variation and the
// sale is registered under the artist's till button in Square.
import { TILL_PIECES } from './onlineItems';
import { TILL_ARTISTS } from './tillArtists';
import { shopTab } from './categories';

const norm = (t) => String(t || '').trim().toLowerCase();

export function tillButtonFor(items, artist) {
  const i = TILL_ARTISTS.findIndex(a => a && norm(a) === norm(artist));
  if (i < 0) return null;
  const num = String(i + 1).padStart(2, '0');
  const want = `${num} ${norm(artist)}`;
  const live = items.filter(o => o.type === 'ITEM' && !o.is_deleted);
  // Exact name first; otherwise the button with the same number and the
  // artist's first name in it (e.g. "05 Celine" or "05 - Celine Lau").
  const first = norm(artist).split(' ')[0];
  return live.find(o => norm(o.item_data?.name) === want)
    || live.find(o => { const n = norm(o.item_data?.name); return n.startsWith(num) && n.includes(first); })
    || null;
}

// A piece's variation on the till button: its name contains any of `match`.
export const pieceVariation = (item, piece) => (item?.item_data?.variations || [])
  .find(v => (piece.match || [piece.name]).some(w => norm(v.item_variation_data?.name).includes(norm(w))));

// The online piece (and its artist) that a variation id belongs to.
export function onlinePieceFor(item, variationId) {
  for (const a of TILL_PIECES) for (const p of a.pieces) {
    if (!p.online) continue;
    const v = pieceVariation(item, p);
    if (v && v.id === variationId) return { artist: a.artist, piece: p, variation: v };
  }
  return null;
}

export function pieceProduct({ piece, variation, imageMap = {}, stock = null }) {
  const vd = variation.item_variation_data || {};
  const imgs = (vd.image_ids || []).map(id => imageMap[id]).filter(Boolean);
  const price = vd.price_money?.amount || Math.round(piece.price * 100);
  return {
    id: variation.id,
    name: piece.title || piece.name,
    description: piece.description || '',
    category: shopTab(piece.category, piece.title || piece.name),
    price,
    currency: vd.price_money?.currency || 'GBP',
    stock,
    // `imgs` (our own photo files) wins over Square's photo when given.
    imageUrls: piece.imgs?.length ? piece.imgs : (imgs.length ? imgs : (piece.img ? [piece.img] : [])),
    variationId: variation.id,
    variationName: vd.name || null,
    allVariations: [{ id: variation.id, name: vd.name, price, stock }],
    preorder: piece.preorder || null, // text like "Pre-order: ready to post from …"
    isAvailable: true,
  };
}

// All online till pieces, from a Square catalog list.
export function tillPieceProducts(objects, { imageMap = {}, stockOf = () => null } = {}) {
  const out = [];
  for (const a of TILL_PIECES) {
    const item = tillButtonFor(objects, a.artist);
    if (!item) continue;
    for (const p of a.pieces) {
      if (!p.online) continue;
      const v = pieceVariation(item, p);
      if (!v) continue;
      out.push(pieceProduct({ piece: p, variation: v, imageMap, stock: stockOf(v, item) }));
    }
  }
  return out;
}
