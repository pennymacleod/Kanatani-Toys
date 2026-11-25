// Free WhatsApp sticker pack for Kanatani News subscribers (Nov 2026).
// Linked from the MailerLite welcome email. Not in the nav, noindex, robots-disallowed.
// No sticker app needed (Penny, 22 Nov 2026: Sticker.ly wasn't free): people save the
// pictures and make them into stickers with WhatsApp's own "Create sticker".
import Layout from '../components/Layout';

const STICKERS = [
  { file: '01-no-toy-no-life', name: 'No Toy No Life' },
  { file: '02-want', name: 'WANT!!' },
  { file: '03-death-metal', name: 'No Toy No Life デスメタル' },
];

export default function Stickers() {
  return (
    <Layout title="Your free stickers — Kanatani Toys" description="Free Kanatani Toys WhatsApp stickers for Kanatani News subscribers." path="/stickers" page="stickers" noindex>
      <section className="floor textpage">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <h1 className="big" style={{ color: 'var(--pink)' }}>YOU WON!</h1>
          <p style={{ fontWeight: 700 }}>Thanks for joining Kanatani News. Here are your free Kanatani Toys WhatsApp stickers. Go and annoy all your friends!</p>
          <div className="stk-grid">
            {STICKERS.map(s => (
              <div className="stk" key={s.file}>
                <img src={`/stickers/${s.file}.png`} alt={s.name} />
                <div><a href={`/stickers/${s.file}.png`} download>Save {s.name}</a></div>
              </div>
            ))}
          </div>
          <p><a className="btn" href="/stickers/Kanatani-Toys-Stickers.zip" download style={{ background: 'var(--sky)', color: '#141018' }}>Download all three (zip)</a></p>
          <h2 className="mid" style={{ marginTop: 28, color: '#fff' }}>How to add them to WhatsApp</h2>
          <p>No extra app needed.</p>
          <ol style={{ textAlign: 'left', display: 'inline-block' }}>
            <li>Save each sticker to your photos (on a phone, press and hold the picture, then tap <b>Save</b>).</li>
            <li>Open any chat in WhatsApp and tap the <b>sticker</b> button.</li>
            <li>Tap <b>Create</b> (the <b>+</b>), pick the sticker from your photos and tap <b>Send</b>.</li>
            <li>Press and hold it in the chat and tap <b>Add to favourites</b>, so it's always there to annoy people with.</li>
          </ol>
        </div>
      </section>
    </Layout>
  );
}
