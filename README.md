# ⚽ GOAT HAVEN — Premium Football Jersey Store

A production-ready e-commerce platform and inventory management system designed for independent football kit curators and sportswear businesses. Features a customer-facing storefront, WhatsApp Click-to-Chat direct ordering with structured receipts, and a secure Supabase-powered Admin Console for size-by-size inventory allocation and audit tracking.

---

## ⚡ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, React Router DOM 6 |
| **Icons** | Lucide React |
| **Backend / DB** | Supabase (PostgreSQL 15, Auth, Storage, Row-Level Security) |
| **Hosting** | Cloudflare Pages (Free tier static site hosting with SPA routing) |
| **Checkout** | WhatsApp Click-to-Chat (`wa.me` official protocol) |

---

## 📁 Project Directory Structure

```
c:\Users\Akilesh Prabhu S\Desktop\L - Stufs\Goat Haven\
├── public/
│   ├── _redirects                 # Cloudflare Pages SPA rewrite rule (/* /index.html 200)
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx          # Size & stock state badges
│   │   │   ├── Button.jsx         # Accessible buttons (primary, whatsapp, danger)
│   │   │   ├── Modal.jsx          # Accessible dialog overlay
│   │   │   ├── SEOHead.jsx        # Dynamic OpenGraph & Meta tags
│   │   │   └── Spinner.jsx        # Loading indicator
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx    # Topbar & layout wrapper for admin
│   │   │   ├── AdminSidebar.jsx   # Responsive collapsible admin sidebar
│   │   │   ├── Footer.jsx         # Customer site footer with features & links
│   │   │   ├── Navbar.jsx         # Sticky glassmorphism header & navigation
│   │   │   └── ProtectedRoute.jsx # Guard enforcing Supabase Auth & admin role
│   │   ├── products/
│   │   │   ├── ImageGallery.jsx   # Multi-image gallery with thumbnail switcher
│   │   │   ├── ProductCard.jsx    # Jersey card with price, stock badges & quick order
│   │   │   ├── SizeSelector.jsx   # Live stock validator; disables out-of-stock sizes
│   │   │   └── WhatsAppButton.jsx # Direct WhatsApp generator
│   │   └── admin/
│   │       ├── ProductFormModal.jsx # Add/Edit jersey specs, sizes & images
│   │       └── StockAdjustModal.jsx # Atomic stock increase/decrease with audit reason
│   ├── config/
│   │   └── brand.js               # Central brand name, phone, features, socials
│   ├── contexts/
│   │   ├── AuthContext.jsx        # Supabase authentication session provider
│   │   └── ToastContext.jsx       # Global notification toasts
│   ├── pages/
│   │   ├── Home.jsx               # Hero, featured jerseys, new arrivals, club filters
│   │   ├── Products.jsx           # Catalogue with search, multi-filters & sorting
│   │   ├── ProductDetails.jsx     # Detail view, gallery, size/quantity & WhatsApp CTA
│   │   ├── AdminLogin.jsx         # Secure login screen
│   │   ├── AdminDashboard.jsx     # Stock alerts, KPIs, recently updated jerseys
│   │   ├── AdminProducts.jsx      # Product management table, publish/hide toggles
│   │   └── AdminInventory.jsx     # Size matrix & stock adjustment audit history
│   ├── services/
│   │   ├── inventoryService.js    # Stock overview KPIs & adjust_stock RPC caller
│   │   ├── productService.js      # CRUD operations with active filtering
│   │   ├── supabase.js            # Supabase client initializer & offline fallback
│   │   └── whatsappService.js     # Formats prefilled wa.me order messages
│   ├── utils/
│   │   ├── formatPrice.js         # Currency formatter
│   │   └── slugify.js             # SEO-friendly URL slug generation
│   ├── App.jsx                    # Routing table
│   ├── index.css                  # Tailwind styles & animations
│   └── main.jsx                   # React DOM root mounting
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # Complete PostgreSQL schema, triggers, RLS, functions
│   └── seed.sql                   # Real matchday jersey catalog & variants
├── .env.example                   # Template for environment variables
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Custom sportswear design tokens
└── vite.config.js                 # Vite bundler & manual chunk optimization
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Clone & Install Dependencies

```bash
cd "c:\Users\Akilesh Prabhu S\Desktop\L - Stufs\Goat Haven"
pnpm install
```

### 2. Configure Environment Variables

Duplicate `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your values:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_WHATSAPP_NUMBER=91989223210
```

> **Note:** Provide the WhatsApp phone number in international format **without** `+` or leading spaces (e.g. `919876543210` for India, `447123456789` for UK).

---

## 🗄️ Supabase Database & Security Setup

1. Open your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** tab.
4. Paste and execute the contents of `supabase/migrations/001_initial_schema.sql`.
   - Creates `products`, `product_variants`, `product_images`, `profiles`, `inventory_adjustments`.
   - Creates the atomic `adjust_stock(...)` stored procedure.
   - Configures PostgreSQL triggers for automatic `updated_at` timestamps.
   - Enables Row Level Security (RLS) on all tables with public read and admin-only write.
   - Configures the `product-images` storage bucket and access policies.
5. *(Optional)* Run `supabase/seed.sql` to populate the store with authentic football jerseys and size variants.

### Initial Admin Account Creation

1. In Supabase Dashboard, go to **Authentication** -> **Users** -> **Add User**.
2. Create an admin user with an email (e.g. `owner@goathaven.com`) and secure password.
3. Copy the newly generated **User UID**.
4. In the SQL Editor, grant admin privileges:

```sql
INSERT INTO public.profiles (id, role)
VALUES ('<PASTE-USER-UID-HERE>', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Now you can log into `yourdomain.com/admin/login` using those credentials!

---

## 📱 WhatsApp Ordering Flow

When a customer clicks **"Order on WhatsApp"** on any jersey detail page, the application verifies:
- A size has been selected (e.g. `M`)
- The selected size has stock available (`stock_quantity > 0`)
- The chosen quantity does not exceed available stock

It then generates a standardized link formatted per the official WhatsApp protocol:

```
https://wa.me/919876543210?text=ENCODED_MESSAGE
```

### Prefilled Message Preview:
```text
🔥 *NEW JERSEY ORDER INQUIRY - GOAT HAVEN*
----------------------------------------
🏷️ *Product:* Real Madrid 2024/25 Home Kit
🆔 *SKU:* RM-2425-H-M
👕 *Size:* M
📦 *Quantity:* 2
💰 *Unit Price:* ₹2,499
💳 *Estimated Total:* ₹4,998
----------------------------------------
Hi! I'd like to place an order for this jersey. Could you please confirm stock availability and share payment/delivery details?
Thank you!
```

Stock is **not** decremented on link click. The seller verifies the conversation, completes payment/delivery details directly, and adjusts inventory in the Admin Console.

---

## 📦 Inventory Management & Stock Adjustment

1. Open `/admin/inventory`.
2. Inspect the **Size Stock Matrix**:
   - Filter by jersey name or SKU.
   - Low-stock items (≤ 5 units) are highlighted in amber.
   - Depleted items (0 units) are highlighted in red.
3. Click **"Adjust Stock"**:
   - Choose **Add Stock** (new delivery), **Decrease** (sale confirmed), or **Set Exact**.
   - Input the required **Reason** (e.g., `WhatsApp order #GH-104 verified`).
   - Click **Confirm Safe Update**.
4. All adjustments are logged with the previous quantity, delta, new quantity, timestamp, and admin email under the **Adjustment History** tab.

---

## 🚀 Cloudflare Pages Deployment

Deploy for free on Cloudflare Pages:

1. Push your repository to GitHub.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) and go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your repository.
4. Set Build Configuration:
   - **Framework preset:** `Vite`
   - **Build command:** `pnpm run build`
   - **Build output directory:** `dist`
5. Under **Environment variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - `VITE_WHATSAPP_NUMBER` = `919876543210`
6. Click **Save and Deploy**.

> SPA routing is pre-configured via `public/_redirects` (`/* /index.html 200`), ensuring all deep links (e.g. `/products/real-madrid-2024-25-home-kit` and `/admin/inventory`) work seamlessly on page reload.

---

## 🧪 Verification & Testing

Run unit tests locally:

```bash
node test_validation.js
```

Build verification:

```bash
pnpm run build
```

---

## 🎨 Changing Brand Identity

All branding is centralized in `src/config/brand.js`:
- Brand Name (`name`, `shortName`)
- Tagline & Descriptions
- Default WhatsApp seller phone number
- Currency Symbol & Locale (`₹`, `INR`, `en-IN` or `$`, `USD`, `en-US`)
- Social Media Links
