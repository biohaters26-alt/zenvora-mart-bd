# Zenvora Mart BD

A complete, production-ready e-commerce platform for Bangladesh, built with **Next.js 14 (App Router)**, **Tailwind CSS**, **MongoDB/Mongoose**, and a custom JWT authentication system. Features a deep-charcoal "crystal" glassmorphism UI with cyan/emerald glow accents.

---

## ✨ Features

- **Customer auth**: register/login/logout with hashed passwords (bcrypt) + httpOnly JWT cookies
- **Homepage**: hero slider, category grid, featured/new/best-selling product rails
- **Catalog**: category filters, search, sorting, pagination
- **Product detail**: gallery, variants, star ratings, customer reviews (with submission form)
- **Cart**: persistent (localStorage) cart with quantity controls
- **Coupons**: percentage/flat discounts, min order amount, max discount cap, usage limits, expiry — validated both client-side and server-side (never trust the client)
- **Checkout**: shipping form, bKash / Nagad / Cash on Delivery payment UI, live order summary
- **Order tracking**: public lookup by order number with a visual status timeline (Pending → Confirmed → Shipped → Delivered)
- **Notifications**: email (Nodemailer) + SMS (generic BD gateway) hooks fired on order creation
- **Marketing hooks**: Google Analytics (gtag.js) + Facebook Pixel script injection, plus a `trackEvent`/`trackPurchase` helper
- **Floating WhatsApp widget** for live chat support
- **Mandatory "Order Now" + "✅ Compare Before You Buy"** actions on every product card and product page, wired to a fixed phone number and comparison URL
- **Admin dashboard**: overview stats, full product CRUD, order status management, coupon generator — protected by middleware + server-side role checks

---

## 🧱 Tech Stack

| Layer      | Technology                              |
|------------|------------------------------------------|
| Framework  | Next.js 14 (App Router, Server Components) |
| Styling    | Tailwind CSS (custom "crystal" theme)    |
| Database   | MongoDB via Mongoose                      |
| Auth       | Custom JWT (jsonwebtoken + jose) in httpOnly cookies |
| Email      | Nodemailer (SMTP)                         |
| SMS        | Generic REST gateway hook (BulkSMSBD-style) |

---

## 📁 Project Structure

```
zenvora-mart-bd/
├── app/
│   ├── layout.js                # Root layout (fonts, providers, navbar/footer)
│   ├── page.js                  # Homepage
│   ├── globals.css              # Tailwind + crystal/glass utility classes
│   ├── sitemap.js / robots.js   # SEO
│   ├── products/
│   │   ├── page.js              # Catalog with filters
│   │   └── [slug]/page.js       # Product detail
│   ├── cart/page.js
│   ├── checkout/page.js
│   ├── orders/track/page.js
│   ├── login/page.js  register/page.js
│   ├── admin/
│   │   ├── layout.js            # Protected admin shell
│   │   ├── page.js               # Overview / stats
│   │   ├── products/page.js
│   │   ├── orders/page.js
│   │   └── coupons/page.js
│   └── api/
│       ├── auth/{register,login,logout,me}/route.js
│       ├── products/route.js  products/[id]/route.js
│       ├── reviews/route.js
│       ├── coupons/route.js  coupons/[id]/route.js  coupons/validate/route.js
│       └── orders/route.js  orders/[id]/route.js
├── components/                  # UI components (Navbar, Footer, ProductCard, ...)
│   └── admin/                   # Admin-only client components
├── context/CartContext.js       # Global cart state (React context + localStorage)
├── lib/                         # mongodb.js, auth.js, constants.js, coupon.js, email.js, sms.js, analytics.js, data.js
├── models/                      # User, Product, Order, Coupon, Review (Mongoose schemas)
├── middleware.js                # Edge middleware guarding /admin/*
├── scripts/seed.js              # Seeds an admin user + sample products + a demo coupon
└── tailwind.config.js           # Deep charcoal/navy + cyan/emerald crystal theme
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

At minimum, set `MONGODB_URI` (a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works fine) and `JWT_SECRET` (any long random string).

### 3. Seed the database (creates an admin account + sample products)

```bash
npm run seed
```

This creates an admin user using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local` (defaults to `admin@zenvoramart.com` / `ChangeMe123!` if unset — **change this before going live**).

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`. Log in at `/login` with your admin credentials, then visit `/admin` to manage products, orders, and coupons.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🔧 Configuring Integrations

- **Email confirmations**: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` in `.env.local` (works with Gmail app passwords, SendGrid SMTP, Mailgun, etc). Without these set, emails are logged to the console instead of sent (safe no-op for local dev).
- **SMS confirmations**: set `SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER_ID` to match your local gateway (BulkSMSBD, Alpha SMS, SSLWireless, Reve Systems, etc). The request shape in `lib/sms.js` is written for a BulkSMSBD-style GET API — adjust the query params if your provider differs.
- **bKash / Nagad**: this build ships the **manual verification** flow used by most small/medium BD merchants — the customer sends money to your Personal/Merchant number and enters the Transaction ID at checkout, which you verify from your admin dashboard. To use the official bKash/Nagad merchant gateways (automatic payment capture), you'll need to register as a merchant with those providers and swap in their checkout SDKs.
- **Google Analytics / Facebook Pixel**: set `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_FB_PIXEL_ID`; scripts auto-inject via `components/AnalyticsScripts.js`.

---

## 🔐 Security Notes

- Passwords are hashed with bcrypt (10 salt rounds); never stored in plaintext.
- JWTs are stored in **httpOnly** cookies (not accessible to client JS), mitigating XSS token theft.
- All prices are **re-verified server-side** at checkout — the client never dictates final pricing.
- `/admin/*` routes are protected both at the edge (`middleware.js`) and again inside each admin API route (`requireAdmin()`), so a forged cookie alone can't grant access without a valid signature.

---

## 📦 Deployment

This app deploys cleanly to **Vercel** (recommended for Next.js) or any Node.js host:

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add all variables from `.env.example` to the Vercel project's Environment Variables.
4. Deploy. Run `npm run seed` once locally (pointed at your production `MONGODB_URI`) to bootstrap your admin account and sample catalog.

---

## 📝 License

This codebase was generated for Zenvora Mart BD and is free to modify and deploy for your own use.
