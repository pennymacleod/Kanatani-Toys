import { useState, useEffect } from 'react';
import Layout, { SOCIALS } from '../components/Layout';
import Medallion from '../components/Medallion';
import Reviews from '../components/Reviews';
import { HOURS, hoursFor, isOpenNow, nextOpenSunday, shopTime } from '../lib/shop';
import { useLang } from '../lib/lang';

const DAY_JA = { Monday: '月曜日', Tuesday: '火曜日', Wednesday: '水曜日', Thursday: '木曜日', Friday: '金曜日', Saturday: '土曜日', Sunday: '日曜日' };

const MAPS = 'https://www.google.com/maps/search/?api=1&query=Kanatani+Toys+Open+Market+Marshalls+Row+Brighton+BN1+4JU';
const DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&destination=Open+Market+Marshalls+Row+Brighton+BN1+4JU';

const short = (t) => {
  const [h, m] = t.split(':').map(Number);
  const hh = h > 12 ? h - 12 : h;
  return m ? `${hh}.${String(m).padStart(2, '0')}` : `${hh}`;
};

export default function FindUs() {
  // Date-dependent bits are worked out in the browser, so a cached page never
  // shows a stale "open now".
  const [now, setNow] = useState(null);
  const { lang, t } = useLang();
  useEffect(() => { setNow(shopTime()); }, []);
  const open = now ? isOpenNow(now) : false;
  const todayName = now ? HOURS[now.getDay() === 0 ? 6 : now.getDay() - 1].day : null;
  const nextSunday = now
    ? nextOpenSunday(now).toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-GB', lang === 'ja' ? { month: 'long', day: 'numeric', weekday: 'short' } : { weekday: 'long', day: 'numeric', month: 'long' })
    : null;
  const today = now ? hoursFor(now) : null;

  return (
    <Layout
      title="Find Us — Kanatani Toys, Brighton"
      description="Find Kanatani Toys at Open Market, Unit 7, Marshalls Row, Brighton, BN1 4JU. Opening hours, directions and what people say about us."
      path="/about"
      active="findus"
      page="findus"
    >
      <section className="floor">
        <div className="wrap">
          <div className="fu-title">
            <span className="kicker">カナタニ · BRIGHTON</span>
            <h1 className="big" style={{ fontSize: 96, margin: '18px 0 10px', color: 'var(--pink)' }}>{lang === 'ja' ? <>アク<span style={{ color: 'var(--sky)' }}>セス！</span></> : <>Find <span style={{ color: 'var(--sky)' }}>us!</span></>}</h1>
            <p style={{ fontSize: 21, fontWeight: 600, margin: 0 }}>{t('Come and meet the strange toys in person.', 'ストレンジなおもちゃたちに、会いに来てね。')}</p>
            {now && (
              <span className={`openbadge ${open ? 'yes' : 'no'}`}>
                {open ? (lang === 'ja' ? `● 営業中 · ${short(today.close)}時まで` : `● Open now · until ${short(today.close)}`) : t('● Closed right now', '● ただいま閉店中')}
              </span>
            )}
          </div>
          <div className="fu-grid">
            <div className="panel">
              <h3 style={{ background: 'var(--tardis)' }}>{t('UNIT 7, OPEN MARKET', 'オープンマーケット UNIT 7')}</h3>
              <a className="map mapl" href={MAPS} target="_blank" rel="noopener noreferrer" aria-label="Open in Google Maps" style={{ position: 'relative' }}>
                <svg viewBox="0 0 640 430" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="640" height="430" fill="#EAF4EF" />
                  <g fill="#D9E9E1">
                    <rect x="20" y="20" width="170" height="120" rx="8" /><rect x="230" y="20" width="160" height="120" rx="8" /><rect x="430" y="20" width="190" height="120" rx="8" />
                    <rect x="20" y="190" width="170" height="220" rx="8" /><rect x="430" y="190" width="190" height="220" rx="8" />
                  </g>
                  <rect x="230" y="190" width="160" height="220" rx="10" fill="#FFE38A" stroke="#141018" strokeWidth="4" />
                  <text x="310" y="305" textAnchor="middle" fontFamily="Rubik, Inter, system-ui, sans-serif" fontWeight="900" fontSize="20" fill="#141018">OPEN MARKET</text>
                  <g stroke="#fff" strokeWidth="26"><path d="M0 165 H640" /><path d="M210 0 V430" /><path d="M410 0 V430" /></g>
                  <text x="520" y="171" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#6B7B74">Marshalls Row</text>
                  <text x="204" y="300" textAnchor="middle" fontFamily="Inter" fontWeight="700" fontSize="14" fill="#6B7B74" transform="rotate(-90 204 300)">Ditchling Rd</text>
                  <g transform="translate(310 230)">
                    <path d="M0 0 C-30 -40 -42 -60 -42 -82 A42 42 0 1 1 42 -82 C42 -60 30 -40 0 0Z" fill="#FF1F8F" stroke="#141018" strokeWidth="5" />
                    {/* Head pops out of the top of the circle so his horn shows */}
                    <clipPath id="pinc"><circle cx="0" cy="-84" r="24" /><rect x="-40" y="-170" width="80" height="86" /></clipPath>
                    <circle cx="0" cy="-84" r="26" fill="#fff" stroke="#141018" strokeWidth="4" />
                    <image href="/nl/pink_head_bold.png" x="-36" y="-142" width="72" height="77" clipPath="url(#pinc)" preserveAspectRatio="xMidYMid meet" />
                  </g>
                </svg>
                <span className="opn">{t('Open in Google Maps ↗', 'Googleマップで開く ↗')}</span>
              </a>
              <div style={{ padding: '18px 24px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between', borderTop: '5px solid #141018' }}>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>Marshalls Row, Brighton<br />BN1 4JU</div>
                <a className="btn" href={DIRECTIONS} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--pink)', fontSize: 19 }}>{t('Get directions →', '行き方を見る →')}</a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
              <div className="panel">
                <h3 style={{ background: 'var(--pink)' }}>{t('OPENING HOURS', '営業時間')}</h3>
                <ul className="hours">
                  {HOURS.map(h => (
                    <li key={h.day} className={todayName === h.day ? 'today' : undefined}>
                      {t(h.day, DAY_JA[h.day])}
                      {!h.open ? (
                        <span className="pill closed">{t('Closed', '定休日')}</span>
                      ) : h.alternate ? (
                        <span className="pill sun">{short(h.open)} – {short(h.close)} · {t('every other week', '隔週')}</span>
                      ) : (
                        <span className="pill">{short(h.open)} – {short(h.close)}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {nextSunday && (
                  <p style={{ margin: 0, padding: '0 24px 20px', fontWeight: 700 }}>{t('Next open Sunday:', '次の営業日曜日：')} {nextSunday}</p>
                )}
              </div>
              <div className="counter hello" style={{ padding: '26px 30px', gap: 22 }}>
                <Medallion size={70} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 800, letterSpacing: '.2em', color: 'var(--gold)', fontSize: 14 }}>{t('SAY HELLO', 'お問い合わせ')}</div>
                  <a className="mid hello-email" href="mailto:kanatanitoys@gmail.com" style={{ display: 'block', color: '#fff', marginTop: 6 }}>kanatanitoys@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Reviews />

        <div className="wrap">
          <div className="socials">
            {SOCIALS.map(s => (
              <a key={s.name} className="soc" href={s.href} target="_blank" rel="noopener noreferrer" style={{ background: s.bg }}>
                <span className="wlet" style={{ fontSize: 22 }}>{s.name}</span>
                <small>{s.handle}</small>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
