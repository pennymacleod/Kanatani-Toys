# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Next.js (pages router) storefront for Kanatani Toys — a Japanese toy shop in Lewes, East Sussex, owned by Penny. Live site: kanatani-toys.vercel.app. There is no database and no CMS — Square is the single source of truth for products, prices, images, categories, and stock. The site fetches the catalog from Square on every page load and posts orders back to Square as hosted Payment Links.

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

**Cart state is not persisted or shared across pages.** `pages/index.js` and `pages/product/[id].js` each hold their own local `cart` state via `useState`; navigating between the homepage and a product page loses the cart. `components/Cart.js` is a stateless drawer that both pages render, driven entirely by props (`cart`, `onChangeQty`, `onRemove`) plus its own internal loading/error state for the checkout call.

**Styling**: CSS Modules per page/section (`styles/Home.module.css`, `styles/Product.module.css`, `styles/About.module.css`) plus `styles/globals.css`. The product page (`Product.module.css`) reuses `Home.module.css` for shared chrome (header, nav, footer) rather than duplicating it — when editing header/nav/footer markup or styles, check both files stay in sync since `pages/product/[id].js` imports both.

**Images**: `next.config.js` allowlists the Square/AWS image CDNs Square returns image URLs from (`*.squarecdn.com`, `*.squareup.com`, the S3 bucket Square uses, `*.amazonaws.com`) — required for `next/image` (or plain `<img>` from these hosts) to work.

## Design system

The site uses a **dark neon theme** — this is the correct, current, live design. Do not switch to any other theme without explicit instruction.

- **Background**: `#06060f` (near-black), card gradients `#0d0d1a` → `#0a0a14`
- **Neon blue** (primary accent, brand color): `#00b4ff` — used for headings, borders, buttons, glow/text-shadow effects
- **Neon pink/red** (secondary accent): `#ff2052` — used for eyebrows, category labels, badges
- **Success green**: `#39ff14` — used for the "Added ✓" confirmation state on Add-to-cart buttons
- **Body text**: `#e8e8ff`; muted grey-blues (`#445`, `#556`, `#334` etc.) for secondary text
- **Fonts**: `Orbitron` (headings, labels, buttons, nav — loaded via Google Fonts `family=Orbitron:wght@400;700;900`) and `Nunito` (body text — `family=Nunito:wght@400;700;800`)

There was a brief, unintentional detour where an unrelated "paper shopfront" theme (cream/navy/vermilion, Archivo Black/Figtree/JetBrains Mono fonts) got mixed into a local commit via an independent Claude Code session. **That theme was never actually deployed to production** and has been fully reverted — if you ever see references to `--paper`, `--navy`, `--vermilion`, or Archivo Black/Figtree anywhere, they're stale and wrong. The neon theme described above is correct.

## Git branches

- **`main`** — production. Tracks `origin/main`. Vercel auto-deploys from this branch. This is the only branch that should ever be pushed to Vercel.
- **`design-refresh`** — an experimental branch containing the unused paper-theme redesign mentioned above. Not merged into `main`, not deployed. Kept around only as a reference/backup of that exploration; safe to ignore or delete.

## Open items / running notes

Keep this section updated as things change — it's the fastest way for a new session (or a new person entirely) to avoid repeating already-settled decisions.

