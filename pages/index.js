import { useState } from 'react';
import Head from 'next/head';
import ProductCard from '../components/ProductCard';
import Cart from '../components/Cart';
import styles from '../styles/Home.module.css';

export default function Home({ initialProducts, categories, error, fetchedAt }) {
  const [products] = useState(initialProducts || []);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = products
    .filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      const aOut = a.stock === 0;
      const bOut = b.stock === 0;
      if (aOut && !bOut) return 1;
      if (!aOut && bOut) return -1;
      return 0;
    });

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const changeQty = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <Head>
        <title>Kanatani Toys — Strange Toys for Strange People</title>
        <meta name="description" content="Japanese toys, art and collectibles — kaiju, sofubi, designer toys and independent artists. Hand-picked in Japan, genuinely loved. Shop online or visit us in Lewes, East Sussex." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.root}>
        <header className={styles.header}>
          <div
            className={styles.headerLogo}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <img src="/logo.png" alt="Kanatani Toys" className={styles.logo} />
            <div>
              <div className={styles.logoText}>KANATANI</div>
              <div className={styles.logoSub}>カナタニ · TOYS · LEWES</div>
            </div>
          </div>
          <nav className={styles.nav}>
            <a href="#shop">Shop</a>
            <a href="/our-story">Our Story</a>
            <a href="/about">Find Us</a>
          </nav>
          <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
            <span>🛒</span>
            <span>Basket</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroStars} aria-hidden="true" />
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>カナタニ · LEWES · EAST SUSSEX</p>
            <h1 className={styles.heroTitle}>Kanatani Toys</h1>
            <p className={styles.heroSub}>
              Japanese toys, art and collectibles — kaiju, sofubi, designer toys and independent artists from Japan and around the world. Hand-picked. Genuinely loved.
            </p>
            <div className={styles.heroActions}>
              <a href="#shop" className={styles.heroBtnPrimary}>Browse the Shop</a>
              <a href="/our-story" className={styles.heroBtnSecondary}>Our Story →</a>
            </div>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search toys... おもちゃを探す"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </section>

        <div className={styles.aboutStrip}>
          <span className={styles.aboutStripItem}>🇯🇵 Hand-picked in Japan</span>
          <span className={styles.aboutStripDivider} />
          <span className={styles.aboutStripItem}>🎌 Independent Artists</span>
          <span className={styles.aboutStripDivider} />
          <span className={styles.aboutStripItem}>👾 Kaiju · Sofubi · Designer Toys</span>
          <span className={styles.aboutStripDivider} />
          <span className={styles.aboutStripItem}>📍 Old Needlemakers Lewes</span>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            ⚠ Square connection issue: {error}
          </div>
        )}

        <div className={styles.filterBar} id="shop">
          <div className={styles.filterTabs}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterTab} ${activeCategory === cat ? styles.filterTabActive : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={styles.productMeta}>
            {filtered.length} products
            {fetchedAt && <span> · synced {new Date(fetchedAt).toLocaleTimeString()}</span>}
          </div>
        </div>

        <main className={styles.main}>
          <h2 className={styles.sectionTitle}>Featured Items</h2>
          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              <p>🔍</p>
              <p>No products found{search ? ` for "${search}"` : ''}.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  cart={cart}
                  onOpenCart={() => setCartOpen(true)}
                />
              ))}
            </div>
          )}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerLeft}>
            <img src="/logo.png" alt="" className={styles.footerLogo} />
            <div>
              <div className={styles.footerName}>KANATANI TOYS</div>
              <div className={styles.footerSub}>Strange Toys for Strange People</div>
            </div>
          </div>
          <div className={styles.footerRight}>
            Powered by Square API · Products & stock update automatically
          </div>
        </footer>

        {cartOpen && (
          <Cart
            cart={cart}
            onClose={() => setCartOpen(false)}
            onChangeQty={changeQty}
            onRemove={removeFromCart}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  try {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const env = process.env.SQUARE_ENVIRONMENT || 'production';
    const base = env === 'sandbox'
      ? 'https://connect.squareupsandbox.com'
      : 'https://connect.squareup.com';

    if (!token || !locationId) {
      return {
        props: {
          initialProducts: [],
          categories: ['All'],
          error: 'Square credentials not configured',
          fetchedAt: null,
        },
      };
    }

    let allObjects = [];
    let cursor = null;
    do {
      const url = `${base}/v2/catalog/list?types=ITEM,CATEGORY,IMAGE${cursor ? `&cursor=${cursor}` : ''}`;
      const r = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Square-Version': '2025-01-23',
          'Cache-Control': 'no-cache',
        },
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.errors?.[0]?.detail || 'Square catalog error');
      allObjects = allObjects.concat(data.objects || []);
      cursor = data.cursor || null;
    } while (cursor);

    const categoryMap = {};
    allObjects.filter(o => o.type === 'CATEGORY')
      .forEach(c => { categoryMap[c.id] = c.category_data?.name || 'Other'; });

    const imageMap = {};
    allObjects.filter(o => o.type === 'IMAGE')
      .forEach(img => {
        if (img.image_data?.url) imageMap[img.id] = img.image_data.url;
      });

    const items = allObjects.filter(o => o.type === 'ITEM');

    const variationIds = items.flatMap(i => i.item_data?.variations?.map(v => v.id) || []);
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

    const products = items
      .filter(item => {
        if (item.is_deleted) return false;
        if (!item.item_data?.name) return false;
        if (item.item_data?.ecom_visibility === 'HIDDEN') return false;
        if (item.item_data?.available_online === false) return false;
        return true;
      })
      .map(item => {
        const v = item.item_data?.variations?.[0];
        const stock = stockMap[v?.id] ?? null;
        return {
          id: item.id,
          name: item.item_data.name,
          description: item.item_data?.description || '',
          category: categoryMap[item.item_data?.category_id] || 'Other',
          price: v?.item_variation_data?.price_money?.amount || 0,
          currency: v?.item_variation_data?.price_money?.currency || 'GBP',
          stock,
          imageUrls: (item.item_data?.image_ids || [])
            .map(id => imageMap[id])
            .filter(Boolean),
          variationId: v?.id || null,
          allVariations: (item.item_data?.variations || []).map(vv => ({
            id: vv.id,
            name: vv.item_variation_data?.name,
            price: vv.item_variation_data?.price_money?.amount || 0,
            stock: stockMap[vv.id] ?? null,
          })),
        };
      })
      .filter(p => p.price > 0)
      .reverse();

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return {
      props: {
        initialProducts: products,
        categories,
        error: null,
        fetchedAt: new Date().toISOString(),
      },
    };

  } catch (e) {
    return {
      props: {
        initialProducts: [],
        categories: ['All'],
        error: e.message,
        fetchedAt: null,
      },
    };
  }
}
