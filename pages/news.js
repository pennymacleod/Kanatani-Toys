import Layout from '../components/Layout';

const STAR = '50.0,3.0 57.4,12.7 69.1,3.8 71.1,18.4 83.2,16.8 81.6,28.9 96.2,30.9 87.3,42.6 97.0,50.0 87.3,57.4 96.2,69.1 81.6,71.1 83.2,83.2 71.1,81.6 69.1,96.2 57.4,87.3 50.0,97.0 42.6,87.3 30.9,96.2 28.9,81.6 16.8,83.2 18.4,71.1 3.8,69.1 12.7,57.4 3.0,50.0 12.7,42.6 3.8,30.9 18.4,28.9 16.8,16.8 28.9,18.4 30.9,3.8 42.6,12.7';

function Burst({ fill }) {
  return <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={STAR} fill={fill} stroke="#141018" strokeWidth="3" /></svg>;
}

const SPOTS = [
  { e: '🏯', w: 'Rural Japan', c: '#FF1F8F' },
  { e: '🏮', w: 'Tiny crazy shops', c: '#1FB6FF' },
  { e: '⛩️', w: 'Flea markets', c: '#5BD34A' },
  { e: '📦', w: 'Dusty warehouses', c: '#FF7417' },
  { e: '🎨', w: 'Artist meet-ups', c: '#E0262E' },
];

const IG = 'https://www.instagram.com/kanatani_toys';

export default function News() {
  return (
    <Layout
      title="Kanatani News — We're off to Japan!"
      description="Penny and Hiro are off to Osaka and Tokyo this December to dig up toy treasure and meet Sofubi Showcase artists. Tell us what you're hunting for."
      path="/news"
      active="news"
      page="news"
    >
      <section className="sp">
        <div className="sp-in">
          <div className="mastbar">
            <div className="jt" aria-hidden="true">{['か', 'な', 'た', 'に', '新', '聞'].map((c, i) => <span key={i}>{c}</span>)}</div>
            <h1 className="mid" style={{ margin: 0 }}>Kanatani <span>News!</span></h1>
          </div>
          <div className="issue"><span>ISSUE 1 · WINTER · FREE · WEATHER: 100% CHANCE OF TOYS</span></div>
          <div className="stage">
            <h2 className="hl" style={{ margin: 0, fontWeight: 400 }}>
              <span className="big l1">We&apos;re</span><span className="big l2">off to</span><span className="big l3">Japan!</span>
            </h2>
            <div className="hero-fig">
              <img className="pinky" src="/nl/pink.png" alt="" />
              <div className="bst b1"><Burst fill="#FFD21F" /><div>OSAKA<br />&amp; TOKYO<b>DEC!</b></div></div>
            </div>
            <div className="vred" lang="ja">日本へ行くぞ!</div>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="wrap">
          <div className="poster">
            <div className="ptop"><span>★ THE BIG TOY HUNT ★</span><span className="jpf2">おもちゃ大冒険</span></div>
            <div className="prow"><span className="lab" style={{ background: '#FF1F8F' }}>When?</span><span className="ans">This <em>December!</em></span></div>
            <div className="prow"><span className="lab" style={{ background: '#1FB6FF' }}>Where?</span><span className="ans">Osaka, then <em>Tokyo!</em></span></div>
            <div className="prow"><span className="lab" style={{ background: '#5BD34A' }}>Who?</span><span className="ans">Penny &amp; Hiro <small>(plus some very empty suitcases)</small></span></div>
            <div className="prow"><span className="lab" style={{ background: '#FF7417' }}>Why?</span><span className="ans">To dig up toy treasure, and meet artists from our <em>Sofubi Showcase!</em></span></div>
            <div className="pnote">Everything in our shop is <b>hand-picked by us</b>. We hunt high and low for interesting, crazy finds, not just what&apos;s in the big shops. We go digging!</div>
            <div className="pbig">What treasures will we find? <span>Nobody knows... that&apos;s the fun bit!</span></div>
            <img className="orangey" src="/nl/orange_bold.png" alt="" />
          </div>

          <div className="hg">
            <span className="plaque"><span className="mid" style={{ fontSize: 'clamp(28px,4.4vw,48px)', color: 'var(--sky)' }}>Where we&apos;ll be digging</span></span>
            <div className="stickers">
              {SPOTS.map(s => (
                <div key={s.w} className="stk"><Burst fill={s.c} /><div><span className="e" aria-hidden="true">{s.e}</span><span className="w">{s.w}</span></div></div>
              ))}
            </div>
          </div>

          <div className="duo2">
            <div className="panel" style={{ background: 'var(--sky)' }}>
              <h2 className="big" style={{ color: '#FFD21F' }}>Wish list!</h2>
              <p>Hunting for a grail? A kaiju you&apos;ve wanted since you were small? Tell us and we&apos;ll keep our eyes peeled in Japan!</p>
              <div className="soonnote">
                Our wish list form is coming soon. For now, send us a message on Instagram{' '}
                <a href={IG} target="_blank" rel="noopener noreferrer">@kanatani_toys</a> or tell us in the shop!
              </div>
            </div>
            <div className="panel" style={{ background: 'var(--pink)' }}>
              <img className="pk" src="/nl/pink_head_bold.png" alt="" />
              <h2 className="big" style={{ color: '#fff' }}>Get the news!</h2>
              <p style={{ color: '#fff' }}>Be first to hear when the Japan haul lands. No spam, ever!</p>
              <div className="soonnote">
                Email sign-up is coming soon. Until then, follow{' '}
                <a href={IG} target="_blank" rel="noopener noreferrer">@kanatani_toys</a> on Instagram for all the news.
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
