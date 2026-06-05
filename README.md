# NAVEE Stores

NAVEE Stores is a full-stack MERN-style multi-tenant e-commerce SaaS project.

## Run

```bash
cd "NAVEE Stores"
cmd /c npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

The dev command starts the backend first and waits for `/api/health` before starting the frontend, so Vite proxy requests for login, register, stores, products, and checkout have a live backend target.

## Demo Users

- Super Admin: `admin@redx.dev` / `Password123!`
- Vendor: `vendor@redx.dev` / `Password123!`
- Customer: `customer@redx.dev` / `Password123!`

## Included

- Separate login and register pages
- Login-gated app interface
- Products, stores, cart, payments, details, vendor, and admin pages
- Checkout payment methods
- Persistent cart, order totals, tax, shipping, and payment status
- Refined analytics for payment method, fulfillment, category, stock, and revenue
- Success pages for login, registration, checkout, and admin/vendor actions
- 148 products across 12 demo stores
- Demo stores: Mobiles, Cloths, Slippers, Electronics, Shoes, Grocery, Kitchen, Furniture, Beauty, Toys, Books, and Bags
- Pet products removed from demo data
- Deployment guide in `DEPLOYMENT.md`
