// Postage for website orders. UK addresses only for now (Penny, Oct 2026):
// anyone outside the UK is asked to message us on Instagram instead.
// Amounts are in pence. Set UK_POSTAGE before switching orders back on
// (ORDERS_PAUSED in pages/api/checkout.js).
// £6.99 flat = Royal Mail Tracked 48 MEDIUM parcel up to 2kg, bought online (£5.70 from
// 5 Oct 2026), plus about £1.20 for box, bubble wrap and tape. Always tracked (Penny's choice).
export const UK_POSTAGE = 699;
export const FREE_UK_OVER = null;    // e.g. 5000 = free UK postage on orders of £50+ (null = never free)

export function postageFor(subtotal) {
  if (UK_POSTAGE == null) return null;
  if (FREE_UK_OVER != null && subtotal >= FREE_UK_OVER) return 0;
  return UK_POSTAGE;
}
