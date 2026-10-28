import { SQUARE_LOCATION_ID } from '../../lib/squareLocation';
import { isHiddenProduct, soldOutAt } from '../../lib/productRules';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCart, fmt } from '../../lib/cart';
import { shopTab } from '../../lib/categories';

function stockText(stock) {
  if (stock === null || stock === undefined) return 'In stock';
  if (stock === 0) return 'Sold out';
  if (stock === 1) return 'Last one!';
  if (stock <= 5) return `Only ${stock} left`;
  return 'In stock';
}

export default function ProductPage({ product, error }) {
  const { add, count, setOpen, qtyOf } = useCart();
  const [selected, setSelected] = useState(product?.allVariations?.[0] || null);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imageCount = product?.imageUrls?.length || 0;
  const showPrev = () => setActiveImg(i => (i - 1 + imageCount) % imageCount);
  const showNext = () => setActiveImg(i => (i + 1) % imageCount);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      else if (e.key === 'ArrowLeft' && imageCount > 1) showPrev();
      else if (e.key === 'ArrowRight' && imageCount > 1) showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, imageCount]);

  if (error || !product) {
    return (
      <Layout title="Toy not found — Kanatani Toys" page="product" noindex>
        <section className="floor textpage">
          <div className="wrap">
            <div className="sheet" style={{ textAlign: 'center' }}>
              <img src="/nl/pink_head_bold.png" alt="" style={{ width: 160 }} />
              <h1 className="big">Toy not found</h1>
              <p>This toy may have found a new home already.</p>
              <Link className="btn" href="/#shop" style={{ background: 'var(--sky)' }}>← Back to the shop</Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  const stock = selected ? selected.stock : null;
  const outOfStock = stock === 0;
  const price = selected?.price || product.price;

  const lineId = selected?.id || product.id;
  const allInBasket = stock != null && stock > 0 && qtyOf(lineId) >= stock;

  const addToBasket = () => {
    if (outOfStock) return;
    if (allInBasket) { setOpen(true); return; }
    add({
      ...product,
      id: lineId,
      variationId: selected?.id || product.variationId,
      name: product.allVariations?.length > 1 && selected?.name ? `${product.name} (${selected.name})` : product.name,
      price,
      stock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const addLabel = outOfStock ? 'Sold out'
    : added ? '✓ Added!'
    : allInBasket ? (stock === 1 ? 'In your basket ✓' : 'All in your basket ✓')
    : 'Add to basket';

  const addButton = (
    <button
      type="button"
      className="btn"
      onClick={addToBasket}
      disabled={outOfStock}
      style={{ background: outOfStock ? '#ddd' : (added || allInBasket) ? 'var(--green)' : 'var(--pink)', color: outOfStock || added || allInBasket ? 'var(--ink)' : '#fff', fontSize: 22, cursor: outOfStock ? 'not-allowed' : 'pointer' }}
    >
      {addLabel}
    </button>
  );

  return (
    <Layout
      title={`${product.name} — Kanatani Toys`}
      description={product.description || product.name}
      path={`/product/${product.id}`}
      ogType="product"
      page="product"
      active="shop"
    >
      <section className="floor">
        <div className="wrap" style={{ paddingBottom: 80 }}>
          <div className="crumb"><Link href="/#shop">← Shop</Link></div>
          <div className="pp">
            <div className="gallery">
              <div
                className="main"
                onClick={() => imageCount > 0 && setLightboxOpen(true)}
                role={imageCount > 0 ? 'button' : undefined}
                tabIndex={imageCount > 0 ? 0 : undefined}
                aria-label={imageCount > 0 ? 'Show photo full size' : undefined}
                onKeyDown={e => { if (imageCount > 0 && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setLightboxOpen(true); } }}
              >
                {imageCount > 0 ? (
                  <img src={product.imageUrls[activeImg]} alt={product.name} />
                ) : (
                  <div className="ph"><img src="/nl/pink_head_bold.png" alt="" /><span>Photo coming soon</span></div>
                )}
              </div>
              {imageCount > 1 && (
                <div className="thumbs">
                  {product.imageUrls.map((url, i) => (
                    <button key={i} type="button" onClick={() => setActiveImg(i)} aria-pressed={activeImg === i} aria-label={`Photo ${i + 1}`}>
                      <img src={url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="info">
              {product.category && <span className="achip"><i />{product.category.toUpperCase()}</span>}
              <h1 className="big" style={{ fontSize: 'clamp(36px,5vw,60px)', margin: '20px 0 10px', color: 'var(--pink)', lineHeight: 1.1 }}>{product.name}</h1>
              <div className="buyrow">
                <div className="bigprice">{fmt(price)}</div>
                {addButton}
              </div>

              {product.allVariations?.length > 1 && (
                <div className="vars" role="group" aria-label="Options">
                  {product.allVariations.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      className={`var${selected?.id === v.id ? ' on' : ''}`}
                      aria-pressed={selected?.id === v.id}
                      onClick={() => setSelected(v)}
                      disabled={v.stock === 0}
                    >
                      {v.name}{v.stock === 0 ? ' (sold out)' : ''}
                    </button>
                  ))}
                </div>
              )}

              <div className="specs">
                <div className="spec"><b>STOCK</b><span>{stockText(stock)}</span></div>
                <div className="spec"><b>WHERE</b><span>Brighton shop &amp; online</span></div>
              </div>

              {product.description && (
                <p style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 26px', whiteSpace: 'pre-line' }}>{product.description}</p>
              )}

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {addButton}
                {count > 0 && (
                  <button type="button" className="btn" onClick={() => setOpen(true)} style={{ background: '#fff', fontSize: 22 }}>
                    View basket ({count}) →
                  </button>
                )}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, opacity: .75, margin: '18px 0 0' }}>Stock updates live from our shop till · Secure checkout with Square</p>
            </div>
          </div>
        </div>
      </section>

      {lightboxOpen && imageCount > 0 && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true" aria-label={`${product.name} photos`}>
          <button type="button" className="lbbtn lbclose" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} aria-label="Close">✕</button>
          {imageCount > 1 && (
            <button type="button" className="lbbtn lbprev" onClick={(e) => { e.stopPropagation(); showPrev(); }} aria-label="Previous photo">‹</button>
          )}
          <img src={product.imageUrls[activeImg]} alt={product.name} onClick={(e) => e.stopPropagation()} />
          {imageCount > 1 && (
            <button type="button" className="lbbtn lbnext" onClick={(e) => { e.stopPropagation(); showNext(); }} aria-label="Next photo">›</button>
          )}
          {imageCount > 1 && <div className="lbcount">{activeImg + 1} / {imageCount}</div>}
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  try {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const env = process.env.SQUARE_ENVIRONMENT || 'production';
    const base = env === 'sandbox'
      ? 'https://connect.squareupsandbox.com'
      : 'https://connect.squareup.com';

    const r = await fetch(`${base}/v2/catalog/object/${params.id}?include_related_objects=true`, {
      headers: { Authorization: `Bearer ${token}`, 'Square-Version': '2025-01-23' },
    });

    const data = await r.json();
    if (!r.ok || !data.object) {
      return { props: { product: null, error: 'Product not found' } };
    }

    const item = data.object;
    if (item.is_deleted || item.item_data?.is_archived
      || ['HIDDEN', 'UNAVAILABLE'].includes(item.item_data?.ecom_visibility)
      || item.item_data?.available_online === false
      || isHiddenProduct(item.item_data?.name)) {
      return { props: { product: null, error: 'Product not found' } };
    }
    const relatedObjects = data.related_objects || [];

    // Build image map from related objects
    const imageMap = {};
    relatedObjects.filter(o => o.type === 'IMAGE').forEach(img => {
      if (img.image_data?.url) imageMap[img.id] = img.image_data.url;
    });

    // Get inventory for all variations
    const locationId = SQUARE_LOCATION_ID;
    const variationIds = item.item_data?.variations?.map(v => v.id) || [];
    let stockMap = {};

    if (variationIds.length > 0) {
      const invR = await fetch(`${base}/v2/inventory/counts/batch-retrieve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Square-Version': '2025-01-23',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catalog_object_ids: variationIds, location_ids: [locationId] }),
      });
      if (invR.ok) {
        const invData = await invR.json();
        (invData.counts || []).forEach(c => {
          // Only IN_STOCK counts are sellable. Stock removed as damaged/lost/waste
          // comes back as other states and must not be added back on.
          const q = c.state && c.state !== 'IN_STOCK' ? 0 : parseInt(c.quantity || 0, 10);
          stockMap[c.catalog_object_id] = (stockMap[c.catalog_object_id] || 0) + q;
        });
      }
    }

    const product = {
      id: item.id,
      name: item.item_data?.name || '',
      description: item.item_data?.description || '',
      category: (() => {
        const catId = item.item_data?.categories?.[0]?.id || item.item_data?.category_id;
        const cat = relatedObjects.find(o => o.type === 'CATEGORY' && o.id === catId);
        return shopTab(cat?.category_data?.name, item.item_data?.name || '');
      })(),
      price: item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount || 0,
      currency: item.item_data?.variations?.[0]?.item_variation_data?.price_money?.currency || 'GBP',
      imageUrls: (item.item_data?.image_ids || []).map(id => imageMap[id]).filter(Boolean),
      variationId: item.item_data?.variations?.[0]?.id || null,
      allVariations: (item.item_data?.variations || []).map(v => ({
        id: v.id,
        name: v.item_variation_data?.name,
        price: v.item_variation_data?.price_money?.amount || 0,
        stock: soldOutAt(v, locationId) ? 0 : (stockMap[v.id] ?? null),
      })),
    };

    return { props: { product, error: null } };

  } catch (e) {
    return { props: { product: null, error: e.message } };
  }
}
