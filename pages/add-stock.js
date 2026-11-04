// Private Add Stock page for Penny and Hiro (not in the menu, not indexed).
// Take a photo, cut the background off (done in the browser, the photo isn't
// sent anywhere else), fill in the details, and it goes straight into Square.
import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { TILL_ARTISTS, TILL_COLOURS, tillName } from '../lib/tillArtists';

const PASS_KEY = 'kt-add-stock-pass';
const CUTOUT_LIB = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1/+esm';

function loadImage(src) {
  return new Promise((ok, bad) => { const i = new Image(); i.onload = () => ok(i); i.onerror = bad; i.src = src; });
}

// Shrink a photo so it uploads quickly (long side max 1600px), white behind.
async function toJpeg(src, max = 1600) {
  const img = await loadImage(src);
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
  g.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', 0.88);
}

// Put a cut-out on a white square with a little space around it.
async function cutoutOnWhite(blob, size = 1400) {
  const url = URL.createObjectURL(blob);
  const img = await loadImage(url);
  const t = document.createElement('canvas');
  t.width = img.width; t.height = img.height;
  const tg = t.getContext('2d');
  tg.drawImage(img, 0, 0);
  const { data } = tg.getImageData(0, 0, t.width, t.height);
  let x0 = t.width, y0 = t.height, x1 = 0, y1 = 0;
  for (let y = 0; y < t.height; y++) for (let x = 0; x < t.width; x++) {
    if (data[(y * t.width + x) * 4 + 3] > 24) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  URL.revokeObjectURL(url);
  if (x1 <= x0 || y1 <= y0) throw new Error('Nothing found in the photo');
  const w = x1 - x0, h = y1 - y0;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, size, size);
  const s = (size * 0.86) / Math.max(w, h);
  g.drawImage(t, x0, y0, w, h, (size - w * s) / 2, (size - h * s) / 2, w * s, h * s);
  return c.toDataURL('image/jpeg', 0.9);
}

let cutoutFn = null;
async function getCutout() {
  if (cutoutFn) return cutoutFn;
  const load = new Function('u', 'return import(u)');
  const mod = await load(CUTOUT_LIB);
  cutoutFn = mod.removeBackground || mod.default;
  return cutoutFn;
}

const EMPTY = { name: '', price: '', quantity: '1', categoryId: '', description: '', online: true, artist: '' };
const NUMBERED = TILL_ARTISTS.map((n, i) => tillName(i, n));

