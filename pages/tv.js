import { useState } from 'react';
import Layout from '../components/Layout';
import { useLang } from '../lib/lang';
import { SHOWS, youtubeId } from '../lib/tv';

// Kanatani TV: a chunky retro telly that plays the things Penny and Hiro love
// (kaiju movies, Japanese classics, toy makers, inspiring people…) from YouTube. Shows are listed in lib/tv.js (newest first).
// The YouTube player only loads after a visitor presses play, so nothing
// from YouTube is fetched just by opening the page.

const MINI_COLOURS = ['var(--sky)', 'var(--green)', 'var(--orange)', 'var(--pink)', 'var(--gold)', 'var(--tardis)'];

// Kinds of show (optional `category` in lib/tv.js).
const CATS = {
  kaiju: ['Kaiju movies', '怪獣映画'],
  classic: ['Japanese classics', '日本の名作'],
  toymakers: ['Toy makers', 'トイメーカー'],
  inspiring: ['Inspiring people', '刺激をくれる人'],
  love: ['Things we love', '大好きなもの'],
};
function catLabel(c, t) {
  const v = CATS[c];
  return v ? t(v[0], v[1]) : c;
}

function fmtDate(d, lang) {
  try {
    return new Date(d + 'T12:00:00').toLocaleDateString(lang === 'ja' ? 'ja-JP' : 'en-GB', { day: 'numeric', month: 'long' });
  } catch (e) { return d; }
}

export default function KanataniTV() {
  const { t, lang } = useLang();
  const shows = SHOWS.filter(s => youtubeId(s.youtube));
  const [current, setCurrent] = useState(0);
  const [on, setOn] = useState(false);

  const show = shows[current] || null;
  const vid = show ? youtubeId(show.youtube) : null;
  const weekNo = show ? shows.length - current : 0;

  const flip = () => {
    if (shows.length < 2) return;
    setCurrent(c => (c + 1) % shows.length);
    setOn(false);
  };
  const pick = (i) => {
    setCurrent(i);
    setOn(false);
    if (typeof window !== 'undefined') {
      const el = document.getElementById('tv-set');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Layout
      title="Kanatani TV — Things we love"
      description="Our own little telly: kaiju movies, Japanese classics, toy makers, inspiring people and the things we love, picked by Penny and Hiro."
      path="/tv"
      active="tv"
      page="tv"
    >
      <section className="floor">
        <div className="wrap tv-wrap">
          <div className="tv-hd">
            <h1 className="big tv-title">Kanatani TV!</h1>
            <div className="tv-jp" lang="ja">かなたにテレビ</div>
            <p className="tv-sub">{t(
              'Grab a snack and pull up a cushion! Our own little telly, showing the things we love: kaiju movies, Japanese classics, toy makers, inspiring people and anything else we think you should see.',
              'おやつを用意して、クッションを持ってきてね!怪獣映画、日本の名作、トイメーカー、インスピレーションをくれる人たちなど、私たちが大好きなものをお届けする小さなテレビです。'
            )}</p>
          </div>

          <div className="tvzone" id="tv-set">
            <div className="ant" aria-hidden="true"><em /><i /><i /><b /><b /></div>
            <img className="tv-pinky" src="/nl/pink.png" alt="" />
            <div className="tvset">
              <div className="bezel">
                <div className="screen">
                  {on && vid ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                      title={show.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <div className="bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
                      <div className="scan" aria-hidden="true" />
                      <div className="glare" aria-hidden="true" />
                      <div className="onair">{show ? t('● ON AIR', '● 放送中') : t('● TEST CARD', '● テスト放送')}</div>
                      <div className="tcard">
                        {show ? (
                          <>
                            <div className="k" lang="ja">今週の番組</div>
                            <div className="t">{lang === 'ja' && show.title_ja ? show.title_ja : show.title}</div>
                            <button type="button" className="tvplay" onClick={() => setOn(true)} aria-label={t('Play this week’s show', '今週の番組を再生')} />
                          </>
                        ) : (
                          <>
                            <div className="k" lang="ja">まもなく放送</div>
                            <div className="t">{t('First show coming soon!', '第1回、まもなく放送!')}</div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="side">
                <div className="chan">CH {show ? weekNo : 0}</div>
                <button type="button" className="knob" onClick={flip} disabled={shows.length < 2} aria-label={t('Change channel', 'チャンネルを変える')} />
                <div className="lbl">{t('CHANNEL', 'チャンネル')}</div>
                <div className="knob k2" aria-hidden="true" />
                <div className="lbl">{t('VOLUME', 'ボリューム')}</div>
                <div className="grille" aria-hidden="true"><i /><i /><i /><i /></div>
              </div>
            </div>
            <div className="feet" aria-hidden="true"><i /><i /></div>
          </div>

          {show && (
            <div className="tv-ticket">
              <div className="when">{t('WEEK', '第')}<b>{weekNo}</b>{lang === 'ja' ? '週' : ''}</div>
              <div>
                {show.category && <span className="tv-cat">{catLabel(show.category, t)}</span>}
                <h3>{lang === 'ja' && show.title_ja ? show.title_ja : show.title}</h3>
                {(show.note || show.note_ja) && <p>{lang === 'ja' && show.note_ja ? show.note_ja : show.note}</p>}
                {show.date && <small>{t('On Kanatani TV from', '放送開始')} {fmtDate(show.date, lang)}</small>}
              </div>
            </div>
          )}

          {shows.length > 1 && (
            <div className="tv-past">
              <span className="plaque"><span className="mid">{t('Earlier on Kanatani TV', 'これまでの放送')}</span></span>
              <div className="minis">
                {shows.map((s, i) => i === current ? null : (
                  <button type="button" key={s.youtube + i} className="mini" onClick={() => pick(i)} style={{ '--c': MINI_COLOURS[i % MINI_COLOURS.length] }}>
                    <span className="mtv">
                      <span className="ms"><span>▶ {t('WEEK', '第')} {shows.length - i}{lang === 'ja' ? '週' : ''}</span></span>
                      <span className="mk" aria-hidden="true"><i /><i /></span>
                    </span>
                    {s.category && <span className="tv-cat">{catLabel(s.category, t)}</span>}
                    <span className="mname">{lang === 'ja' && s.title_ja ? s.title_ja : s.title}</span>
                    <small>{t('tap to watch', 'タップして見る')}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="tv-note">{t(
            'Shows play from official YouTube channels. The player only loads when you press play.',
            '番組は公式YouTubeチャンネルから再生されます。再生ボタンを押すまでプレーヤーは読み込まれません。'
          )}</p>
        </div>
      </section>
    </Layout>
  );
}