- **Nav must be identical across every page** (`index.js`, `about.js`, `our-story.js`, `product/[id].js`, `privacy.js`, `terms.js`, `404.js`): Shop · Our Story · Find Us · Testimonials. `product/[id].js` has drifted out of sync before after nav changes elsewhere — always check it explicitly. "Testimonials" is an anchor link (`/#testimonials` or `#testimonials` on the homepage itself) to the testimonials section, which only exists on the homepage — same pattern as the "Shop" link.
- **Opening hours** (`pages/about.js`, `HOURS` array) are hardcoded, not synced live. Now closed **Monday and Sunday** (Sunday used to be open 11:00–15:00; changed 2026-07-15). Penny applied for Google Business Profile API access to auto-sync them later (Google Cloud project `kanatani`, project number `28600343938`) — check application status before building that integration.
- **Testimonials** — built 2026-07-15 (`components/Testimonials.js`, homepage only). 19 real five-star Google reviews Penny hand-pasted verbatim, shown 6 at a time with a "Show all N reviews" expand toggle. **Never invent or paraphrase a review** — only use exact text Penny supplies. One review (Anna Lyne) is missing its quote text and was left out on purpose; add it if she sends the text. The "Leave a Google review" CTA still links to the general Google Maps place page (not a direct one-click review link) — swap in a proper `g.page/r/.../review` or `search.google.com/local/writereview?placeid=...` link once Penny finds one (do not guess/construct this URL — a wrong or session-bound link will break for visitors).
- **Nav & "Follow Us" styling** (`styles/Home.module.css`): after several rounds of back-and-forth, the settled look is **plain text, no borders/boxes/pills** — blue (`#00b4ff`) by default with a soft `text-shadow` glow, turning pink (`#ff2052`) with a stronger glow on hover. Applies to the main nav links, the "Follow Us" toggle, and the links inside its dropdown. A bordered/background pill-button treatment was explicitly tried and rejected — don't reintroduce it without checking first.
- **Social links** — `components/SocialLinks.js`, a collapsible "Follow Us ▾" `<details>/<summary>` menu (no JS state needed) in the **header**, next to the Basket/Back button. (It was built in the footer first, then explicitly moved to the header — don't move it back without asking.) Links to Instagram, TikTok, Facebook, YouTube.
- **Privacy Policy & Terms and Conditions** — `pages/privacy.js` + `pages/terms.js`, built 2026-07-15, linked as small muted text at the bottom of every footer via `components/LegalLinks.js` (deliberately low-key, not a popup/banner — no cookie banner exists or is needed since the site sets no tracking cookies). Covers UK GDPR basics: Square as an independent data controller for checkout data, Google Maps/Fonts as the only third parties, consumer rights (Consumer Contracts Regs 2013 / Consumer Rights Act 2015). **AI-drafted, not solicitor-reviewed** — flagged to Leo as needing a real legal check before being final, especially since the business's legal structure (sole trader vs. registered company, VAT status) isn't stated anywhere in the text.
- **Google Maps is click-to-load, not auto-embedded** (`pages/about.js`, `mapLoaded` state, changed 2026-07-15) — the iframe (and Google's cookies) only load if a visitor clicks "Click to load map". This is what lets the site avoid needing a cookie consent banner — don't revert to an always-on iframe without reconsidering that.
- **Structured data**: homepage (`pages/index.js`) has a `Store` JSON-LD block (address, phone, hours, `sameAs` socials, `aggregateRating` 5.0/19) for Google rich results. Update `reviewCount` and the `sameAs` list here if the testimonials or social links change.
- **SEO basics**: `public/robots.txt` + dynamic `pages/sitemap.xml.js` (pulls live product IDs straight from Square, plus the static pages) added 2026-07-15. Custom branded `pages/404.js` added same day — don't let it regress to Next's plain default 404.
- **Analytics**: `@vercel/analytics` added to `pages/_app.js` 2026-07-15 (cookieless page-view tracking, no consent banner needed). **Still needs to be switched on in the Vercel dashboard** (Project → Analytics tab) — the code alone doesn't activate data collection.
- **Social share image**: `public/social-share.jpg` (Penny's badge/logo graphic) is the `og:image`/`twitter:image` set in every page's `<Head>` individually (`index.js`, `about.js`, `our-story.js`, `product/[id].js`) — update all of them if the image ever changes.
- **Phone number**: `+44 7484 826746` added to the Find Us contact card 2026-07-15 — sourced from the domain's WHOIS registrant info, confirmed OK to publish by Leo. Reconfirm with Penny before changing it (may be a personal mobile, not a dedicated business line).
- **AI receptionist widget**: `pages/_document.js` has a `<script src="https://pipeliner.eu/api/widget?key=...">` tag. This is intentional — Leo's own separate SaaS product (Pipeliner) installed site-wide as a chat widget, not a mistake or leftover from testing. Updated 2026-07-15 to the `pipeliner.eu` custom domain and a new key (previously pointed at an old `aisaas-*.vercel.app` preview URL).
- **Domain (`kanatanitoys.com`) is NOT yet pointed at Vercel.** It's registered/DNS-hosted through Square, not Vercel. Vercel wants an A record (`@` → an IP, was `216.198.79.1` as of 2026-07-15 but Vercel's IP has changed before — trust whatever Vercel's Domains page shows over this note) and a CNAME (`www` → a per-domain hash, check Vercel's dashboard for the current value). **Square's DNS edit/delete buttons were completely unresponsive** when tried 2026-07-15 — confirmed via `dig` that neither record ever actually changed, not a user-error issue. Leo set up a Square "domain forward" as a stopgap and was going to contact Square support directly. Production is still served only from `kanatani-toys.vercel.app`.
- **GitHub push access**: repo is `pennymacleod/Kanatani-Toys` (owned by Penny's GitHub account); Leo pushes from his own `lglifesgood` account. Resolved 2026-07-15 by adding `lglifesgood` as a collaborator on the repo. (A one-time personal access token was used to push before the collaborator invite went through — it was pasted in chat, so it should be revoked/regenerated on Penny's GitHub account if that hasn't happened already.)
- **Product grid**: fixed at exactly 3 columns on desktop (`styles/Home.module.css` `.grid`), auto-fill on mobile below 640px.
- **Grid "Add" button behavior**: clicking "Add" adds the item and the button turns green, relabeling to "View Basket →". Clicking it again opens the basket drawer *and* resets the button back to "Add" (local `justAdded` state in `components/ProductCard.js`, not derived from persistent cart membership — this was a deliberate choice so the same button can be used to add another one right after).
- **Product page "View Basket" button** (`pages/product/[id].js`): shows whenever `cartCount > 0`, not tied to the transient "just added" flash — this was a bug fix (previously it only showed for ~1.2s after clicking Add, then disappeared even though the item was still in the basket).
- **Product image lightbox**: clicking the main product image opens a fullscreen view with prev/next arrows, an image counter, and keyboard navigation (Escape/←/→). Implemented in `pages/product/[id].js` + `styles/Product.module.css` (`.lightboxOverlay` etc).
- **Hero heading** on the homepage reads "Kanatani Toys" (changed from the original tagline "Strange Toys for Strange People", which still appears in the browser tab title and footer — only the big hero heading was changed).
- **Shop-front photo**: supplied and live (`public/store-front.png`, used in `pages/our-story.js`) — the old "not yet supplied" note is stale/resolved.
- **Live social feed embeds added 2026-07-21** (`components/SocialFeeds.js`, on the Find Us page below the map): expandable buttons per platform, showing real content where an official no-key embed exists rather than just linking out. TikTok uses the official creator-profile embed (real follower count + recent videos). Facebook uses the official Page Plugin iframe — must point at the canonical `facebook.com/profile.php?id=61579078334008`, not the `facebook.com/share/...` link (that doesn't resolve for the plugin). **Facebook's plugin gets stuck on an infinite spinner when the visitor's browser blocks third-party cookies — this is Meta's own known limitation (breaks in Firefox, Edge, Safari, Chrome Incognito by default), not fixable from our side**; a delayed hint + "Open Facebook" button covers it. YouTube fetches the channel's public RSS feed server-side (`pages/api/youtube-latest.js`, no API key) to embed the latest video, because the `/embed/videoseries` playlist embed throws "video unavailable" when a channel — like this one currently — has zero public uploads; once Penny posts a video it'll pick it up automatically. Instagram has no key-free official full-feed embed (needs a Meta Business account + Graph API app review), so it stays a styled link-out card rather than a fake feed — flag this to Penny if she wants a real Instagram feed, since it needs either that Meta setup or a third-party widget service (e.g. SnapWidget/Elfsight), both of which need an account decision from her first.
- **Category filter bug fixed 2026-07-21**: `pages/index.js` and `pages/api/catalog.js` were reading `item_data.category_id`, Square's older single-category field, which is always `undefined` for this catalog — every product fell through to "Other", so the shop only ever showed "All" and "Other" tabs. Fixed to read `item_data.categories[0].id` (the current multi-category field Square's dashboard now writes to) first, falling back to `category_id`. **Underlying data gap still open**: as of the fix, only 5 of 79 products in Square actually have a category assigned (4 in "Sofubi", 1 in "Extra Things"); two other categories exist ("Faire", "Sofubi showcase") with zero items. The other 74 products (masks, teas, Ghibli postcards/erasers, etc.) have no category set at all and will keep showing under "Other" until Penny assigns categories to them directly in the Square dashboard — that's manual/business-judgment work, intentionally left to her rather than auto-assigned.

## Known tooling quirks (for future AI sessions specifically)

If you're an AI assistant working on this repo via a remote device-file-bridge (rather than a local terminal with direct shell access):

- File-read tools accessing this Mac have shown a **stale-cache bug**: re-reading a path shortly after it changed on disk (e.g. right after `git checkout`/`git reset --hard`, or right after writing a new version) can return old cached bytes, even though the reported mtime looks fresh. If content looks unexpectedly wrong (e.g. shows the old paper theme, or a stale version of a recent edit), don't trust it blindly — ask the user to `cp` the file to a differently-named path and re-read *that* path, or (better) ask the user to run `grep`/`cat`/`git log` directly in Terminal and paste the output, which is always authoritative.
- `zsh` treats `[` and `]` in filenames (like `pages/product/[id].js`) as glob patterns. If you tell the user to run `git add pages/product/[id].js` unquoted in zsh and there's no literal match, the **entire command silently fails** ("no matches found") and — critically — aborts the whole pasted command block, so a queued `git commit`/`git push` after it does nothing (commit ends up empty, push says "Everything up-to-date"). Always quote that path: `"pages/product/[id].js"`.
- This repo's Vercel project auto-deploys from `main` and has worked reliably every time it's been tested end-to-end (confirmed via a real restore/build), so if a live-site check via an automated web-fetch tool shows stale content, suspect the fetch tool's own cache before assuming the deploy failed.
