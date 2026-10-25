import Head from 'next/head';

// Temporary holding page (Oct 2026). middleware.js sends every page here while
// the website is being rebuilt. Delete middleware.js to bring the site back.
export default function Holding() {
  return (
    <>
      <Head>
        <title>Kanatani Toys — back soon!</title>
        <meta name="description" content="Kanatani Toys' website is getting a makeover and will be back by the end of the week. Visit us at Unit 7, Brighton Open Market." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bagel+Fat+One&family=Rubik:wght@800;900&family=Inter:wght@500;700;800&display=swap" />
      </Head>
      <main className="h">
        <img className="logo" src="/social-share.jpg" alt="Kanatani Toys" />
        <span className="kicker">工事中 · UNDER CONSTRUCTION</span>
        <h1>Back <span>soon!</span></h1>
        <p className="lead">We're giving our website a big makeover. It'll be back <b>by the end of the week</b>, full of strange toys and new things to play.</p>
        <div className="card">
          <b>Come and see us in the shop</b>
          <span>Unit 7, Brighton Open Market, Marshalls Row, Brighton BN1 4JU</span>
          <span>Tuesday to Saturday 11–5, and every other Sunday 12–3</span>
        </div>
        <a className="btn" href="https://www.instagram.com/kanatani_toys" target="_blank" rel="noopener noreferrer">Message us on Instagram @kanatani_toys</a>
        <p className="small">Want to order something? Send us a message and we'll sort it out for you.</p>
      </main>
      <style jsx global>{`
        html, body { margin: 0; background: #EFB10C; }
        body {
          color: #141018; font-family: Inter, system-ui, sans-serif;
          background-image: linear-gradient(rgba(140,80,0,.10) 2px, transparent 2px), linear-gradient(90deg, rgba(140,80,0,.10) 2px, transparent 2px);
          background-size: 90px 90px;
        }
        .h { max-width: 620px; margin: 0 auto; min-height: 100vh; box-sizing: border-box; padding: 40px max(18px, env(safe-area-inset-left)) 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; }
        .logo { width: 150px; height: 150px; object-fit: cover; border-radius: 50%; border: 6px solid #141018; box-shadow: 6px 6px 0 #141018; background: #fff; }
        .kicker { background: #141018; color: #F2B705; font-weight: 800; letter-spacing: .18em; font-size: 13px; padding: 8px 14px; border-radius: 8px; }
        h1 { margin: 0; font: 400 clamp(52px, 14vw, 96px)/1 'Bagel Fat One', Rubik, sans-serif; color: #FF1F8F; -webkit-text-stroke: 3px #141018; text-shadow: 6px 6px 0 #141018; }
        h1 span { color: #3FB7F0; }
        .lead { margin: 0; font-size: 19px; font-weight: 700; line-height: 1.5; max-width: 30em; }
        .card { background: #1A3FA6; color: #FFF4D6; border: 5px solid #141018; border-radius: 18px; box-shadow: 6px 6px 0 #141018; padding: 16px 18px; display: flex; flex-direction: column; gap: 6px; width: 100%; box-sizing: border-box; }
        .card b { font: 400 22px 'Bagel Fat One', Rubik, sans-serif; color: #F2B705; }
        .btn { display: inline-block; background: #FF1F8F; color: #fff; text-decoration: none; font: 900 17px Rubik, sans-serif; border: 4px solid #141018; border-radius: 999px; padding: 12px 22px; box-shadow: 0 6px 0 #141018; }
        .btn:focus-visible { outline: 4px solid #3FB7F0; outline-offset: 3px; }
        .small { margin: 0; font-size: 14px; font-weight: 600; }
      `}</style>
    </>
  );
}
