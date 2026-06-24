// pages/api/catalog.js
// ─────────────────────────────────────────────────────────────────────────────
// Server-side API route — runs on the server, never in the browser.
// This is why CORS is not a problem: the browser calls /api/catalog (same
// origin), and THIS file calls Square's API from the server using the secret
// token stored in .env.local. The token is never exposed to the browser.
// ─────────────────────────────────────────────────────────────────────────────

const SQUARE_BASE = process.env.SQUARE_ENVIRONMENT === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';

const SQUARE_VERSION = '2025-01-23';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!token || !locationId) {
    return res.status(500).json({
      error: 'Square credentials not configured. Copy .env.local.example to .env.local and fill in your token and location ID.'
    });
  }

  try {
    // ── Step 1: Fetch all catalog items and categories ──────────────────────
    let allObjects = [];
    let cursor = null;

    do {
      const url = `${SQUARE_BASE}/v2/catalog/list?types=ITEM,CATEGORY,IMAGE${cursor ? `&cursor=${cursor}` : ''}`;
      const catalogRes = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Square-Version': SQUARE_VERSION,
          'Content-Type': 'application/json',
        },
      });

      if (!catalogRes.ok) {
        const err = await catalogRes.json();
        return res.status(catalogRes.status).json({
          error: err.errors?.[0]?.detail || 'Square API error',
          squareErrors: err.errors,
        });
      }

      const data = await catalogRes.json();
      allObjects = allObjects.concat(data.objects || []);
      cursor = data.cursor || null;
    } while (cursor);

    // ── Step 2: Separate items, categories and images ───────────────────────
    const categoryMap = {};
    allObjects
      .filter(o => o.type === 'CATEGORY')
      .forEach(c => { categoryMap[c.id] = c.category_data?.name || 'Other'; });

    // Build a map of image_id → image URL from Square IMAGE objects
    const imageMap = {};
    allObjects
      .filter(o => o.type === 'IMAGE')
      .forEach(img => {
        if (img.image_data?.url) {
          imageMap[img.id] = img.image_data.url;
        }
      });

    const items = allObjects.filter(o => o.type === 'ITEM');

    // ── Step 3: Fetch inventory counts for all variation IDs ────────────────
    const variationIds = items
      .flatMap(i => i.item_data?.variations?.map(v => v.id) || [])
      .slice(0, 1000); // Square batch limit

    let stockMap = {};

    if (variationIds.length > 0) {
      const invRes = await fetch(`${SQUARE_BASE}/v2/inventory/counts/batch-retrieve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Square-Version': SQUARE_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          catalog_object_ids: variationIds,
          location_ids: [locationId],
        }),
      });

      if (invRes.ok) {
        const invData = await invRes.json();
        (invData.counts || []).forEach(c => {
          stockMap[c.catalog_object_id] =
            (stockMap[c.catalog_object_id] || 0) + parseInt(c.quantity || 0, 10);
        });
      }
      // If inventory call fails we continue — products show with stock unknown
    }

    // ── Step 4: Build clean product list ────────────────────────────────────
    const products = items
      .filter(item => item.item_data?.name) // skip unnamed items
      .map(item => {
        const variations = item.item_data?.variations || [];
        const firstVariation = variations[0];
        const stock = stockMap[firstVariation?.id] ?? null; // null = not tracked
        const price = firstVariation?.item_variation_data?.price_money?.amount || 0;
        const currency = firstVariation?.item_variation_data?.price_money?.currency || 'GBP';
        const catId = item.item_data?.category_id;

        return {
          id: item.id,
          name: item.item_data.name,
          description: item.item_data?.description || '',
          category: catId && categoryMap[catId] ? categoryMap[catId] : 'Other',
          price,        // in pence / smallest currency unit
          currency,
          stock,        // null means inventory not tracked in Square
          imageUrls: (item.item_data?.image_ids || [])
            .map(id => imageMap[id])
            .filter(Boolean),
          variationId: firstVariation?.id || null,
          variationName: firstVariation?.item_variation_data?.name || null,
          allVariations: variations.map(v => ({
            id: v.id,
            name: v.item_variation_data?.name,
            price: v.item_variation_data?.price_money?.amount || price,
            stock: stockMap[v.id] ?? null,
          })),
          isAvailable: item.item_data?.is_deleted !== true,
        };
      })
      .filter(p => p.isAvailable && p.price > 0);

    // ── Step 5: Build category list ─────────────────────────────────────────
    const categories = ['All', ...new Set(products.map(p => p.category))].filter(Boolean);

    return res.status(200).json({
      products,
      categories,
      totalCount: products.length,
      locationId,
      fetchedAt: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Square catalog error:', err);
    return res.status(500).json({ error: `Server error: ${err.message}` });
  }
}
