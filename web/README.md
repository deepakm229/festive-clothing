# Festive Clothing — Web App

Next.js rental website for festive clothing. Deploys to Vercel and connects to your existing Supabase backend.

## Setup

1. **Run SQL migrations** in Supabase Dashboard → SQL Editor:
   - [`../sql/rpc_functions.sql`](../sql/rpc_functions.sql) — tables + booking RPCs
   - [`../sql/storage_and_admin.sql`](../sql/storage_and_admin.sql) — image storage + admin policies

2. **Create an admin user** in Supabase Dashboard → Authentication → Users → Add user (email + password).

3. **Configure environment variables:**

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Optional | Server-only key for admin writes (or use authenticated session + RLS) |

4. **Install and run:**

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, categories, featured outfits |
| `/clothes` | Browse with search & filters |
| `/clothes/[id]` | Outfit details + availability checker |
| `/booking` | Booking request form |
| `/admin/login` | Admin sign-in |
| `/admin` | Dashboard |
| `/admin/clothes` | Manage outfits + image upload |
| `/admin/bookings` | View and manage bookings |

## Deploy to Vercel

1. Push the repo to GitHub.
2. In [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `web`.
4. Add environment variables (same as `.env.local`).
5. Deploy.

Vercel will auto-deploy on every push to your main branch.

## Project structure

```
web/
├── src/
│   ├── app/              # Pages (App Router)
│   ├── actions/          # Server Actions (booking, admin)
│   ├── components/       # UI components
│   └── lib/              # Supabase clients, data helpers, types
├── .env.local.example
└── vercel.json
```
