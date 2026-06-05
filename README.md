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

## Development Timeline

Project timeline documented for the development window from `22-05-2026` to `31-05-2026`.

### Week 1: Architecture & Core Authentication

- Day 1-2: System architecture design and database schema modeling for Users, Stores, Products, and Orders.
- Day 3-5: Node/Express server setup and JWT-based Role-Based Access Control (RBAC).
- Day 6-7: React frontend scaffolding and secure login/registration workflows for Vendors and Customers.

### Week 2: Inventory & Store Management

- Day 1-3: Backend API routes for Store and Product CRUD operations, including image upload planning.
- Day 4-6: Vendor Dashboard UI for managing inventory, pricing, and variants.
- Day 7: Integration testing of frontend and backend inventory workflows.

### Week 3: Cart, Checkout & Payments

- Day 1-2: Global cart state and persistent cart behavior.
- Day 3-5: Payment API integration flow, payment method handling, and webhook-ready order status logic.
- Day 6-7: Customer checkout flow, order creation logic, and transaction confirmation support.

### Week 4: Analytics, Refinement & Deployment

- Day 1-3: Super Admin and Vendor analytics dashboards for revenue, order volume, payment methods, and fulfillment.
- Day 4-5: Testing, error handling optimization, and MongoDB query indexing.
- Day 6-7: CI/CD and production deployment planning for Vercel frontend and Render/AWS backend.
