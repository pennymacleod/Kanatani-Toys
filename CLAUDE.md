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

- **Nav must be identical across every page** (`index.js`, `about.js`, `our-story.js`, `product/[id].js`): Shop · Our Story · Find Us. `product/[id].js` has drifted out of sync before after nav changes elsewhere — always check it explicitly.
- **Opening hours** (`pages/about.js`, `HOURS` array) are hardcoded, not synced live. Penny applied for Google Business Profile API access to auto-sync them later (Google Cloud project `kanatani`, project number `28600343938`) — check application status before building that integration.
- **Testimonials/reviews section**: agreed to use hand-picked quotes pasted in by Penny (name/rating/text), not a live Google Places API integration (cost/complexity not worth it for a single small shop). Not yet built — waiting on the actual review text.
- **Shop-front photo** (`public/store.jpg`) for the hero background: not yet supplied.
- **Google Maps**: Embed API key lives directly in `pages/about.js` (this is expected/normal for this API — it's meant to be public, protected by domain restriction, not secrecy). Restricted to `kanatani-toys.vercel.app` and `*.vercel.app`.
- **Product grid**: fixed at exactly 3 columns on desktop (`styles/Home.module.css` `.grid`), auto-fill on mobile below 640px.
- **Grid "Add" button behavior**: clicking "Add" adds the item and the button turns green, relabeling to "View Basket →". Clicking it again opens the basket drawer *and* resets the button back to "Add" (local `justAdded` state in `components/ProductCard.js`, not derived from persistent cart membership — this was a deliberate choice so the same button can be used to add another one right after).
- **Product page "View Basket" button** (`pages/product/[id].js`): shows whenever `cartCount > 0`, not tied to the transient "just added" flash — this was a bug fix (previously it only showed for ~1.2s after clicking Add, then disappeared even though the item was still in the basket).
- **Product image lightbox**: clicking the main product image opens a fullscreen view with prev/next arrows, an image counter, and keyboard navigation (Escape/←/→). Implemented in `pages/product/[id].js` + `styles/Product.module.css` (`.lightboxOverlay` etc).
- **Hero heading** on the homepage reads "Kanatani Toys" (changed from the original tagline "Strange Toys for Strange People", which still appears in the browser tab title and footer — only the big hero heading was changed).

## Known tooling quirks (for future AI sessions specifically)

If you're an AI assistant working on this repo via a remote device-file-bridge (rather than a local terminal with direct shell access):

- File-read tools accessing this Mac have shown a **stale-cache bug**: re-reading a path shortly after it changed on disk (e.g. right after `git checkout`/`git reset --hard`, or right after writing a new version) can return old cached bytes, even though the reported mtime looks fresh. If content looks unexpectedly wrong (e.g. shows the old paper theme, or a stale version of a recent edit), don't trust it blindly — ask the user to `cp` the file to a differently-named path and re-read *that* path, or (better) ask the user to run `grep`/`cat`/`git log` directly in Terminal and paste the output, which is always authoritative.
- `zsh` treats `[` and `]` in filenames (like `pages/product/[id].js`) as glob patterns. If you tell the user to run `git add pages/product/[id].js` unquoted in zsh and there's no literal match, the **entire command silently fails** ("no matches found") and — critically — aborts the whole pasted command block, so a queued `git commit`/`git push` after it does nothing (commit ends up empty, push says "Everything up-to-date"). Always quote that path: `"pages/product/[id].js"`.
- This repo's Vercel project auto-deploys from `main` and has worked reliably every time it's been tested end-to-end (confirmed via a real restore/build), so if a live-site check via an automated web-fetch tool shows stale content, suspect the fetch tool's own cache before assuming the deploy failed.
