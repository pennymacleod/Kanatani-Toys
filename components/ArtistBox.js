import Link from 'next/link';

const COMING = 'Coming soon!'.split('');
const COMING_COLOURS = ['#FF1F8F', '#1FB6FF', '#FFD21F', '#5BD34A', '#FF7417'];

// How the name is split over lines in the coloured banner. Artists can have
// their own `banner` lines in lib/artists.js; otherwise the part before " · "
// is used and long names are broken between words (never mid-word).
function bannerLines(artist) {
  if (artist.banner?.length) return artist.banner;
  const out = [];
  artist.name.split(' · ').forEach(part => {
    let cur = '';
    part.split(' ').forEach(w => {
      if (cur && (cur + ' ' + w).length > 12) { out.push(cur); cur = w; }
      else cur = cur ? `${cur} ${w}` : w;
    });
    if (cur) out.push(cur);
  });
  if (out.length <= 3) return out;
  return [...out.slice(0, 2), out.slice(2).join(' ')];
}

export default function ArtistBox({ artist, soon = false }) {
  const lines = bannerLines(artist);
  const longest = Math.max(...lines.map(l => l.length));
  const inner = (
    <>
      <div className="atop" style={{ background: artist.colour }}>
        <span className="av"><img src={artist.logo} alt={`${artist.name} logo`} loading="lazy" /></span>
        <div className="aname">
          <div className="an" aria-label={artist.name} style={{ '--len': longest }}>
            {lines.map((l, i) => <span key={i} className="anl" aria-hidden="true">{l}</span>)}
          </div>
          {artist.country && <span className="flag">★ {artist.country.toUpperCase()}</span>}
        </div>
      </div>
      <div className="burst">
        {artist.figure && <img className="fig" src={artist.figure} alt="" loading="lazy" />}
        {soon ? (
          <span className="soonb">
            {COMING.map((c, i) => (
              <span key={i} style={{ color: c === ' ' ? undefined : COMING_COLOURS[i % COMING_COLOURS.length] }}>{c}</span>
            ))}
          </span>
        ) : (
          <span className="see">See their work →</span>
        )}
      </div>
    </>
  );

  if (soon) return <div className="abox nb soon">{inner}</div>;
  return <Link className="abox nb" href={`/artist/${artist.slug}`}>{inner}</Link>;
}
