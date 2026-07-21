const SQUARE_BASE = process.env.SQUARE_ENVIRONMENT === 'sandbox'
  ? 'https://connect.squareupsandbox.com'
  : 'https://connect.squareup.com';

const SQUARE_VERSION = '2025-01-23';
const SITE_URL = 'https://kanatanitoys.com';

async function fetchProductIds() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return [];

  let allObjects = [];
  let cursor = null;

  try {
    do {
      const url = `${SQUARE_BASE}/v2/catalog/list?types=ITEM${cursor ? `&cursor=${cursor}` : ''}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Square-Version': SQUARE_VERSION,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) break;
      const data = await res.json();
      allObjects = allObjects.concat(data.objects || []);
      cursor = data.cursor || null;
    } while (cursor);
  } catch {
    return [];
  }

  return allObjects
    .filter(o => o.type === 'ITEM' && o.item_data?.name && o.is_deleted !== true)
    .map(o => ({ id: o.id, updatedAt: o.updated_at }));
}

function buildSitemap(products) {
  const staticUrls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    { loc: `${SITE_URL}/about`, priority: '0.6' },
    { loc: `${SITE_URL}/our-story`, priority: '0.5' },
    { loc: `${SITE_URL}/sofubi-showcase`, priority: '0.5' },
  ];

  const productUrls = products.map(p => ({
    loc: `${SITE_URL}/product/${p.id}`,
    lastmod: p.updatedAt,
    priority: '0.8',
  }));

  const urls = [...staticUrls, ...productUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const products = await fetchProductIds();
  const sitemap = buildSitemap(products);

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
