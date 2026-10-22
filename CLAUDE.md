# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Next.js (pages router) storefront for Kanatani Toys — a Japanese toy shop at Unit 7, Brighton Open Market (moved from Lewes in September 2026), owned by Penny. Live site: kanatani-toys.vercel.app. There is no database and no CMS — Square is the single source of truth for products, prices, images, categories, and stock. The site fetches the catalog from Square on every page load and posts orders back to Square as hosted Payment Links.

## Business context

Kanatani Toys is a Japanese toyshop online store, run with help from a friend (Leo) doing the technical work. Square holds all products, prices, and stock — treat it as the single source of truth and never invent numbers.

- **Product listings**: keep the Japanese product name plus a natural English title. Include series/brand, character, size/scale, material, and condition. Keep collector terms as-is (nendoroid, gachapon, amiibo, etc.) rather than translating them.
- **Marketing/social voice**: friendly, knowledgeable, honest. No fake scarcity or hype ("only 2 left!", "selling fast!") — keep all claims accurate to actual Square data.
- **Guardrails**: never expose Square API keys or customer data in code or commits. Ask before bulk-editing live product data in Square.

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

There is no lint, test, or typecheck script configured — this project has none set up.

## Environment

Copy `.env.local.example` to `.env.local` and set:

- `SQUARE_ACCESS_TOKEN` — Square API token (server-only, never sent to the browser)
- `SQUARE_LOCATION_ID` — Square location to read inventory/create orders for
- `SQUARE_ENVIRONMENT` — `production` or `sandbox`
- `NEXT_PUBLIC_SITE_URL` — used to build the Payment Link `redirect_url` back to `/order-complete` (falls back to `http://localhost:3000`)

Without valid Square credentials, pages render with an empty catalog and a visible error banner rather than crashing.

**Square access token has been rotated before** after accidentally being exposed in chat. If touching it again, never paste the value into chat — update it directly in Vercel's environment variables.

## Architecture

**Square is fetched twice, independently, by design:**
- `pages/index.js` (`getServerSideProps`) fetches the catalog itself, inline, for the homepage grid.
- `pages/api/catalog.js` is a separate REST route that does the same Square calls, used by `pages/product/[id].js` and any other client-side fetches.

These two implementations are *not* shared code — they intentionally duplicate the Square fetch/transform logic (catalog list → category map → image map → inventory batch-retrieve → product shape). When changing how a product is shaped or filtered (e.g. stock handling, `ecom_visibility`, `available_online`), check whether the change needs to be made in **both** places. Note the filtering differs slightly today: `index.js` also excludes `ecom_visibility === 'HIDDEN'` and `available_online === false`, while `api/catalog.js` does not.

