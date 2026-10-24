// The Hero Capsule platform game engine (plain JS, no React), used by
// pages/hero-capsule.js. Jump the buildings, then punch the monster until K.O.
// Events go out through `on(type, game)`: 'jump' 'bump' 'lost' 'boss' 'punch' 'ko' 'won'.
export const W = 560, H = 420, GROUND = 360, PH = 84;
export const BUILDINGS = 6, BOSS_HP = 5, HEARTS = 3;
export const HEROES = [
  { key: 'yeti', name: ['Pink Yeti', 'ピンクイエティ'], src: '/nl/game/yeti.png' },
  { key: 'fuzz', name: ['Orange Fuzz', 'オレンジファズ'], src: '/nl/game/fuzz.png' },
];
export const BOSSES = [
  { name: ['Big Green Kaiju', 'ビッグ・グリーン怪獣'], src: '/nl/game/boss-kaiju.png', h: 150, w: 188 },
  { name: ['Drooly Dog', 'よだれ犬'], src: '/nl/game/boss-dog.png', h: 130, w: 213 },
  { name: ['Cube Head', 'キューブヘッド'], src: '/nl/game/boss-cube.png', h: 160, w: 101 },
];

const stopX = (g) => W - BOSSES[g.boss].w - 24;

export function loadImages() {
  const load = (src) => { const i = new Image(); i.src = src; return i; };
  return { heroes: HEROES.map(h => load(h.src)), bosses: BOSSES.map(b => load(b.src)) };
}

export function newGame(hero, rnd = Math.random) {
  const bs = [];
  let x = 520;
  for (let i = 0; i < BUILDINGS; i++) { const w = 44 + rnd() * 26; bs.push({ x, w, h: 36 + rnd() * 40 }); x += 230 + rnd() * 120; }
  return { hero, boss: Math.floor(rnd() * BOSSES.length), px: 90, py: GROUND - PH, vy: 0, onGround: true, speed: 4.2, bs,
    finishX: x + 60, hearts: HEARTS, hurt: 0, bx: W + 40, hp: BOSS_HP, punch: 0, pows: [], koT: 0, t: 0, phase: 'run' };
}

// A tap / space bar: jump while running, punch at the monster.
export function act(g, on) {
  if (g.phase === 'run' && g.onGround) { g.vy = -13; g.onGround = false; on('jump', g); }
  else if (g.phase === 'boss' && g.punch <= 0 && g.bx <= stopX(g) + 6) {
    g.punch = 14; g.hp -= 1;
    g.pows.push({ x: g.bx - 10 + Math.random() * 30, y: GROUND - 110 + Math.random() * 30, life: 26, word: ['POW!', 'BAM!', 'WHAM!', 'BOP!'][Math.floor(Math.random() * 4)] });
    on('punch', g);
    if (g.hp <= 0) { g.phase = 'ko'; g.koT = 0; on('ko', g); }
  }
}

export function tick(g, on) {
  g.t++;
  g.vy += 0.6; g.py += g.vy;
  if (g.py >= GROUND - PH) { g.py = GROUND - PH; g.vy = 0; g.onGround = true; }
  if (g.phase === 'run') {
    g.bs.forEach(b => { b.x -= g.speed; });
    g.finishX -= g.speed;
    if (g.hurt > 0) g.hurt--;
    for (const b of g.bs) {
      if (b.hit) continue;
      if (g.px + 34 > b.x && g.px + 8 < b.x + b.w && g.py + PH - 6 > GROUND - b.h && g.hurt === 0) {
        b.hit = true; g.hurt = 50; g.hearts--; on('bump', g);
        if (g.hearts <= 0) { g.phase = 'lost'; on('lost', g); return; }
      }
    }
    if (g.finishX < W - 40) { g.phase = 'boss'; on('boss', g); }
  }
  if (g.phase === 'boss' || g.phase === 'ko') {
    if (g.bx > stopX(g)) g.bx = Math.max(stopX(g), g.bx - 5);
    if (g.px < stopX(g) - 90) g.px = Math.min(stopX(g) - 90, g.px + 3);
    if (g.punch > 0) g.punch--;
  }
  if (g.phase === 'ko') { g.koT++; if (g.koT > 110) { g.phase = 'won'; on('won', g); } }
}

function star(ctx, x, y, r, col) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = '#141018'; ctx.lineWidth = 2; ctx.stroke();
}
function burst(ctx, x, y, r, col) {
  ctx.beginPath();
  for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, rr = i % 2 ? r * 0.62 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = '#141018'; ctx.lineWidth = 4; ctx.stroke();
}
function word(ctx, s, x, y, size) {
  ctx.font = `${Math.max(1, size)}px "Bagel Fat One", Rubik, sans-serif`; ctx.textAlign = 'center';
  ctx.lineJoin = 'round'; ctx.lineWidth = 6; ctx.strokeStyle = '#141018'; ctx.strokeText(s, x, y); ctx.fillStyle = '#fff'; ctx.fillText(s, x, y);
}

