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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { cartItems } = req.body; // [{ variationId, name, price, qty }]

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

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
