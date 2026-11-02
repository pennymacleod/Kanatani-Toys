import { useEffect } from 'react';

// Hiro's little green kaiju as the mouse pointer, leaving a short trail of
// colourful stars. Computers with a mouse only (not phones/iPads), and off for
// anyone who has turned off motion on their device. Styles: .kaiju-on and
// .ktrail in styles/additions.css. To switch it off, remove <KaijuCursor />
// from components/Layout.js.

const COLOURS = ['#FF1F8F', '#3FB7F0', '#F2B705', '#5BD34A', '#FF7417'];
const MAX = 14;      // most sparkles on screen at once
const GAP = 45;      // ms between sparkles

export default function KaijuCursor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add('kaiju-on');
    if (still) return () => root.classList.remove('kaiju-on');

    let last = 0;
    let n = 0;
    const onMove = (e) => {
      const now = performance.now();
      if (now - last < GAP) return;
      last = now;
      if (document.querySelectorAll('.ktrail').length >= MAX) return;
      const s = document.createElement('span');
      const star = n++ % 2 === 0;
      s.className = 'ktrail' + (star ? ' star' : ' dot');
      s.textContent = star ? '★' : '';
      s.style.left = e.clientX + 'px';
      s.style.top = (e.clientY + 18) + 'px';
      s.style.color = COLOURS[n % COLOURS.length];
      s.style.background = star ? 'transparent' : COLOURS[n % COLOURS.length];
      s.setAttribute('aria-hidden', 'true');
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 750);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      root.classList.remove('kaiju-on');
      document.querySelectorAll('.ktrail').forEach(el => el.remove());
    };
  }, []);
  return null;
}
