import { useEffect, useRef, useState } from 'react';
import styles from '../styles/About.module.css';

function TikTokEmbed({ username }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    containerRef.current?.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className={styles.feedEmbedInner}>
      <blockquote
        className="tiktok-embed"
        cite={`https://www.tiktok.com/@${username}`}
        data-unique-id={username}
        data-embed-type="creator"
        style={{ maxWidth: 340, minWidth: 288, margin: '0 auto' }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={`https://www.tiktok.com/@${username}?refer=creator_embed`}>
            @{username}
          </a>
        </section>
      </blockquote>
    </div>
  );
}

function FacebookEmbed() {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      <iframe
        title="Kanatani Toys Facebook page"
        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent('https://www.facebook.com/profile.php?id=61579078334008')}&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`}
        width="340"
        height="500"
        style={{ border: 'none', overflow: 'hidden', maxWidth: '100%' }}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
      {showHint && (
        <p className={styles.feedNote}>
          Feed not loading? Some browsers block Facebook&apos;s embed cookies by default — use the button below to view it directly.
        </p>
      )}
    </div>
  );
}

function YouTubeEmbed() {
  const [state, setState] = useState({ loading: true, videoId: null });

  useEffect(() => {
    fetch('/api/youtube-latest')
      .then(r => r.json())
      .then(data => setState({ loading: false, videoId: data.videoId }))
      .catch(() => setState({ loading: false, videoId: null }));
  }, []);

  if (state.loading) {
    return <p className={styles.feedNote}>Loading latest video…</p>;
  }

  if (!state.videoId) {
    return <p className={styles.feedNote}>No videos posted yet — check back soon, or subscribe to get notified as soon as we do.</p>;
  }

  return (
    <iframe
      title="Kanatani Toys latest YouTube video"
      width="340"
      height="191"
      style={{ maxWidth: '100%' }}
      src={`https://www.youtube.com/embed/${state.videoId}`}
      frameBorder="0"
      allow="accelerate; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

const PLATFORMS = [
  {
    id: 'instagram',
    label: 'Instagram',
    emoji: '📸',
    href: 'https://www.instagram.com/kanatani_toys',
    handle: '@kanatani_toys',
    note: "Instagram doesn't allow live post feeds to be embedded without a connected business account, so here's a direct link instead.",
    renderEmbed: () => null,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    emoji: '🎵',
    href: 'https://www.tiktok.com/@kanatani.toys',
    handle: '@kanatani.toys',
    renderEmbed: () => <TikTokEmbed username="kanatani.toys" />,
  },
  {
    id: 'facebook',
    label: 'Facebook',
    emoji: '👍',
    href: 'https://www.facebook.com/share/1EYfzmmyZi/',
    handle: 'Kanatani Toys',
    renderEmbed: () => <FacebookEmbed />,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    emoji: '▶️',
    href: 'https://www.youtube.com/@KANATANITOYS-g6q',
    handle: '@KANATANITOYS-g6q',
    renderEmbed: () => <YouTubeEmbed />,
  },
];

function FeedCard({ platform }) {
  const [expanded, setExpanded] = useState(false);
  const embed = expanded ? platform.renderEmbed() : null;

  return (
    <div className={styles.feedCard}>
      <button
        type="button"
        className={styles.feedToggle}
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        <span className={styles.feedToggleEmoji}>{platform.emoji}</span>
        <span className={styles.feedToggleLabel}>{platform.label}</span>
        <span className={styles.feedToggleHandle}>{platform.handle}</span>
        <span className={styles.feedToggleIcon}>{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className={styles.feedPanel}>
          {platform.note && <p className={styles.feedNote}>{platform.note}</p>}
          {embed && <div className={styles.feedEmbed}>{embed}</div>}
          <a
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.feedCta}
          >
            Open {platform.label} ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function SocialFeeds() {
  return (
    <div className={styles.feedGrid}>
      {PLATFORMS.map(p => (
        <FeedCard key={p.id} platform={p} />
      ))}
    </div>
  );
}
