# Maison Nha

Fashion e-commerce demo built with Next.js App Router, Prisma, PostgreSQL, Stripe, Resend, Zustand, and shadcn/ui.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui + Base UI
- Prisma + PostgreSQL
- Stripe Checkout + Stripe Webhook
- Resend for order confirmation email
- Zustand for cart persistence

## Features

- Storefront with fashion-oriented UI
- Product listing with filter by:
  - keyword
  - category
  - min/max price
  - stock status
  - sort order
- Product detail page with:
  - image
  - SEO metadata
  - static params generation
- Cart with local persistence via Zustand
- Stripe checkout flow
- Stripe webhook to create orders and reduce stock
- Order tracking page
- Admin product management:
  - create
  - edit
  - delete with confirmation dialog
- Admin order management with status transitions

## Project Structure

```text
src/
├── app/
│   ├── (store)/
│   ├── (admin)/
│   └── api/
├── actions/
├── components/
│   ├── admin/
│   ├── site/
│   ├── store/
│   └── ui/
├── lib/
└── store/
prisma/
scripts/
```

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
EMAIL_FROM=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Run Prisma migration:

```bash
npx prisma migrate dev
```

Seed sample categories and products:

```bash
npm run db:seed
```

If Vietnamese product/category text in the database was previously written with bad encoding, fix it with:

```bash
npm run fix:vi-data
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run db:seed
npm run fix:vi-data
```

## Notes

- Product pages and order pages use `revalidatePath()` after server mutations where appropriate.
- Product detail pages are pre-rendered with `generateStaticParams()`.
- Remote product images are allowed from `images.unsplash.com`.
- The current demo data includes 5 categories and 10 sample products.

## Current Status

Implemented and verified:

- `npm run lint` passes
- `npm run build` passes
- storefront, admin, cart, checkout success, and order tracking routes are in place
- shadcn/ui has been installed and applied across the main UI surfaces

## Next Improvements

- add authentication for admin routes
- improve image upload workflow
- add review/rating system
- deploy to Vercel and verify webhook flow in production
