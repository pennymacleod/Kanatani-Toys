import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { SHIRTS } from '../../lib/tshirts';
import { useLang } from '../../lib/lang';

// One page per t-shirt, laid out like a toy's product page.
export default function TShirtPage({ slug }) {
  const i = SHIRTS.findIndex(s => s.slug === slug);
  const shirt = SHIRTS[i];
  const next = SHIRTS[(i + 1) % SHIRTS.length];
  const [big, setBig] = useState(false);
  const { lang, t } = useLang();

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
                <div className="bigprice" style={{ fontSize: 26 }}>{t('Available online soon', 'オンライン販売はもうすぐ')}</div>
              </div>

              <div className="specs">
                <div className="spec"><b>{t('STOCK', '在庫')}</b><span>{t('In the shop now', '店頭にあります')}</span></div>
                <div className="spec"><b>{t('WHERE', '販売場所')}</b><span>{t('Brighton shop · online soon', 'ブライトンのお店 · オンラインはもうすぐ')}</span></div>
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
