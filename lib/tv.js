// Kanatani TV: the shows on the /tv page (kaiju movies, Japanese classics,
// toy makers, inspiring people and things we love).
//
// To add a new show, put it at the TOP of the list (newest first). The top one
// plays on the big TV; the rest appear under "Earlier on Kanatani TV".
//
//   {
//     date: '2026-11-09',                       // the week it went up
//     youtube: 'https://www.youtube.com/watch?v=XXXXXXXXXXX', // any YouTube link
//     title: 'Ultraman, episode 1',
//     title_ja: 'ウルトラマン 第1話',             // optional
//     category: 'kaiju',   // optional: kaiju · classic · toymakers · inspiring · love
//     note: 'A line from Penny about why it’s a favourite.',  // optional
//     note_ja: '',                              // optional
//   },
//
// Only use videos from official channels (e.g. the studio's own YouTube
// channel), never fan re-uploads, and only ones the owner allows to be embedded.

export const SHOWS = [
  // First show coming soon: Penny is picking one.
];

// Pull the 11-character video id out of any normal YouTube link
// (watch?v=…, youtu.be/…, /shorts/…, /embed/…, /live/…) or a bare id.
export function youtubeId(link) {
  if (!link) return null;
  const s = String(link).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