export function draw(ctx, g, I) {
  const run = g.phase === 'run';
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, run ? '#1A3FA6' : '#2a1650'); sky.addColorStop(0.6, run ? '#3a2a8c' : '#6b1a4a'); sky.addColorStop(1, '#FF1F8F');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < 40; i++) { const x = (((i * 97) - (run ? g.t * 0.5 : 0)) % W + W) % W; ctx.fillRect(x, (i * 53) % 220, 2, 2); }
  ctx.fillStyle = 'rgba(20,16,24,.42)';
  for (let i = 0; i < 12; i++) { const x = ((i * 70 - (run ? g.t * 1.2 : 0)) % (W + 70) + W + 70) % (W + 70) - 70; ctx.fillRect(x, GROUND - 60 - (i * 37) % 70, 54, 200); }
  ctx.fillStyle = '#141018'; ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = '#F2B705';
  for (let x = -((run ? g.t * g.speed : 0) % 40); x < W; x += 40) ctx.fillRect(x, GROUND + 26, 22, 5);
  g.bs.forEach(b => {
    if (b.x > W || b.x + b.w < 0) return;
    ctx.fillStyle = b.hit ? '#6b6b6b' : '#D8352A'; ctx.strokeStyle = '#141018'; ctx.lineWidth = 4;
    ctx.fillRect(b.x, GROUND - b.h, b.w, b.h); ctx.strokeRect(b.x, GROUND - b.h, b.w, b.h);
    ctx.fillStyle = '#F2B705';
    for (let y = GROUND - b.h + 10; y < GROUND - 12; y += 16) for (let x = b.x + 8; x < b.x + b.w - 10; x += 14) ctx.fillRect(x, y, 6, 7);
  });
  if (!run) {
    const B = BOSSES[g.boss], bi = I.bosses[g.boss];
    if (bi.complete && bi.naturalWidth) {
      const bh = B.h, bw = bi.naturalWidth * bh / bi.naturalHeight;
      ctx.save();
      if (g.phase === 'ko' || g.phase === 'won') {
        // falls over backwards and lands flat, still on screen
        const k = Math.min(1, g.koT / 25), a = k * (Math.PI / 2);
        const pivot = (g.bx + bw * 0.9) * (1 - k) + (W - bh - 12) * k;
        ctx.translate(pivot, GROUND); ctx.rotate(a); ctx.drawImage(bi, -bw * 0.9, -bh, bw, bh);
      } else { ctx.translate(g.bx + (g.punch > 8 ? (Math.random() - 0.5) * 12 : 0), GROUND - bh); ctx.drawImage(bi, 0, 0, bw, bh); }
      ctx.restore();
      if (g.phase === 'boss') {
        ctx.fillStyle = '#141018'; ctx.fillRect(g.bx, GROUND - bh - 26, 104, 14);
        ctx.fillStyle = '#5BD34A'; ctx.fillRect(g.bx + 2, GROUND - bh - 24, 100 * g.hp / BOSS_HP, 10);
      }
      if ((g.phase === 'ko' || g.phase === 'won') && g.koT > 20) {
        const cx = W - bh * 0.5 - 12, cy = GROUND - 40;
        for (let i = 0; i < 5; i++) { const a = g.koT * 0.12 + i * (Math.PI * 2 / 5); star(ctx, cx + Math.cos(a) * 46, cy - 30 + Math.sin(a) * 14, 10, ['#F2B705', '#FF1F8F', '#3FB7F0', '#5BD34A', '#fff'][i]); }
      }
    }
  }
  const hi = I.heroes[g.hero];
  if (hi.complete && hi.naturalWidth && !(g.hurt > 0 && Math.floor(g.hurt / 5) % 2)) {
    const pw = hi.naturalWidth * PH / hi.naturalHeight;
    const lunge = g.punch > 0 ? Math.sin((14 - g.punch) / 14 * Math.PI) * 40 : 0;
    ctx.drawImage(hi, g.px + lunge, g.py, pw, PH);
    if (g.punch > 0) {
      ctx.fillStyle = '#FFF4D6'; ctx.strokeStyle = '#141018'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(g.px + pw + lunge + 6, g.py + PH * 0.45, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
  }
  g.pows = g.pows.filter(p => p.life-- > 0);
  g.pows.forEach(p => { burst(ctx, p.x, p.y, 34 + (26 - p.life), '#F2B705'); word(ctx, p.word, p.x, p.y + 7, 22); });
  if (g.phase === 'ko' || g.phase === 'won') {
    const s = Math.min(1, g.koT / 12);
    ctx.save(); ctx.translate(W / 2, 150); ctx.rotate(g.koT * 0.02);
    for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.5)' : 'rgba(242,183,5,.5)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-18, -260); ctx.lineTo(18, -260); ctx.fill(); }
    ctx.restore();
    burst(ctx, W / 2, 150, 110 * s, '#FF1F8F');
    word(ctx, 'K.O.!', W / 2, 172, 64 * s);
    for (let i = 0; i < 8; i++) { const a = g.koT * 0.05 + i * Math.PI / 4; star(ctx, W / 2 + Math.cos(a) * 150, 150 + Math.sin(a) * 90, 12, '#fff'); }
  }
}
