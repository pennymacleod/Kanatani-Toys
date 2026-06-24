# 🧸 Kanatani Toys — Custom Square Storefront

A modern, dark neon Japanese-themed storefront for **kanatanitoys.com** built with **Next.js**, pulling all products, prices, images, and live stock directly from your **Square Dashboard** via the Square API.

---

## How it works

```
Customer browser  →  your website (Next.js)  →  Square API (server-side)
                                                  ↑ Catalog: products & prices
                                                  ↑ Inventory: live stock counts
                                                  ↑ Orders: checkout & payment
```

- **You manage everything in Square** — add a product in your Square Dashboard and it appears on the website instantly on next page load.
- **Stock is always accurate** — sell something on the till, website stock drops automatically.
- **No CORS issues** — API calls happen on the server, the browser never touches Square directly.

---

## Setup (15 minutes)

### 1. Get your Square credentials

**Access Token:**
1. Go to [developer.squareup.com](https://developer.squareup.com)
2. Sign in with your Square account
3. Click **My Applications** → **New Application** → name it "Kanatani Website"
4. Click into the app → **Credentials** tab
5. Under **Production**, copy the **Access Token** (starts with `EAAA...`)

**Location ID:**
1. Go to your [Square Dashboard](https://squareup.com/dashboard)
2. **Account & Settings** → **Locations**
3. Click your location → copy the **Location ID** (starts with `L...`)

### 2. Configure environment

```bash
# In the project root, copy the example env file:
cp .env.local.example .env.local

# Open .env.local and fill in your credentials:
SQUARE_ACCESS_TOKEN=EAAAl_your_token_here
SQUARE_LOCATION_ID=L_your_location_id_here
SQUARE_ENVIRONMENT=production
```

### 3. Install and run

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel (free, takes 5 minutes)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In Vercel's project settings → **Environment Variables** → add:
   - `SQUARE_ACCESS_TOKEN` = your token
   - `SQUARE_LOCATION_ID` = your location ID
   - `SQUARE_ENVIRONMENT` = `production`
4. Click **Deploy** — your site is live with a free `.vercel.app` URL
5. Add your custom domain `kanatanitoys.com` in Vercel's Domains settings

**That's it.** Every time a customer visits, the page fetches fresh products from Square.

---

## Managing products (no website changes needed)

Everything is managed from your **Square Dashboard**:

| What you want to do | Where to do it |
|---|---|
| Add a new product | Square Dashboard → Items → Create Item |
| Change a price | Square Dashboard → Items → edit item |
| Add a product photo | Square Dashboard → Items → edit → add image |
| Create categories | Square Dashboard → Items → Categories |
| Update stock | Square Dashboard → Items → Inventory |
| Mark something out of stock | Set stock to 0 in Inventory |

Changes appear on the website on the next page visit (or within seconds with auto-refresh).

---

## Project structure

```
kanatani-toys/
├── pages/
│   ├── index.js          ← Main storefront page
│   ├── order-complete.js ← Thank you page after checkout
│   ├── _app.js           ← Next.js app wrapper
│   └── api/
│       ├── catalog.js    ← Server route: fetches products from Square
│       └── checkout.js   ← Server route: creates Square Payment Link
├── components/
│   ├── ProductCard.js    ← Individual product card
│   └── Cart.js           ← Shopping cart drawer
├── styles/
│   ├── globals.css       ← Base styles
│   └── Home.module.css   ← Component styles (dark neon theme)
├── public/
│   └── logo.png          ← Kanatani neon logo
├── .env.local.example    ← Environment variable template
├── next.config.js        ← Next.js config (image domains)
└── package.json
```

---

## API endpoints

### `GET /api/catalog`
Fetches all products and inventory from Square. Called server-side on page load.

**Response:**
```json
{
  "products": [
    {
      "id": "...",
      "name": "Rainbow Stacking Rings",
      "description": "...",
      "category": "Wooden Toys",
      "price": 1895,
      "currency": "GBP",
      "stock": 12,
      "imageUrls": ["https://..."],
      "variationId": "...",
      "allVariations": [...]
    }
  ],
  "categories": ["All", "Wooden Toys", "Puzzles", ...],
  "totalCount": 24,
  "fetchedAt": "2025-06-22T..."
}
```

### `POST /api/checkout`
Creates a Square Payment Link for the cart. Customer is redirected to Square's hosted checkout.

**Request body:**
```json
{
  "cartItems": [
    { "variationId": "...", "name": "...", "price": 1895, "qty": 2 }
  ]
}
```

**Response:**
```json
{
  "checkoutUrl": "https://square.link/...",
  "orderId": "..."
}
```

---

## Questions?

- **Square API docs:** https://developer.squareup.com/docs
- **Next.js docs:** https://nextjs.org/docs
- **Vercel deployment:** https://vercel.com/docs
