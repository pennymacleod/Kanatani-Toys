import { useState } from 'react';
import styles from '../styles/Home.module.css';

const REVIEWS = [
  {
    quote: "Amazing shop! With the kindest and enthusiastic owner, Penny! Thank you so much for your time. I will be back for your amazing Godzilla & Gamera selections!!!! All the best and see you at the Brighton outside market!",
    author: 'Alex Hislop',
  },
  {
    quote: "Gorgeous shop with an amazing selection of Japanese toys and collectibles, lovely owner!",
    author: 'Elwa',
  },
  {
    quote: "Love this Japanese toy shop! Such a gem. My kids are obsessed with Pokémon and they had a great time looking through cards and the shop owner showed us their amazing sofubi figures. Definitely recommend",
    author: 'Gaby B',
  },
  {
    quote: "Awesome shop full of Japanese goodies and collectables. Owner is very friendly and sources the stock from Japan themselves - potential to find some very unique items sought with care :) Great selection of retro items too.",
    author: 'Kelly',
  },
  {
    quote: "Such an adorable and unique shop! Cute accessories and stickers for such a great price, and a good range of anime and sandrio merch too, I'll definitely be visiting again :)",
    author: 'Kitty Evenden',
  },
  {
    quote: "Amazing little treasure trove of unusual Japanese gifts and toys. Happiness in a shop! We will be back for sure.",
    author: 'Crochet Crazy Lady',
  },
  {
    quote: "This a unique and quirky little toy shop that has something for everyone, kids and kidults alike! Highly recommend!",
    author: 'Sophie Athena Mae',
  },
  {
    quote: "An incredible treasure trove of glorious Japanese toys and odditoys 🦖🎎🍥🍡 And the owners are amazing!!",
    author: 'Freyja',
  },
  {
    quote: "Always friendly and welcoming, and loads of fun things to see and buy in the shop. Makes a trip to town worthwhile and makes me smile.",
    author: 'Sally Miller',
  },
  {
    quote: "Quirky little shop, love it!",
    author: 'Stanislav Cmakal',
  },
  {
    quote: "Amazing independent toy shop; my son loves it so much. The staff are so friendly and go above and beyond highly recommend!",
    author: 'Madeleine Cook',
  },
];

const INITIAL_COUNT = 6;

export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const visibleReviews = expanded ? REVIEWS : REVIEWS.slice(0, INITIAL_COUNT);

  return (
    <section className={styles.testimonials} id="testimonials">
      <h2 className={styles.sectionTitle}>What People Say</h2>
      <div className={styles.testimonialGrid}>
        {visibleReviews.map(({ quote, author }) => (
          <div key={author} className={styles.testimonialCard}>
            <div className={styles.testimonialStars}>★★★★★</div>
            <p className={styles.testimonialQuote}>&ldquo;{quote}&rdquo;</p>
            <div className={styles.testimonialAuthor}>— {author} via Google</div>
          </div>
        ))}
      </div>
      {!expanded && REVIEWS.length > INITIAL_COUNT && (
        <div className={styles.testimonialCta}>
          <button type="button" onClick={() => setExpanded(true)} className={styles.testimonialShowMore}>
            Show all {REVIEWS.length} reviews ▾
          </button>
        </div>
      )}
      <div className={styles.testimonialCta}>
        <p>Had a good experience? Leave a public review on Google — it helps a lot.</p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Kanatani+Toys+Open+Market+Marshalls+Row+Brighton+BN1+4JU"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave a Google review →
        </a>
      </div>
    </section>
  );
}
