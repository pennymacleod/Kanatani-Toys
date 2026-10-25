// pages/api/checkout.js
// ─────────────────────────────────────────────────────────────────────────────
// Creates a Square Payment Link for the cart items.
// The customer is redirected to Square's hosted checkout page (PCI compliant).
// When they pay, the order appears in Square Dashboard and stock is deducted.
// ─────────────────────────────────────────────────────────────────────────────

const SQUARE_BASE = process.env.SQUARE_ENVIRONMENT === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';

const SQUARE_VERSION = '2025-01-23';

import { postageFor } from '../../lib/postage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Online orders paused (Oct 2026) while postage charges are sorted out.
  // Set ORDERS_PAUSED to false to take orders again.
  const ORDERS_PAUSED = true;
  if (ORDERS_PAUSED) {
    return res.status(503).json({
      error: 'Online orders are paused for a few days while we sort out postage. Please pop into the shop or message us on Instagram @kanatani_toys to order. Sorry!',
    });
  }

  const { cartItems, ukConfirmed } = req.body; // [{ variationId, name, price, qty }]

  // UK addresses only for now; overseas customers message us instead.
  if (!ukConfirmed) {
    return res.status(400).json({ error: 'We can only post to UK addresses at the moment. Outside the UK? Email us at kanatanitoys@gmail.com and we\'ll sort it out.' });
  }

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  // Postage is worked out here from the item prices, not trusted from the browser.
  const subtotal = cartItems.reduce((t, i) => t + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
  const postage = postageFor(subtotal);

  try {
    const lineItems = cartItems.map(item => ({
      quantity: String(item.qty),
      catalog_object_id: item.variationId,
      // If no variationId, fall back to ad-hoc line item:
      ...(item.variationId ? {} : {
        name: item.name,
        base_price_money: { amount: item.price, currency: 'GBP' },
      }),
    }));

    const checkoutRes = await fetch(`${SQUARE_BASE}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Square-Version': SQUARE_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: `order-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        order: {
          location_id: locationId,
          line_items: lineItems,
        },
        checkout_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-complete`,
          ask_for_shipping_address: true,
          ...(postage != null && postage > 0 ? { shipping_fee: { name: 'UK postage (Royal Mail Tracked 48)', charge: { amount: postage, currency: 'GBP' } } } : {}),
        },
      }),
    });

    const data = await checkoutRes.json();

    if (!checkoutRes.ok) {
      return res.status(checkoutRes.status).json({
        error: data.errors?.[0]?.detail || 'Checkout error',
      });
    }

    return res.status(200).json({
      checkoutUrl: data.payment_link?.url,
      orderId: data.payment_link?.order_id,
    });

  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
