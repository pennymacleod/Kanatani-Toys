// Kaiju Gachapon sound effects, made live in the browser with the Web Audio API.
// No audio files: every sound is synthesised here, so there is nothing to license.
// Sounds only ever play after the visitor taps something (browsers require that).

let ctx = null;
let master = null;

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function noiseBuffer(c, seconds) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function env(g, t, peak, attack, decay) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function click(c, t, freq, vol = 0.5, len = 0.03) {
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, len + 0.02);
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = 6;
  const g = c.createGain();
  env(g, t, vol, 0.002, len);
  src.connect(bp).connect(g).connect(master);
  src.start(t); src.stop(t + len + 0.03);
}

function tone(c, t, freq, len, { type = 'square', vol = 0.18, slideTo = null, attack = 0.005 } = {}) {
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + len);
  const g = c.createGain();
  env(g, t, vol, attack, len);
  o.connect(g).connect(master);
  o.start(t); o.stop(t + attack + len + 0.05);
}

const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);

export const sounds = {
  // Ratchet clicks as the handle goes round, then capsules tumbling inside.
  crank() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    for (let i = 0; i < 8; i++) click(c, t + i * 0.085, 2600 + (i % 2) * 500, 0.55, 0.025);
    for (let i = 0; i < 14; i++) {
      const at = t + 0.25 + Math.random() * 0.6;
      click(c, at, 900 + Math.random() * 1800, 0.25 + Math.random() * 0.2, 0.04);
    }
  },

  // The capsule lands in the tray with a plastic thunk and two little bounces.
  drop() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    [0, 0.16, 0.26].forEach((d, i) => {
      const v = [0.7, 0.3, 0.12][i];
      tone(c, t + d, 190, 0.12, { type: 'sine', vol: v, slideTo: 70 });
      click(c, t + d, 1400, v * 0.6, 0.03);
    });
  },

  // Twisting the capsule open: a squeaky twist, then a pop.
  pop() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    tone(c, t, 500, 0.12, { type: 'triangle', vol: 0.08, slideTo: 700 });
    click(c, t + 0.13, 1800, 0.8, 0.05);
    tone(c, t + 0.13, 300, 0.18, { type: 'sine', vol: 0.35, slideTo: 1100 });
  },

  // Card reveal for a regular kaiju: a quick chiptune "ta-da".
  common() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    [72, 76, 79, 84].forEach((n, i) => tone(c, t + i * 0.08, NOTE(n), 0.12));
  },

  // RARE: a longer arpeggio with sparkles on top.
  rare() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    [72, 76, 79, 83, 84, 88].forEach((n, i) => tone(c, t + i * 0.07, NOTE(n), 0.14));
    for (let i = 0; i < 6; i++) tone(c, t + 0.45 + i * 0.05, NOTE(96 + (i % 3) * 3), 0.08, { type: 'triangle', vol: 0.1 });
  },

  // SUPER RARE: a monster roar, then a fanfare.
  superRare() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    const len = 1.1;
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(110, t);
    o.frequency.linearRampToValueAtTime(150, t + 0.35);
    o.frequency.linearRampToValueAtTime(70, t + len);
    const wobble = c.createOscillator(); wobble.frequency.value = 28;
    const wobbleAmt = c.createGain(); wobbleAmt.gain.value = 18;
    wobble.connect(wobbleAmt).connect(o.frequency);
    const n = c.createBufferSource(); n.buffer = noiseBuffer(c, len);
    const lp = c.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(1800, t + 0.3); lp.frequency.linearRampToValueAtTime(400, t + len);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    const ng = c.createGain(); ng.gain.value = 0.35;
    o.connect(lp); n.connect(ng).connect(lp); lp.connect(g).connect(master);
    o.start(t); wobble.start(t); n.start(t);
    o.stop(t + len); wobble.stop(t + len); n.stop(t + len);
    const f = t + len + 0.05;
    [[67, 0.12], [67, 0.12], [67, 0.12], [72, 0.5]].forEach(([m, d], i) => {
      tone(c, f + i * 0.13, NOTE(m), d, { vol: 0.16 });
      tone(c, f + i * 0.13, NOTE(m - 12), d, { type: 'triangle', vol: 0.12 });
    });
  },

  // All ten collected: a victory jingle.
  complete() {
    const c = audio(); if (!c) return;
    const t = c.currentTime;
    const tune = [[72, 0.1], [72, 0.1], [72, 0.1], [72, 0.3], [68, 0.3], [70, 0.3], [72, 0.15], [70, 0.1], [72, 0.6]];
    let at = t;
    tune.forEach(([m, d]) => { tone(c, at, NOTE(m), d, { vol: 0.16 }); tone(c, at, NOTE(m - 24), d, { type: 'triangle', vol: 0.14 }); at += d + 0.03; });
  },
};

export function revealSound(rarity) {
  if (rarity === 'SUPER RARE') return sounds.superRare();
  if (rarity === 'RARE') return sounds.rare();
  return sounds.common();
}
