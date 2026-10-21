import Link from 'next/link';

const COMING = 'Coming soon!'.split('');
const COMING_COLOURS = ['#FF1F8F', '#1FB6FF', '#FFD21F', '#5BD34A', '#FF7417'];

export default function ArtistBox({ artist, soon = false }) {
  const inner = (
    <>
      <div className="atop" style={{ background: artist.colour }}>
        <span className="av"><img src={artist.logo} alt={`${artist.name} logo`} loading="lazy" /></span>
        <div className="aname">
          <div className="an">{artist.name}</div>
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
