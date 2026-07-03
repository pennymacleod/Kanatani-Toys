import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Cart from '../../components/Cart';
import styles from '../../styles/Product.module.css';
import homeStyles from '../../styles/Home.module.css';

const fmt = (p) => `£${(p / 100).toFixed(2)}`;

export default function ProductPage({ product, error }) {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(
    product?.allVariations?.[0] || null
  );
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (error || !product) {
    return (
      <div className={styles.errorPage}>
        <h1>Product not found</h1>
        <button onClick={() => router.push('/')}>← Back to shop</button>
      </div>
    );
  }

  const outOfStock = selectedVariation?.stock === 0;
  const lowStock = selectedVariation?.stock > 0 && selectedVariation?.stock <= 5;

  const addToCart = () => {
    if (outOfStock) return;
    setCart(prev => {
      const id = selectedVariation?.id || product.id;
      const ex = prev.find(i => i.id === id);
      if (ex) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        ...product,
        id: selectedVariation?.id || product.id,
        price: selectedVariation?.price || product.price,
        variationId: selectedVariation?.id || product.variationId,
        qty: 1,
      }];
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const changeQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <Head>
        <title>{product.name} — Kanatani Toys</title>
        <meta name="description" content={product.description || product.name} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={homeStyles.root}>
        {/* Header */}
        <header className={homeStyles.header}>
          <div className={homeStyles.headerLogo} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Kanatani Toys" className={homeStyles.logo} />
            <div>
              <div className={homeStyles.logoText}>KANATANI</div>
              <div className={homeStyles.logoSub}>カナタニ · TOYS · LEWES</div>
            </div>
          </div>
          <nav className={homeStyles.nav}>
            <a href="/#shop">Shop</a>
            <a href="/our-story">Our Story</a>
            <a href="/about">Find Us</a>
          </nav>
          <button className={homeStyles.cartBtn} onClick={() => setCartOpen(true)}>
            <span>🛒</span>
            <span>Basket</span>
            {cartCount > 0 && <span className={homeStyles.cartBadge}>{cartCount}</span>}
          </button>
        </header>

        <div className={styles.page}>
          {/* Back button */}
          <button className={styles.backBtn} onClick={() => router.push('/')}>
            ← Back to shop
          </button>

          <div className={styles.layout}>
            {/* Images */}
            <div className={styles.imageSection}>
              <div className={styles.mainImage}>
                {product.imageUrls?.length > 0 ? (
                  <img
                    src={product.imageUrls[activeImg]}
                    alt={product.name}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className={styles.noImage}>🧸</div>
                )}
              </div>
              {product.imageUrls?.length > 1 && (
                <div className={styles.thumbnails}>
                  {product.imageUrls.map((url, i) => (
                    <div
                      key={i}
                      className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={url} alt={`${product.name} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className={styles.details}>
              <div className={styles.category}>{product.category}</div>
              <h1 className={styles.name}>{product.name}</h1>

              {/* Price */}
              <div className={styles.priceRow}>
                <span className={styles.price}>
                  {fmt(selectedVariation?.price || product.price)}
                </span>
                {outOfStock && <span className={styles.badgeOut}>Sold Out</span>}
                {lowStock && <span className={styles.badgeLow}>Only {selectedVariation.stock} left</span>}
              </div>

              {/* Variations */}
              {product.allVariations?.length > 1 && (
                <div className={styles.variations}>
                  <div className={styles.variationLabel}>OPTIONS</div>
                  <div className={styles.variationBtns}>
                    {product.allVariations.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariation(v)}
                        className={`${styles.varBtn} ${selectedVariation?.id === v.id ? styles.varBtnActive : ''}`}
                        disabled={v.stock === 0}
                      >
                        {v.name}
                        {v.stock === 0 && ' (sold out)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className={styles.descriptionSection}>
                  <div className={styles.descLabel}>DESCRIPTION</div>
                  <p className={styles.description}>{product.description}</p>
                </div>
              )}

              {/* Add to cart */}
              <button
                className={`${styles.addBtn} ${added ? styles.addBtnDone : ''} ${outOfStock ? styles.addBtnDisabled : ''}`}
                onClick={addToCart}
                disabled={outOfStock}
              >
                {outOfStock ? 'Sold Out' : added ? '✓ Added to Basket' : 'Add to Basket'}
              </button>

              {cartCount > 0 && (
                <button className={styles.viewCartBtn} onClick={() => setCartOpen(true)}>
                  View Basket ({cartCount}) →
                </button>
              )}

              <p className={styles.note}>
                Stock updates live from our Square till · Secure checkout via Square
              </p>
            </div>
          </div>
        </div>

        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerLeft}>
            <img src="/logo.png" alt="" className={homeStyles.footerLogo} />
            <div>
              <div className={homeStyles.footerName}>KANATANI TOYS</div>
              <div className={homeStyles.footerSub}>Lewes, East Sussex · Tue–Sun</div>
            </div>
          </div>
          <div className={homeStyles.footerRight}>Powered by Square API</div>
        </footer>

        {cartOpen && (
          <Cart
            cart={cart}
            onClose={() => setCartOpen(false)}
            onChangeQty={changeQty}
            onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
          />
        )}
      </div>
    </>
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
    const relatedObjects = data.related_objects || [];

    // Build image map from related objects
    const imageMap = {};
    relatedObjects.filter(o => o.type === 'IMAGE').forEach(img => {
      if (img.image_data?.url) imageMap[img.id] = img.image_data.url;
    });

    // Get inventory for all variations
    const locationId = process.env.SQUARE_LOCATION_ID;
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
          stockMap[c.catalog_object_id] = (stockMap[c.catalog_object_id] || 0) + parseInt(c.quantity || 0, 10);
        });
      }
    }

    const product = {
      id: item.id,
      name: item.item_data?.name || '',
      description: item.item_data?.description || '',
      category: '',
      price: item.item_data?.variations?.[0]?.item_variation_data?.price_money?.amount || 0,
      currency: item.item_data?.variations?.[0]?.item_variation_data?.price_money?.currency || 'GBP',
      imageUrls: (item.item_data?.image_ids || []).map(id => imageMap[id]).filter(Boolean),
      variationId: item.item_data?.variations?.[0]?.id || null,
      allVariations: (item.item_data?.variations || []).map(v => ({
        id: v.id,
        name: v.item_variation_data?.name,
        price: v.item_variation_data?.price_money?.amount || 0,
        stock: stockMap[v.id] ?? null,
      })),
    };

    return { props: { product, error: null } };

  } catch (e) {
    return { props: { product: null, error: e.message } };
  }
}