export default function AddStock() {
  const [pass, setPass] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [cats, setCats] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const [original, setOriginal] = useState(null);
  const [cut, setCut] = useState(null);
  const [useCut, setUseCut] = useState(true);
  const [cutting, setCutting] = useState(false);
  const [cutErr, setCutErr] = useState(null);

  const [form, setForm] = useState(EMPTY);
  const [added, setAdded] = useState([]);
  const fileRef = useRef();
  const [btnBusy, setBtnBusy] = useState(false);
  const [btnMsg, setBtnMsg] = useState(null);

  async function makeButtons() {
    setBtnBusy(true); setBtnMsg(null);
    try {
      const buttons = TILL_ARTISTS.map((n, i) => ({ name: tillName(i, n), colour: TILL_COLOURS[i % TILL_COLOURS.length] }));
      const r = await fetch('/api/admin/artist-buttons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pass, buttons }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong');
      setBtnMsg({ text: d.made ? `Made ${d.made} artist buttons in Square${d.skipped ? ` (${d.skipped} were already there)` : ''}. They're in the “Artists” category on the till.` : 'All the artist buttons are already in Square.' });
    } catch (e) { setBtnMsg({ bad: true, text: e.message }); }
    finally { setBtnBusy(false); }
  }

  async function unlock(p) {
    setBusy(true); setMsg(null);
    try {
      const r = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: p }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Could not open');
      setCats(d.categories || []); setUnlocked(true);
      try { sessionStorage.setItem(PASS_KEY, p); } catch {}
    } catch (e) {
      setMsg({ bad: true, text: e.message });
      try { sessionStorage.removeItem(PASS_KEY); } catch {}
    } finally { setBusy(false); }
  }

  useEffect(() => {
    let p = null;
    try { p = sessionStorage.getItem(PASS_KEY); } catch {}
    if (p) { setPass(p); unlock(p); }
  }, []);

  async function onPhoto(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCut(null); setCutErr(null); setUseCut(true); setMsg(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const jpg = await toJpeg(reader.result);
      setOriginal(jpg);
      setCutting(true);
      try {
        const remove = await getCutout();
        const blob = await remove(jpg, { model: 'isnet_quint8', output: { format: 'image/png' } });
        setCut(await cutoutOnWhite(blob));
      } catch (err) {
        setCutErr('Couldn’t cut around this one, so the photo will be used as it is.');
        setUseCut(false);
      } finally { setCutting(false); }
    };
    reader.readAsDataURL(f);
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const image = useCut && cut ? cut : original;
    try {
      const r = await fetch('/api/admin/add-item', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, ...form, name: form.artist ? `${form.artist} – ${form.name}` : form.name, image }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Something went wrong');
      setAdded([{ name: d.name, img: image, notes: d.notes || [] }, ...added]);
      setMsg({ text: `Added “${d.name}” to Square.`, notes: d.notes });
      setForm({ ...EMPTY, categoryId: form.categoryId, artist: form.artist });
      setOriginal(null); setCut(null);
      if (fileRef.current) fileRef.current.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setMsg({ bad: true, text: err.message });
    } finally { setBusy(false); }
  }

  const shown = useCut && cut ? cut : original;

  return (
    <Layout title="Add stock — Kanatani Toys" path="/add-stock" noindex>
      <section className="floor textpage addstock">
        <div className="wrap">
          <div className="sheet">
            <span className="kicker">カナタニ · PRIVATE</span>
            <h1 className="big">Add stock</h1>

            {msg && (
              <div className={`as-msg${msg.bad ? ' bad' : ''}`}>
                {msg.text}
                {(msg.notes || []).map((n, i) => <div key={i} className="as-note">{n}</div>)}
              </div>
            )}

            {!unlocked ? (
              <form onSubmit={(e) => { e.preventDefault(); unlock(pass); }} className="as-form">
                <label>Password
                  <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="current-password" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
                </label>
                <button className="as-btn" disabled={busy || !pass}>{busy ? 'Checking…' : 'Open'}</button>
              </form>
            ) : (
              <form onSubmit={submit} className="as-form">
                <label className="as-photo">
                  <span>1. Photo</span>
                  <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onPhoto} />
                </label>

                {original && (
                  <div className="as-preview">
                    <img src={shown} alt="" />
                    {cutting && <div className="as-note">Cutting around it… (the first one takes a little longer)</div>}
                    {cutErr && <div className="as-note">{cutErr}</div>}
                    {cut && (
                      <div className="as-choice">
                        <button type="button" className={useCut ? 'on' : ''} onClick={() => setUseCut(true)}>Cut out</button>
                        <button type="button" className={!useCut ? 'on' : ''} onClick={() => setUseCut(false)}>Photo as it is</button>
                      </div>
                    )}
                  </div>
                )}

                <label>Artist (optional, puts their number in front of the name)
                  <select value={form.artist} onChange={set('artist')}>
                    <option value="">Not an artist piece</option>
                    {NUMBERED.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </label>
                <label>2. Name<input value={form.name} onChange={set('name')} required placeholder="e.g. PICOCO AFTERGLOW sofubi" /></label>
                <div className="as-row">
                  <label>Price (£)<input type="number" inputMode="decimal" step="0.01" min="0.01" value={form.price} onChange={set('price')} required /></label>
                  <label>How many<input type="number" inputMode="numeric" step="1" min="0" value={form.quantity} onChange={set('quantity')} required /></label>
                </div>
                <label>Category
                  <select value={form.categoryId} onChange={set('categoryId')}>
                    <option value="">No category</option>
                    {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
                <label>Description (optional)<textarea rows={3} value={form.description} onChange={set('description')} /></label>
                <label className="as-check"><input type="checkbox" checked={form.online} onChange={set('online')} /> Show it on the website too</label>

                <button className="as-btn" disabled={busy || cutting || !form.name || !form.price}>
                  {busy ? 'Adding…' : 'Add to Square'}
                </button>
              </form>
            )}

            {unlocked && (
              <div className="as-till">
                <h2>Artist buttons for the till</h2>
                <p>One button per artist, with their number. On the till, tap the artist and type the price. They don't show on the website.</p>
                <div className="as-tiles">
                  {TILL_ARTISTS.map((n, i) => (
                    <div key={n} className="as-tile" style={{ background: '#' + TILL_COLOURS[i % TILL_COLOURS.length] }}>
                      <span>{n}</span><b>{String(i + 1).padStart(2, '0')}</b>
                    </div>
                  ))}
                </div>
                {btnMsg && <div className={`as-msg${btnMsg.bad ? ' bad' : ''}`}>{btnMsg.text}</div>}
                <button type="button" className="as-btn" onClick={makeButtons} disabled={btnBusy}>{btnBusy ? 'Making…' : 'Make these buttons in Square'}</button>
              </div>
            )}

            {added.length > 0 && (
              <div className="as-added">
                <h2>Added this time</h2>
                {added.map((a, i) => (
                  <div key={i} className="as-item">{a.img && <img src={a.img} alt="" />}<span>{a.name}</span></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
