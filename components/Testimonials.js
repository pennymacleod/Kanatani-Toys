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
    quote: "A wonderful hidden gem below the streets of Lewes. A captivating array of collectibles and pocket money toys for children. Hosted by the most kindest wonderful staff. Can't wait to visit again soon…",
    author: 'Simon Ackred',
  },
  {
    quote: "Great little find in the Needlemakers! Like a walk down memory lane looking at the vintage collections.. nice Japanese home bits too, I bought a bath powder and it's gorgeous. Penny the shop keeper is a cool chick with an amazing vibe. Recommend a visit!",
    author: 'Nikki and Cameron Roucher',
  },
  {
    quote: "Love this Japanese toy shop! Such a gem. My kids are obsessed with Pokémon and they had a great time looking through cards and the shop owner showed us their amazing sofubi figures. Definitely recommend",
    author: 'Gaby B',
  },
  {
    quote: "Great business. You can't buy these toys and collectors items anywhere in the world. I suggest you get in before you miss something you never knew you needed. A right treasure for Lewes",
    author: 'ICF INNOVATIONS Ltd',
  },
  {
    quote: "Awesome shop full of Japanese goodies and collectables. Owner is very friendly and sources the stock from Japan themselves - potential to find some very unique items sought with care :) Great selection of retro items too.",
    author: 'Kelly',
  },
  {
    quote: "Was such a highlight of our day to find Kanatani downstairs at the Needlemakers, we had no idea such a wonderful little shop was there!! Penny was so welcoming 🧡 looking forward to stopping by again soon ☺️",
    author: 'Daisy Martin',
  },
  {
    quote: "Hidden gem in Lewes with a huge range of vintage Japanese toys and anime merch. The shop has something for people of all ages and interests at a great price. 10/10 would definitely recommend",
    author: 'Connor Murphy',
  },
  {
    quote: "Great little shop with a variety of sofubi, vintage toys, and fun trinkets from Japan. A must if you're in Lewes!",
    author: 'Otter',
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
    quote: "The best toy shop in East Sussex! Excellent selection of Japanese toys, vintage collectibles and sweet treats, sold by the friendliest staff. A hidden gem in the heart of Lewes.",
    author: 'Lori Inglis Hall',
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
    quote: "Lovely hidden gem in the Needlemakers! Great selection of stuff and really lovely owners. Highly recommend. Came out with three Studio Ghibli badges from Japan and had a lovely chat with the owners.",
    author: 'Ben Burton',
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
    <section className={styles.testimonials}>
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
