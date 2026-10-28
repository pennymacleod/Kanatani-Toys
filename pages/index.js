import { SQUARE_LOCATION_ID } from '../lib/squareLocation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { SHOP_TABS, TAB_PAGES, TAB_JA, shopTab } from '../lib/categories';
import { useLang } from '../lib/lang';

const IRASSHAI = ['い', 'ら', 'っ', 'し', 'ゃ', 'い', 'ま', 'せ'];

export default function Home({ initialProducts, categories, error }) {
  const products = initialProducts || [];
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { lang, t } = useLang();

  // Lets other pages link to a search, e.g. /?q=hedorah#shop
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setSearch(q);
  }, []);

  const filtered = products
    .filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      const aOut = a.stock === 0;
      const bOut = b.stock === 0;
      if (aOut && !bOut) return 1;
      if (!aOut && bOut) return -1;
      // On "All": sofubi first, then merch, then other strange things.
      return SHOP_TABS.indexOf(a.category) - SHOP_TABS.indexOf(b.category);
    });

  return (
    <Layout
      active="shop"
      head={(
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              '@id': 'https://kanatanitoys.com',
              name: 'Kanatani Toys',
              image: 'https://kanatanitoys.com/social-share.jpg',
              url: 'https://kanatanitoys.com',
              email: 'kanatanitoys@gmail.com',
              priceRange: '££',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Open Market, Unit 7, Marshalls Row',
                addressLocality: 'Brighton',
                addressRegion: 'Brighton and Hove',
                postalCode: 'BN1 4JU',
                addressCountry: 'GB',
              },
              // Alternate-Sunday opening (12:00–15:00) can't be expressed in schema.org,
              // so only the fixed Tue–Sat hours are listed here.
              openingHoursSpecification: [{
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '11:00',
                closes: '17:00',
              }],
              sameAs: [
                'https://www.instagram.com/kanatani_toys',
                'https://www.tiktok.com/@kanatani.toys',
                'https://www.facebook.com/share/1EYfzmmyZi/',
                'https://www.youtube.com/@KANATANITOYS-g6q',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '19',
              },
            }),
          }}
        />
      )}
    >
      <section className="floor herosec">
        <div className="wrap hero">
          <div>
            <span className="kicker">怪獣 · ソフビ · BRIGHTON</span>
            <h1 className="big" style={{ fontSize: lang === 'ja' ? 'clamp(38px,5.6vw,62px)' : 88, lineHeight: lang === 'ja' ? 1.3 : undefined, margin: '22px 0 26px', color: 'var(--pink)' }}>
              {lang === 'ja'
                ? <><span style={{ color: 'var(--sky)' }}>ストレンジ</span>な人のための<br />ストレンジなおもちゃ</>
                : <>Strange toys<br />for <span style={{ color: 'var(--sky)' }}>strange</span><br />people</>}
            </h1>
            <p style={{ fontSize: 21, lineHeight: 1.55, fontWeight: 600, maxWidth: '30em', margin: '0 0 12px' }}>
              {t('We specialise in Sofubi, Kaiju and vintage treasures, hand-picked from Japan.', '日本で一つひとつ選んだソフビ、怪獣、ヴィンテージのお宝を扱っています。')}
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.55, fontWeight: 600, maxWidth: '30em', margin: '0 0 12px' }}>
              {t('We\u2019re also proud to support so many independent artists: makers of handmade sofubi and indie art toys, whose wonderfully strange creations are showcased in our shop.', '世界中のインディペンデント・アーティストを応援できることも、私たちの誇りです。手作りソフビやインディーのアートトイを生み出すアーティストたちの、最高にストレンジな作品をお店で紹介しています。')}
            </p>
            <p style={{ fontSize: 19, lineHeight: 1.55, fontWeight: 600, maxWidth: '30em', margin: '0 0 28px' }}>
              {t('And all the amazing artists who show their work with us, from prints to keyrings, stickers and amazing clothes. We\u2019re so proud at Kanatani Toys to support so many amazing artists.', 'プリント、キーホルダー、ステッカー、素敵な洋服まで、作品を置いてくれているすべてのアーティストに感謝しています。カナタニ・トイズは、たくさんの素晴らしいアーティストを応援できることを心から誇りに思っています。')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <a className="btn" href="#shop" style={{ background: 'var(--sky)' }}>{t('Shop the toys →', 'おもちゃを見る →')}</a>
              <Link className="btn" href="/about" style={{ background: '#fff' }}>{t('Visit the shop', 'お店に行く')}</Link>
            </div>
          </div>
          <div className="heroart">
            <div className="irasshai" aria-label="Irasshaimase">
              {IRASSHAI.map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}
            </div>
            <div className="welcome">WELCOME!</div>
            <div className="circ"><img className="peeker" src="/nl/pink_head_bold.png" alt="" /></div>
          </div>
        </div>
      </section>

      <section id="shop" className="board" style={{ padding: '60px 0' }}>
        <div className="plaque"><h2 className="mid" style={{ fontSize: 54, color: 'var(--sky)', margin: 0 }}>{t('New in the cabinet', 'ショーケースの新入荷')}</h2></div>
      </section>

      <section className="floor" style={{ padding: '56px 0 70px' }}>
        <div className="wrap">
          {error && <div className="errorbar">{t('Sorry, we couldn\u2019t load the toys from our till just now. Please try again in a minute.', '申し訳ありません。ただいまレジからおもちゃを読み込めませんでした。少し経ってからもう一度お試しください。')}</div>}
          <div className="shopbar">
            <div className="cats" role="group" aria-label="Filter by category">
              {categories.map(cat => (
                TAB_PAGES[cat] && !products.some(p => p.category === cat) ? (
                  <Link key={cat} href={TAB_PAGES[cat]} className="cat">{t(cat, TAB_JA[cat])} →</Link>
                ) : (
                  <button
                    key={cat}
                    type="button"
                    className={`cat${activeCategory === cat ? ' on' : ''}`}
                    aria-pressed={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {t(cat, TAB_JA[cat])}
                  </button>
                )
              ))}
            </div>
            <input
              type="search"
              className="search"
              placeholder="Search toys… おもちゃを探す"
              aria-label="Search toys"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cabinet">
            <p className="shopcount">{lang === 'ja' ? `${filtered.length}点` : `${filtered.length} ${filtered.length === 1 ? 'toy' : 'toys'}`}</p>
            {filtered.length === 0 ? (
              TAB_PAGES[activeCategory] && !search ? (
                <p className="noresults">{lang === 'ja'
                  ? <><Link href={TAB_PAGES[activeCategory]} style={{ textDecoration: 'underline' }}>{TAB_JA[activeCategory]}のページ →</Link>を見てね</>
                  : <>Have a look on our <Link href={TAB_PAGES[activeCategory]} style={{ textDecoration: 'underline' }}>{activeCategory} page →</Link></>}</p>
              ) : (
                <p className="noresults">{lang === 'ja'
                  ? `${search ? `「${search}」に` : ''}一致するおもちゃは見つかりませんでした。別の言葉で探してみてください!`
                  : `No toys found${search ? ` for "${search}"` : ''}. Try another word!`}</p>
              )
            ) : (
              <div className="shelf">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div id="gachapromo" className="wrap" style={{ paddingBlock: '0 56px' }}>
        <Link href="/gachapon" className="gp" style={{ background: 'var(--green)', border: '5px solid var(--ink)', borderRadius: 22, padding: '24px 28px', boxShadow: '8px 8px 0 var(--ink)', color: 'var(--ink)' }}>
          <span className="gpt">
            <span style={{ fontWeight: 900, letterSpacing: '.2em', fontSize: 14 }}>NEW · ガチャガチャ</span>
            <span className="big" style={{ fontSize: 'clamp(30px,4vw,46px)', color: '#fff', display: 'block' }}>{t('Play Kaiju Gachapon!', '怪獣ガチャポンで遊ぼう!')}</span>
            <span style={{ fontWeight: 700, fontSize: 17 }}>{t('Turn the handle, open a capsule, collect all ten kaiju.', 'ハンドルを回してカプセルを開けて、怪獣10体を全部集めよう。')}</span>
          </span>
          <span className="btn" style={{ background: 'var(--gold)' }}>{t('Play →', '遊ぶ →')}</span>
        </Link>
      </div>

      <section id="story" className="floor" style={{ padding: '10px 0 80px' }}>
        <div className="wrap visit">
          <Link href="/about" className="counter visitbox" style={{ color: 'inherit' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div className="big" style={{ fontSize: 'clamp(40px,6vw,72px)', color: 'var(--gold)', lineHeight: 1 }}>{t('Come and visit!', '遊びに来てね!')}</div>
              <div className="mid" style={{ fontSize: 44, color: '#fff', margin: '10px 0' }}>Unit 7, Brighton Open Market</div>
              <div style={{ fontSize: 19 }}>{t('Marshalls Row, Brighton BN1 4JU · Tue–Sat 11–5 · every other Sunday 12–3', 'Marshalls Row, Brighton BN1 4JU · 火〜土 11時〜17時 · 日曜は隔週 12時〜15時')}</div>
              <span className="tapme"><span className="arr">👉</span> {t('Tap here to find us', 'タップして行き方を見る')} <span className="arr r">👈</span></span>
            </div>
          </Link>
          <div className="mascotcol" style={{ textAlign: 'center' }}>
            <div className="bubble-say">{t('Come and say hi!', '気軽に寄ってね!')}</div>
            <img src="/nl/orange_bold.png" alt="" style={{ width: 190, display: 'block', margin: '0 auto' }} />
          </div>
        </div>
      </section>

      <div className="peekus floor" aria-hidden="true">
        <img src="/nl/penny-hiro.png" alt="" />
        <span className="say">{t('こんにちは! Come and say hello!', 'こんにちは! 遊びに来てね!')}</span>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ res }) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  try {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = SQUARE_LOCATION_ID;
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
        // Hidden from the website if Penny hides it, archives it, or switches
        // off online selling for it in Square.
        if (item.item_data?.is_archived) return false;
        if (['HIDDEN', 'UNAVAILABLE'].includes(item.item_data?.ecom_visibility)) return false;
        if (item.item_data?.available_online === false) return false;
        return true;
      })
      .map(item => {
        const v = item.item_data?.variations?.[0];
        const stock = stockMap[v?.id] ?? null;
        const catId = item.item_data?.categories?.[0]?.id || item.item_data?.category_id;
        return {
          id: item.id,
          name: item.item_data.name,
          description: item.item_data?.description || '',
          category: shopTab(categoryMap[catId], item.item_data.name),
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

    const categories = SHOP_TABS;

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
