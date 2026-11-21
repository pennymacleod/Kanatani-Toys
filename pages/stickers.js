// Free WhatsApp sticker pack for Kanatani News subscribers (Nov 2026).
// Linked from the MailerLite welcome email. Not in the nav, noindex, robots-disallowed.
// When Penny has made the pack in Sticker.ly, put its share link in STICKERLY.
import Layout from '../components/Layout';

const STICKERLY = ''; // e.g. 'https://sticker.ly/s/XXXXXX'
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
          {STICKERLY && (
            <p><a className="btn" href={STICKERLY} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--pink)', color: '#fff' }}>Add them to WhatsApp →</a></p>
          )}
          <div className="stk-grid">
            {STICKERS.map(s => (
              <div className="stk" key={s.file}>
                <img src={`/stickers/${s.file}.png`} alt={s.name} />
                <div><a href={`/stickers/${s.file}.png`} download>Save {s.name}</a></div>
              </div>
            ))}
          </div>
          <p><a className="btn" href="/stickers/Kanatani-Toys-Stickers.zip" download style={{ background: 'var(--sky)', color: '#141018' }}>Download the whole pack (zip)</a></p>
          <h2 className="mid" style={{ marginTop: 28 }}>How to add them to WhatsApp</h2>
          <ol>
            {STICKERLY
              ? <li>Tap <b>Add them to WhatsApp</b> above, then tap <b>Add to WhatsApp</b> in the Sticker.ly app.</li>
              : <>
                  <li>Save the stickers to your phone.</li>
                  <li>Get a free sticker app, like <b>Sticker.ly</b> or <b>Sticker Maker</b>.</li>
                  <li>Make a new pack, add the three stickers, then tap <b>Add to WhatsApp</b>.</li>
                </>}
          </ol>
        </div>
      </section>
    </Layout>
  );
}
