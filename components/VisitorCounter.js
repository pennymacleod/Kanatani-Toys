import { useEffect, useState } from 'react';
import { useLang } from '../lib/lang';

// Old-school hit counter for the bottom of the homepage.
// Counts each visitor once per browser session (refreshing doesn't add more),
// then shows their number. Hides itself if the counter store isn't set up.

const SEEN = 'kt-counted';

export default function VisitorCounter() {
  const { t } = useLang();
  const [count, setCount] = useState(null);

  useEffect(() => {
    let seen = false;
    try { seen = window.sessionStorage.getItem(SEEN) === '1'; } catch (e) {}
    fetch('/api/visits', { method: seen ? 'GET' : 'POST' })
      .then(r => r.json())
      .then(j => {
        if (j && j.count) {
          setCount(j.count);
          if (!seen) { try { window.sessionStorage.setItem(SEEN, '1'); } catch (e) {} }
        }
      })
      .catch(() => {});
  }, []);

  if (!count) return null;
  const digits = String(count).padStart(6, '0').split('');

  return (
    <div className="hitc floor">
      <div className="hitbox" role="status" aria-label={t(`You are visitor number ${count}`, `あなたは${count}番目のお客さま`)}>
        <div className="bolts" aria-hidden="true"><i /><i /><i /><i /></div>
        <img className="hitpk" src="/nl/pink.png" alt="" />
        <div className="hitlab">{t('YOU ARE VISITOR NO.', 'あなたは何番目?')}<small lang="ja">あなたは何番目のお客さま?</small></div>
        <div className="hitdigits" aria-hidden="true">
          {digits.map((d, i) => <span key={i} className={'hd' + (i === digits.length - 1 ? ' lit' : '')}>{d}</span>)}
        </div>
        <div className="hitthx">{t('Thanks for popping in!', '来てくれてありがとう!')} <b>★</b></div>
      </div>
    </div>
  );
}
