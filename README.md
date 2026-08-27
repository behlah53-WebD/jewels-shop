# Aurelia Jewels — Next.js App Router

This project is a self-contained **Next.js App Router** luxury jewellery storefront. Customer routes live in the root `app/` directory, while the reusable interactive experience is in `components/AureliaExperience.tsx`. The checkout, order, payment, coupon, gift-card, and delivery-protection controls are intentionally **visual previews only** and do not process payments or submit orders.

## Run locally

Use a recent Node.js LTS release, then run the following commands from the project directory:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For a production verification, use `npm run build`, followed by `npm start`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Long-form luxury home page |
| `/shop` | Collection browser with filters and grid/list presentation |
| `/product/solenne` | Detailed product experience with gallery and preview controls |
| `/cart` and `/checkout` | Cart and non-processing checkout preview |
| `/account` | Customer-account preview |
| `/about`, `/contact`, `/journal` | Brand, contact, and editorial experiences |
| `/admin` | Operations and CMS dashboard preview |
| Any guide path, such as `/size-guide` | Guide and policy-page layout |

## MongoDB Atlas later

When you are ready to activate persistence, create a local `.env.local` file and add `MONGODB_URI=` followed by your Atlas connection string. You may optionally set `MONGODB_DB_NAME=aurelia_jewels`. The `lib/mongodb.ts` helper is intentionally lazy: when `MONGODB_URI` is blank, it returns `null` and the preview storefront remains functional. Never expose the Atlas URI in browser code or commit `.env.local`.

## Intentional boundaries

No Shopify store is connected. No Stripe keys, checkout provider, or payment request is configured. Customer review and testimonial components deliberately show honest empty states until real customer-generated content is available.
