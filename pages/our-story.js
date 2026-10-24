import Link from 'next/link';
import Layout from '../components/Layout';
import { useLang } from '../lib/lang';

export default function OurStory() {
  const { t } = useLang();
  return (
    <Layout
      title="Our Story — Kanatani Toys"
      description="We're Penny and Hiro. We love Japanese sofubi, the handmade toy scene and the strange people who make it. From a tiny shop in Lewes to Brighton Open Market."
      path="/our-story"
      active="story"
      page="ourstory"
    >
      <section className="floor">
        <div className="wrap st-hero">
          <span className="kicker">{t('OUR STORY · STRANGE TOYS FOR STRANGE PEOPLE', '私たちについて · ストレンジな人のための、ストレンジなおもちゃ')}</span>
          <h1 className="big" style={{ fontSize: 'clamp(50px,8vw,104px)' }}>No Toy, <span style={{ color: 'var(--sky)' }}>No Life</span></h1>
          <p>{t('We\u2019re Penny and Hiro. We love Japanese sofubi, the handmade toy scene and the strange people who make it. Kanatani Toys is where we get to share it.', 'ペニーとヒロです。日本のソフビ、ハンドメイドトイのシーン、そしてそれを生み出すストレンジな人たちが大好きです。その魅力をみんなとシェアする場所が、カナタニ・トイズです。')}</p>
        </div>

        <div className="wrap pair">
          <div className="photo">
            <div className="frame" style={{ '--c': 'var(--sky)', '--r': '-2.5deg' }}>
              <img src="/nl/lewes-shop.jpg" alt="Penny and Hiro outside the old Kanatani Toys shop in The Needlemakers, Lewes" style={{ objectPosition: '35% 50%' }} />
            </div>
            <span className="tag2">{t('The Needlemakers, Lewes', 'ルイスのThe Needlemakers')}</span>
          </div>
          <div className="copy">
            <span className="eyebrow">{t('HOW IT STARTED', 'はじまり')}</span>
            <h2 className="big">{t('A tiny little shop in Lewes', 'ルイスの小さな小さなお店')}</h2>
            <p>{t('Kanatani Toys opened in November 2025 in The Needlemakers in Lewes. We wanted to bring the Japanese toys, art and collectibles we love to the UK: kaiju and Godzilla, sofubi, designer toys and vintage finds.', 'カナタニ・トイズは2025年11月、イギリス・ルイスのThe Needlemakersでオープンしました。怪獣やゴジラ、ソフビ、デザイナーズトイ、ヴィンテージの掘り出し物など、私たちが大好きな日本のおもちゃ、アート、コレクタブルをイギリスに届けたかったのです。')}</p>
            <p>{t('We travel to Japan to hand-pick vintage and second-hand treasures, and every single thing on our shelves is something we genuinely love.', '日本に足を運んで、ヴィンテージや中古のお宝を一つひとつ自分たちの目で選んでいます。棚に並ぶものは、どれも私たちが心から大好きなものばかりです。')}</p>
          </div>
        </div>

        <div className="wrap pair flip">
          <div className="photo">
            <div className="frame" style={{ '--c': 'var(--pink)', '--r': '2deg' }}>
              <img src="/nl/brighton-us.jpg" alt="Penny and Hiro outside Kanatani Toys in Brighton" style={{ objectPosition: '30% 30%' }} />
            </div>
            <span className="tag2" style={{ left: 'auto', right: -10, transform: 'rotate(4deg)' }}>{t('Unit 7, Open Market', 'オープンマーケット Unit 7')}</span>
          </div>
          <div className="copy">
            <span className="eyebrow">{t('WHERE WE ARE NOW', 'いま')}</span>
            <h2 className="big">{t('Hello, Brighton!', 'こんにちは、ブライトン！')}</h2>
            <p>{t('We\u2019d built up a lovely group of customers in Lewes, and that gave us the confidence to take the leap. In September 2026 we moved to Brighton Open Market and rebuilt our shop, so we could focus much more on the art side of the toy scene.', 'ルイスで素敵なお客さんたちに出会えたことが、次の一歩を踏み出す自信になりました。2026年9月、ブライトン・オープンマーケットに移転してお店を作り直し、トイシーンのアートの部分にもっと力を入れられるようになりました。')}</p>
            <p>{t('We\u2019re loving our first month here so far!', 'ここでの最初の1か月、とても楽しんでいます！')}</p>
          </div>
        </div>
      </section>

      <section className="art">
        <div className="wrap inner">
          <div>
            <span className="kicker" style={{ background: 'var(--gold)', color: 'var(--ink)' }}>{t('ソフビ · THE SOFUBI SHOWCASE', 'ソフビ · ソフビ・ショーケース')}</span>
            <h2 className="big" style={{ fontSize: 'clamp(36px,5vw,60px)', marginTop: 16 }}>{t('Hunting for crazy creations', 'クレイジーな作品を探して')}</h2>
            <p>{t('We\u2019re lucky to connect with lots of amazing independent artists who specialise in Sofubi, and we love showcasing their crazy creations in the shop. We want to give the strange and the weird a home here in Brighton.', 'ありがたいことに、ソフビを専門とする素晴らしいインディペンデント・アーティストたちとたくさんつながることができ、その最高にクレイジーな作品をお店で紹介しています。ここブライトンに、ストレンジで奇妙なものたちの居場所を作りたいのです。')}</p>
            <p>{t('Many of these artists have never been shown in the UK. Their work usually only appears at galleries or toy conventions, not on a shop shelf every day. So we built a home where it can be on our shelves all the time, and where people can discover this fantastic art.', 'その多くは、イギリスではまだ紹介されたことのないアーティストです。作品が見られるのは普段はギャラリーやトイコンベンションだけで、毎日お店の棚に並ぶことはありません。だから私たちは、いつでも棚に作品が並び、たくさんの人がこの素晴らしいアートに出会える場所を作りました。')}</p>
            <p>{t('Alongside the sofubi you\u2019ll find lots of other independent makers: printmakers, sticker makers, t-shirt printers, and the list goes on. We\u2019re here to showcase it all.', 'ソフビと並んで、版画家、ステッカー作家、Tシャツのプリント職人など、ほかにもたくさんのインディペンデントな作り手の作品があります。そのすべてを紹介するのが私たちの役目です。')}</p>
            <Link className="btn" href="/sofubi-showcase" style={{ background: 'var(--pink)', color: '#fff', marginTop: 8 }}>{t('Meet the artists →', 'アーティストに会う →')}</Link>
          </div>
        </div>
      </section>

      <section className="floor">
        <div className="wrap sign-off">
          <h2 className="big" style={{ fontSize: 'clamp(34px,5vw,56px)', color: 'var(--pink)', margin: 0 }}>{t('Come and say hello', '遊びに来てね')}</h2>
          <p>{t('We\u2019re open Tuesday to Saturday, 11 to 5, and every other Sunday, 12 to 3.', '営業時間は火曜〜土曜の11時〜17時、日曜は隔週で12時〜15時です。')}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn" href="/about" style={{ background: 'var(--gold)' }}>{t('Find us →', 'アクセス →')}</Link>
            <Link className="btn" href="/#shop" style={{ background: '#fff' }}>{t('Shop the toys', 'おもちゃを見る')}</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
