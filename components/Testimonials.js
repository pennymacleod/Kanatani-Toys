import styles from '../styles/Home.module.css';

const REVIEWS = [
  {
    quote: "Lovely hidden gem in the Needlemakers! Great selection of stuff and really lovely owners. Highly recommend. Came out with three Studio Ghibli badges from Japan and had a lovely chat with the owners.",
    author: 'Ben Burton',
  },
  {
    quote: "Amazing shop! With the kindest and enthusiastic owner, Penny! Thank you so much for your time. I will be back for your amazing Godzilla & Gamera selections!!!! All the best and see you at the Brighton outside market!",
    author: 'Alex Hislop',
  },
  {
    quote: "Hidden gem in Lewes with a huge range of vintage Japanese toys and anime merch. The shop has something for people of all ages and interests at a great price. 10/10 would definitely recommend",
    author: 'Connor Murphy',
  },
  {
    quote: "Love this Japanese toy shop! Such a gem. My kids are obsessed with Pokémon and they had a great time looking through cards and the shop owner showed us their amazing sofubi figures. Definitely recommend",
    author: 'Gaby B',
  },
  {
    quote: "Great little find in the Needlemakers! Like a walk down memory lane looking at the vintage collections.. nice Japanese home bits too, I bought a bath powder and it's gorgeous. Penny the shop keeper is a cool chick with an amazing vibe. Recommend a visit!",
    author: 'Nikki and Cameron Roucher',
  },
];

export default function Testimonials() {
  return (
    <section className={styles.testimonials}>
      <h2 className={styles.sectionTitle}>What People Say</h2>
      <div className={styles.testimonialGrid}>
        {REVIEWS.map(({ quote, author }) => (
          <div key={author} className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialQuote}>&ldquo;{quote}&rdquo;</p>
            <div className={styles.testimonialAuthor}>— {author} via Google</div>
          </div>
        ))}
      </div>
      <div className={styles.testimonialCta}>
        <p>Had a good experience? Leave a public review on Google — it helps a lot.</p>
        <a
          href="https://www.google.com/maps/place/Old+Needlemakers,+West+St,+Lewes+BN7+2NZ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave a Google review →
        </a>
      </div>
    </section>
  );
}
