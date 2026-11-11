import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { SHIRTS } from '../../lib/tshirts';
import { useLang } from '../../lib/lang';
import { useCart } from '../../lib/cart';

// One page per t-shirt, laid out like a toy's product page.
export default function TShirtPage({ slug }) {
  const i = SHIRTS.findIndex(s => s.slug === slug);
  const shirt = SHIRTS[i];
  const next = SHIRTS[(i + 1) % SHIRTS.length];
  const [big, setBig] = useState(false);
  const { lang, t } = useLang();
  const { add, setOpen } = useCart();
  // Live from Square once the shirt is set up there (sizes, price, stock).
  const [live, setLive] = useState(null);
  const [size, setSize] = useState('');
  const [added, setAdded] = useState('');
  useEffect(() => {
    let alive = true;
    fetch('/api/catalog').then(r => (r.ok ? r.json() : null)).then(d => {
      const p = (d?.products || []).find(x => x.name.trim().toLowerCase() === shirt.name.toLowerCase());
      if (!alive || !p) return;
      const gone = (shirt.soldOut || []).map(x => x.toUpperCase());
      const sizes = (p.allVariations || []).filter(v => ['S', 'M', 'L', 'SMALL', 'MEDIUM', 'LARGE'].includes(String(v.name || '').trim().toUpperCase()))
        .map(v => (gone.includes(String(v.name || '').trim().charAt(0).toUpperCase()) ? { ...v, stock: 0 } : v));
      if (!sizes.length) return;
      setLive({ ...p, sizes });
      const first = sizes.find(v => v.stock == null || v.stock > 0);
      setSize(first ? first.id : '');
    }).catch(() => {});
    return () => { alive = false; };
  }, [shirt.name]);
  const chosen = live?.sizes.find(v => v.id === size);
  const buy = () => {
    if (!chosen) return;
    const ok = add({ id: chosen.id, variationId: chosen.id, name: `${shirt.name} t-shirt – ${chosen.name}`, price: chosen.price, stock: chosen.stock, imageUrls: live.imageUrls });
    setAdded(ok ? chosen.id : 'full');
  };

  useEffect(() => {
    if (!big) return;
    const onKey = (e) => { if (e.key === 'Escape') setBig(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [big]);

  return (
    <Layout
      title={`${shirt.name} t-shirt — Kanatani Toys`}
      description={`${shirt.name} t-shirt at Kanatani Toys, Unit 7, Brighton Open Market. Available online soon.`}
      path={`/t-shirts/${shirt.slug}`}
      page="product"
      active="tshirts"
    >
      <section className="floor">
        <div className="wrap" style={{ paddingBottom: 80 }}>
          <div className="crumb"><Link href="/t-shirts">{t('← All t-shirts', '← Tシャツ一覧')}</Link></div>
          <div className="pp">
            <div className="gallery">
              <div
                className="main"
                onClick={() => setBig(true)}
                role="button"
                tabIndex={0}
                aria-label={t('Show photo full size', '写真を大きく見る')}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setBig(true); } }}
              >
                <img src={shirt.img} alt={`${shirt.name} t-shirt`} />
              </div>
            </div>

            <div className="info">
              <span className="achip"><i />{t('CLOTHING', '洋服')}</span>
              <h1 className="big" style={{ fontSize: 'clamp(36px,5vw,60px)', margin: '20px 0 10px', color: 'var(--pink)', lineHeight: 1.1 }}>{shirt.name}</h1>
              <div className="buyrow">
                {live
                  ? <div className="bigprice">£{(chosen?.price || live.price) / 100}</div>
                  : shirt.price
                    ? <div className="bigprice">£{shirt.price}</div>
                    : <div className="bigprice" style={{ fontSize: 26 }}>{t('Available online soon', 'オンライン販売はもうすぐ')}</div>}
              </div>
              {live && (
                <div className="buyrow" style={{ flexWrap: 'wrap', gap: 10 }}>
                  <div role="radiogroup" aria-label={t('Size', 'サイズ')} style={{ display: 'flex', gap: 8 }}>
                    {live.sizes.map(v => {
                      const out = v.stock != null && v.stock <= 0;
                      return (
                        <button key={v.id} type="button" role="radio" aria-checked={size === v.id} disabled={out}
                          onClick={() => { setSize(v.id); setAdded(''); }}
                          style={{ minWidth: 52, padding: '10px 14px', borderRadius: 12, border: '3px solid var(--ink)', fontWeight: 900, fontSize: 18, cursor: out ? 'not-allowed' : 'pointer', background: size === v.id ? 'var(--ink)' : '#fff', color: size === v.id ? '#fff' : 'var(--ink)', opacity: out ? 0.35 : 1, textDecoration: out ? 'line-through' : 'none' }}>
                          {String(v.name).trim().charAt(0).toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                  {chosen
                    ? (added === chosen.id
                      ? <button type="button" className="btn" onClick={() => setOpen(true)} style={{ background: 'var(--green)', color: 'var(--ink)' }}>{t('View basket →', 'カートを見る →')}</button>
                      : <button type="button" className="btn" onClick={buy} style={{ background: 'var(--pink)', color: '#fff' }}>{t('Add to basket', 'カートに入れる')}</button>)
                    : <span style={{ fontWeight: 800 }}>{t('Sold out online', 'オンラインは売り切れ')}</span>}
                  {added === 'full' && <span style={{ fontWeight: 700 }}>{t('That\u2019s all we have in that size.', 'そのサイズはこれで全部です。')}</span>}
                </div>
              )}

              <div className="specs">
                <div className="spec"><b>{t('STOCK', '在庫')}</b><span>{t('In the shop now', '店頭にあります')}</span></div>
                {(live ? live.sizes.some(v => v.stock == null || v.stock > 0) : shirt.sizes?.length > 0) && <div className="spec"><b>{t('SIZES', 'サイズ')}</b><span>{live ? live.sizes.filter(v => v.stock == null || v.stock > 0).map(v => String(v.name).trim().charAt(0).toUpperCase()).join(' · ') : shirt.sizes.join(' · ')}</span></div>}
                <div className="spec"><b>{t('WHERE', '販売場所')}</b><span>{live ? t('Brighton shop · online (UK post)', 'ブライトンのお店 · オンライン（イギリス国内発送）') : t('Brighton shop · online soon', 'ブライトンのお店 · オンラインはもうすぐ')}</span></div>
              </div>

              <p style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 26px' }}>
                {lang === 'ja'
                  ? `「${shirt.name}」Tシャツは、ブライトン・オープンマーケットのUnit 7で販売中です。`
                  : `Our ${shirt.name} t-shirt is in the shop at Unit 7, Brighton Open Market.`}
              </p>

              {SHIRTS.length > 1 && (
                <p style={{ margin: '24px 0 0' }}>
                  <Link href={`/t-shirts/${next.slug}`} style={{ fontWeight: 800, textDecoration: 'underline' }}>{t('Next t-shirt:', '次のTシャツ：')} {next.name} →</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {big && (
        <div className="lightbox" onClick={() => setBig(false)} role="dialog" aria-modal="true" aria-label={`${shirt.name} t-shirt`}>
          <button type="button" className="lbbtn lbclose" onClick={(e) => { e.stopPropagation(); setBig(false); }} aria-label={t('Close', '閉じる')}>✕</button>
          <img src={shirt.img} alt={`${shirt.name} t-shirt`} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </Layout>
  );
}

export function getStaticPaths() {
  return { paths: SHIRTS.map(s => ({ params: { slug: s.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  return { props: { slug: params.slug } };
}
