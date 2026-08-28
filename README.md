# Aurelia Jewels — Luxury Fine Jewellery E-Commerce & CMS

Production-grade Next.js App Router luxury jewellery storefront powered by **MongoDB + Mongoose**, **JWT Authentication** (HTTP-only cookies), **bcrypt password hashing**, and **Zod schema validation**. Includes a complete administration portal (`/admin`) with catalogue management, order fulfillment, customer records, and a live website content CMS editor.

---

## 1. Required Environment Variables

Create a `.env` (or `.env.local`) file in the root directory. Copy the template from `.env.example`:

```env
# MongoDB Connection String (PASTE YOUR MONODB URI HERE)
MONGODB_URI=

# Optional MongoDB Database Name (defaults to aurelia_jewels)
MONGODB_DB_NAME=aurelia_jewels

# JWT Secret Key for Session Cookies
JWT_SECRET=aurelia_jewels_super_secret_jwt_key_2026_change_in_production

# Initial Admin User Credentials (used by `npm run seed`)
ADMIN_NAME=Aurelia Curator
ADMIN_EMAIL=admin@aureliajewels.com
ADMIN_PASSWORD=AdminSecurePassword2026!
```

---

## 2. Where to Paste Your MongoDB URI

Open your `.env` (or `.env.local`) file and paste your MongoDB Atlas connection string directly after `MONGODB_URI=`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aurelia_jewels?retryWrites=true&w=majority
```

> **Note**: When `MONGODB_URI` is not provided, the storefront operates gracefully using built-in high-quality seed defaults.

---

## 3. How to Seed the First Admin & Catalogue Data

Run the seed script to automatically create your initial **Admin Curator** account, default product categories (Rings, Earrings, Bracelets, Pendants), fine gemstone products, and CMS site content:

```bash
npm run seed
```

Default Admin Credentials:
- **Email**: `admin@aureliajewels.com`
- **Password**: `AdminSecurePassword2026!`

*(You can customize `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your `.env` file prior to seeding).*

---

## 4. How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Seed database (once `MONGODB_URI` is configured in `.env`):
   ```bash
   npm run seed
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Typecheck & Build verification:
   ```bash
   npm run check
   npm run build
   ```

---

## 5. Available Routes & Administration Suite

### Storefront & Buyer Routes
- `/` — Homepage with dynamic CMS hero, categories, new arrivals, craft story, and testimonials.
- `/shop` — Storefront catalogue with category, material, search filters, and grid/list view.
- `/product/[slug]` — Product detail page with gallery, gemstone specifications, stock badge, and size selection.
- `/account` — Buyer portal for Sign In, Registration, profile details, saved addresses, and order history tracking.
- `/checkout` — Insured order checkout flow.

### Admin Routes (Protected - Role: Admin)
- `/admin/login` — Dedicated executive login portal for store administrators.
- `/admin` — Complete Administration & Operations Suite with tabbed views:
  - **Dashboard**: Revenue analytics, total orders, active products, customer count, low-stock warnings, and recent orders feed.
  - **Catalogue (Products)**: Full CRUD (Create, Edit, Delete), image URL management, stock tracking, category assignment, price management, and active/featured toggles.
  - **Categories**: Full category CRUD with image management and slug generation.
  - **Orders**: List all customer orders, filter by status (`processing`, `shipped`, `delivered`, `cancelled`), update order and payment statuses.
  - **Customers**: Inspect registered buyer accounts, email, phone, and order counts.
  - **Homepage & CMS**: Live editor for Hero banner, Trust row, Limited Edition section, Craft story, Contact & Atelier info, Footer links, and SEO defaults.

---

## 6. Key Architecture & API Endpoints

- **`POST /api/auth/register`**: Public buyer registration (always assigns `role: "buyer"`).
- **`POST /api/auth/login`**: Authenticates buyers and admins; issues HTTP-only `auth_token` cookie.
- **`POST /api/auth/logout`**: Clears authentication cookie.
- **`GET /api/auth/me`**: Fetches current authenticated user session.
- **`PUT /api/auth/profile`**: Updates buyer name, phone, and saved shipping addresses.
- **`GET /api/products`**: Public catalogue search, filtering (category/material/collection), sorting, pagination.
- **`GET /api/products/[slug]`**: Single product details by slug.
- **`GET /api/categories`**: Active store categories.
- **`GET /api/site-content`**: Storefront CMS content.
- **`POST /api/orders`**: Authenticated buyer order placement.
- **`GET /api/orders`**: Authenticated buyer order history.
- **`GET /api/admin/stats`**: Protected admin summary metrics.
- **`GET/POST /api/admin/products`**: Protected product CRUD.
- **`GET/POST /api/admin/categories`**: Protected category CRUD.
- **`GET/PUT /api/admin/orders`**: Protected customer order management.
- **`GET/PUT /api/admin/site-content`**: Protected CMS content editor.
