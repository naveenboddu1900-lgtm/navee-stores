# Market Place

Market Place is a full-stack MERN-style multi-tenant e-commerce SaaS project.

## Run

```bash
cd "NAVEE Stores"
cmd /c npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

If port `5000` is already busy, start the backend on another port:

```bash
cd backend
set PORT=5001
npm run dev
```

Then point the frontend at it with `frontend/.env`:

```bash
VITE_API_URL=http://localhost:5001/api
```

## Demo Users

- Super Admin: `admin@redx.dev` / `Password123!`
- Vendor: `vendor@redx.dev` / `Password123!`
- Customer: `customer@redx.dev` / `Password123!`

## Included

- Separate login and register pages
- Login-gated app interface
- Products, stores, cart, details, vendor, and admin pages
- Checkout payment methods
- Redux Toolkit cart state
- Stripe payment intent and webhook integration with demo fallback
- Super Admin and Vendor analytics dashboards
- MongoDB connection health and query indexes
- Success pages for login, registration, checkout, and admin/vendor actions
- 30 products and 21 stores in demo data

## Week 3 And 4 Updates

- Cart state now uses Redux Toolkit with shared selectors for cart count, total, and line items.
- Checkout creates orders, starts Stripe payment intents when `STRIPE_SECRET_KEY` is present, and keeps demo payments available for local development.
- Stripe webhooks update order payment status when `STRIPE_WEBHOOK_SECRET` is configured.
- Order confirmation email uses SMTP when mail settings exist and otherwise queues a demo confirmation response.
- Admin and vendor dashboards include revenue, order volume, AOV, fulfillment, and Recharts visualizations.
- MongoDB indexes cover tenant products, user/admin lists, customer orders, store orders, payment status, and dashboard timelines.
- GitHub Actions CI installs backend/frontend dependencies, validates backend imports, and builds the frontend.

## MongoDB

Create `backend/.env` from `backend/.env.example` and set `MONGO_URI`.

```bash
MONGO_URI=mongodb://127.0.0.1:27017/market_place
```

If `MONGO_URI` is missing, the backend runs in seeded memory mode for demos.

## Stripe And Email

Set these variables in `backend/.env` and in production host secrets:

```bash
STRIPE_SECRET_KEY=sk_live_or_test_key
STRIPE_WEBHOOK_SECRET=whsec_webhook_secret
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=mailer@example.com
SMTP_PASS=replace_me
MAIL_FROM=Market Place <no-reply@marketplace.local>
```