**Square fetch pattern** (in both places above):
1. Paginate `GET /v2/catalog/list?types=ITEM,CATEGORY,IMAGE` following `cursor` until exhausted.
2. Build `categoryMap` (category id → name) and `imageMap` (image id → URL) from the returned objects.
3. Batch-fetch stock via `POST /v2/inventory/counts/batch-retrieve` using all variation IDs (capped at 1000 per Square's limit in `api/catalog.js`).
4. Assemble each product from its first variation (price/stock default to the first variation; `allVariations` carries the rest for variant selection on the product page).
5. Price/stock are in the item's smallest currency unit (pence); `stock: null` means Square isn't tracking inventory for that variation (distinct from `0`, which means out of stock).

**Checkout** (`pages/api/checkout.js`): takes cart items from the client, maps them to Square order line items by `catalog_object_id` (falling back to an ad-hoc `name`/`base_price_money` line item if no `variationId`), and creates a Square-hosted Payment Link. The browser is redirected to `checkoutUrl`; Square handles payment and stock deduction, then redirects to `/order-complete`.

**Cart**: one shared basket for the whole site (`lib/cart.js`, see Site structure below).

**Styling**: global CSS (`styles/newlook.css` + `styles/additions.css`), see Design system below. The old CSS Modules were removed with the New Look.

**Images**: `next.config.js` allowlists the Square/AWS image CDNs Square returns image URLs from (`*.squarecdn.com`, `*.squareup.com`, the S3 bucket Square uses, `*.amazonaws.com`) — required for `next/image` (or plain `<img>` from these hosts) to work.

## Design system

The site uses the **"New Look"** (October 2026): Penny's bright shop-floor style, ported from her design preview artifact ("Kanatani Toys New Look"). It replaced the old dark neon theme. Do not switch to another theme without explicit instruction.

- **Styles are global CSS, not CSS Modules**: `styles/newlook.css` (generated from the preview: shared rules first, then each page's own rules scoped under a page class such as `.pg-findus`, `.pg-showcase`, `.pg-artist`, `.pg-gacha`, `.pg-news`, `.pg-product`, `.pg-ourstory`) and `styles/additions.css` (hand-written: basket drawer, shop filters, add buttons, lightbox, text pages). Both are imported in `pages/_app.js`. `Layout` puts the page class on its wrapper via the `page` prop.
- **Colours** (`:root` vars): yellow `#EFB10C` floor, hot pink `#FF1F8F`, sky `#3FB7F0`, gold `#F2B705`, green `#5BD34A`, orange `#FF7417`, counter red `#D8352A`, TARDIS blue `#1A3FA6`, ink `#141018`, cream `#FFF4D6`. Hot pinks only, never baby pink.
- **Fonts** (Google Fonts, loaded once in `pages/_document.js`): Bagel Fat One (big outlined headings `.big`), Rubik 900 (`.mid`, prices), Mochiy Pop One (Japanese tiles), Inter (body).
- **Signature pieces**: pink asanoha header (`.night`) with the cream neon-sign logo (`.sign`), coloured pill nav, scalloped trims (`.scallop`), seigaiha name board (`.board` + `.plaque`), white display cabinet of product cards (`.cabinet` / `.shelf` / `.card`), red counter panel with the cream star medallion (`.counter` + `components/Medallion.js`), sunburst circle with the pink creature (`.circ`), TARDIS blue footer.
- **Images** for the new look live in `public/nl/` (artist logos in `public/nl/logos/`).
- **Honest labels only** on product cards (`components/ProductCard.js`): SOLD OUT / LAST ONE / ONLY N LEFT, straight from Square stock. No invented "NEW IN" or hype tags.

## Site structure (New Look)

- `components/Layout.js`: header, nav, basket button, footer, `<Head>` meta. **The nav list (`NAV`) lives only here**: Shop · Sofubi Showcase · T-shirts · Our Story · Find Us · Kaiju Gachapon · Kanatani News.
- **Basket is now shared and persisted** (`lib/cart.js`, `CartProvider` in `_app`): one cart across all pages, saved to `sessionStorage`. `components/CartDrawer.js` is the drawer and calls `/api/checkout` as before. `/order-complete` clears it. (This replaces the old per-page cart that was lost when changing page.)
- Pages: `/` (hero, live Square shop with category tabs + search, `?q=` pre-fills search), `/product/[id]` (Square, variations, lightbox; now also shows the Square category), `/about` (Find Us: drawn map that links out to Google Maps, so no Google embed or cookies; live open/closed from `lib/shop.js`; all 19 Google reviews via `components/Reviews.js`; socials), `/our-story`, `/sofubi-showcase` (artist grid with category tabs + coming soon), `/artist/[slug]` (static, from `lib/artists.js`), `/gachapon` (free kaiju capsule game, progress in `localStorage`), `/news` (Japan trip issue), `/t-shirts` + `/t-shirts/[slug]` (static list in `lib/tshirts.js`; each shirt has its own product-style page; they say "Available online soon" until added to Square with prices and sizes), `/privacy`, `/terms`, `/404`, `/order-complete`.
- **Artists**: edit `lib/artists.js`. `country: null` hides the flag (we don't know it yet). Don't invent countries or bios.
- **Kanatani News sign-up and wish list forms are placeholders** ("coming soon, message us on Instagram"). Penny wants sign-ups that don't clog her inbox and don't let people email her directly, so this needs a proper sign-up service chosen with her before any form collects emails. Never add a form that pretends to submit.
- **Sunday hours are 12–3** (every other Sunday), confirmed by Penny October 2026. They must match Google Maps.

## Git branches

- **`main`** — production. Tracks `origin/main`. Vercel auto-deploys from this branch. This is the only branch that should ever be pushed to Vercel.
- **`design-refresh`** — an experimental branch containing the unused paper-theme redesign mentioned above. Not merged into `main`, not deployed. Kept around only as a reference/backup of that exploration; safe to ignore or delete.

## Open items / running notes

Keep this section updated as things change — it's the fastest way for a new session (or a new person entirely) to avoid repeating already-settled decisions.

- **Nav** is defined once in `components/Layout.js` (`NAV`), so every page shares it. (Before the New Look it was duplicated per page and drifted.) Reviews moved from the homepage to the Find Us page.
- **Opening hours** (`lib/shop.js`, `HOURS` array) are hardcoded, not synced live. Closed Monday; open Tue–Sat 11–5 and every other Sunday 12–3 (`OPEN_SUNDAY_ANCHOR` marks a known open Sunday). Penny wants them to follow Google Maps automatically (e.g. when the shop closes for trips). She applied for Google Business Profile API access to auto-sync them (Google Cloud project `kanatani`, project number `28600343938`) — check application status before building that integration.
- **Reviews** — `components/Reviews.js`, on the Find Us page (moved from the homepage in the New Look). 19 real five-star Google reviews Penny hand-pasted verbatim, shown 6 at a time with a "Show all N reviews" expand toggle. **Never invent or paraphrase a review** — only use exact text Penny supplies. One review (Anna Lyne) is missing its quote text and was left out on purpose; add it if she sends the text. The "Leave a Google review" CTA still links to the general Google Maps place page (not a direct one-click review link) — swap in a proper `g.page/r/.../review` or `search.google.com/local/writereview?placeid=...` link once Penny finds one (do not guess/construct this URL — a wrong or session-bound link will break for visitors).
- **Privacy Policy & Terms and Conditions** — `pages/privacy.js` + `pages/terms.js`, built 2026-07-15, linked as small muted text at the bottom of every footer via `components/LegalLinks.js` (deliberately low-key, not a popup/banner — no cookie banner exists or is needed since the site sets no tracking cookies). Covers UK GDPR basics: Square as an independent data controller for checkout data, Google Maps/Fonts as the only third parties, consumer rights (Consumer Contracts Regs 2013 / Consumer Rights Act 2015). **AI-drafted, not solicitor-reviewed** — flagged to Leo as needing a real legal check before being final, especially since the business's legal structure (sole trader vs. registered company, VAT status) isn't stated anywhere in the text.
- **Structured data**: homepage (`pages/index.js`) has a `Store` JSON-LD block (address, phone, hours, `sameAs` socials, `aggregateRating` 5.0/19) for Google rich results. Update `reviewCount` and the `sameAs` list here if the testimonials or social links change.
- **SEO basics**: `public/robots.txt` + dynamic `pages/sitemap.xml.js` (pulls live product IDs straight from Square, plus the static pages) added 2026-07-15. Custom branded `pages/404.js` added same day — don't let it regress to Next's plain default 404.
- **Analytics**: `@vercel/analytics` added to `pages/_app.js` 2026-07-15 (cookieless page-view tracking, no consent banner needed). **Still needs to be switched on in the Vercel dashboard** (Project → Analytics tab) — the code alone doesn't activate data collection.
- **Social share image**: `public/social-share.jpg` (Penny's badge/logo graphic) is the `og:image`/`twitter:image`, set once in `components/Layout.js`.
- **Phone number**: removed from the Find Us page at Penny's request (October 2026). Don't add it back.
- **AI receptionist widget**: `pages/_document.js` has a `<script src="https://pipeliner.eu/api/widget?key=...">` tag. This is intentional — Leo's own separate SaaS product (Pipeliner) installed site-wide as a chat widget, not a mistake or leftover from testing. Updated 2026-07-15 to the `pipeliner.eu` custom domain and a new key (previously pointed at an old `aisaas-*.vercel.app` preview URL).
- **Domain (`kanatanitoys.com`) is NOT yet pointed at Vercel.** It's registered/DNS-hosted through Square, not Vercel. Vercel wants an A record (`@` → an IP, was `216.198.79.1` as of 2026-07-15 but Vercel's IP has changed before — trust whatever Vercel's Domains page shows over this note) and a CNAME (`www` → a per-domain hash, check Vercel's dashboard for the current value). **Square's DNS edit/delete buttons were completely unresponsive** when tried 2026-07-15 — confirmed via `dig` that neither record ever actually changed, not a user-error issue. Leo set up a Square "domain forward" as a stopgap and was going to contact Square support directly. Production is still served only from `kanatani-toys.vercel.app`.
- **GitHub push access**: repo is `pennymacleod/Kanatani-Toys` (owned by Penny's GitHub account); Leo pushes from his own `lglifesgood` account. Resolved 2026-07-15 by adding `lglifesgood` as a collaborator on the repo. (A one-time personal access token was used to push before the collaborator invite went through — it was pasted in chat, so it should be revoked/regenerated on Penny's GitHub account if that hasn't happened already.)
- **Product grid**: 4 columns in the cabinet on desktop, 2 on phones (`.shelf` in `styles/newlook.css`).
- **Grid "Add" button behavior**: clicking "Add" adds the item and the button turns green, relabeling to "View Basket →". Clicking it again opens the basket drawer *and* resets the button back to "Add" (local `justAdded` state in `components/ProductCard.js`, not derived from persistent cart membership — this was a deliberate choice so the same button can be used to add another one right after).
- **Product page "View Basket" button** (`pages/product/[id].js`): shows whenever `cartCount > 0`, not tied to the transient "just added" flash — this was a bug fix (previously it only showed for ~1.2s after clicking Add, then disappeared even though the item was still in the basket).
- **Product image lightbox**: clicking the main product image opens a fullscreen view with prev/next arrows, an image counter, and keyboard navigation (Escape/←/→). In `pages/product/[id].js`, styles `.lightbox` in `styles/additions.css`.
- **Hero heading** on the homepage reads "Kanatani Toys" (changed from the original tagline "Strange Toys for Strange People", which still appears in the browser tab title and footer — only the big hero heading was changed).
- **Shop-front photo**: supplied and live (`public/store-front.png`, used in `pages/our-story.js`) — the old "not yet supplied" note is stale/resolved.
- **Category filter bug fixed 2026-07-21**: `pages/index.js` and `pages/api/catalog.js` were reading `item_data.category_id`, Square's older single-category field, which is always `undefined` for this catalog — every product fell through to "Other", so the shop only ever showed "All" and "Other" tabs. Fixed to read `item_data.categories[0].id` (the current multi-category field Square's dashboard now writes to) first, falling back to `category_id`. **Underlying data gap still open**: as of the fix, only 5 of 79 products in Square actually have a category assigned (4 in "Sofubi", 1 in "Extra Things"); two other categories exist ("Faire", "Sofubi showcase") with zero items. The other 74 products (masks, teas, Ghibli postcards/erasers, etc.) have no category set at all and will keep showing under "Other" until Penny assigns categories to them directly in the Square dashboard — that's manual/business-judgment work, intentionally left to her rather than auto-assigned.

- **Shop tabs** are fixed: All · Sofubi · Merch · Other Strange Things (`lib/categories.js`). Merch = clothing/Kanatani merch; everything else non-sofubi is Other Strange Things. Square category names (KT Japan, KT Sofubi, Extra Things…) are folded into these; name overrides there (finger puppets → Other Strange Things). On "All" the order is Sofubi, then Merch, then Other, with sold-out last.
- **Artist pages** don't say "Sofubi Showcase" or "at Kanatani" (only sofubi artists are the showcase); the role comes from the first category (Sticker artist, Clothing designer…). With no work photos they show a general line: work is in the cabinets or on the shelves, pop in or follow them on Instagram.
- **Basket respects Square stock**: `lib/cart.js` won't let the quantity go above the item's Square stock (one-off sofubi can only be added once).
- **Sofubi Showcase banners** (`components/ArtistBox.js`): every banner is identical (logo, then name, then country pill) and every name uses the same font size. Lines are max 12 letters (`MAX_LINE`); names that need special line breaks have a `banner` array in `lib/artists.js` (Penny chose e.g. Pepper / Jerry, Wandering / Planet / Toys). Max 3 lines.

- **Artist toy cut-outs**: `figure` (full body, shown on the artist page starburst) and optional `cardFigure` (waist-up crop that fills the showcase card's starburst) in `lib/artists.js`, images in `public/nl/figures/`. `photoFigure: true` = a real photo cut-out, shown without the chunky cartoon drop-shadow. Ofuton Heaven is the first (Oct 2026); Penny will send photos for the others (best: light-box photo, or a cut-out copied straight from her iPad).

## Known tooling quirks (for future AI sessions specifically)

If you're an AI assistant working on this repo via a remote device-file-bridge (rather than a local terminal with direct shell access):

- File-read tools accessing this Mac have shown a **stale-cache bug**: re-reading a path shortly after it changed on disk (e.g. right after `git checkout`/`git reset --hard`, or right after writing a new version) can return old cached bytes, even though the reported mtime looks fresh. If content looks unexpectedly wrong (e.g. shows the old paper theme, or a stale version of a recent edit), don't trust it blindly — ask the user to `cp` the file to a differently-named path and re-read *that* path, or (better) ask the user to run `grep`/`cat`/`git log` directly in Terminal and paste the output, which is always authoritative.
- `zsh` treats `[` and `]` in filenames (like `pages/product/[id].js`) as glob patterns. If you tell the user to run `git add pages/product/[id].js` unquoted in zsh and there's no literal match, the **entire command silently fails** ("no matches found") and — critically — aborts the whole pasted command block, so a queued `git commit`/`git push` after it does nothing (commit ends up empty, push says "Everything up-to-date"). Always quote that path: `"pages/product/[id].js"`.
- This repo's Vercel project auto-deploys from `main` and has worked reliably every time it's been tested end-to-end (confirmed via a real restore/build), so if a live-site check via an automated web-fetch tool shows stale content, suspect the fetch tool's own cache before assuming the deploy failed.

- **Overflow on phones**: `styles/globals.css` sets `overflow-x:hidden` on `html, body` because the Pipeliner chat widget (`pages/_document.js`) can push the page wider than the screen.
- **Old Sofubi Showcase poster files** in `public/sofubi-showcase/` are no longer used by any page (the showcase is now the artist grid); safe to delete once Penny confirms.
