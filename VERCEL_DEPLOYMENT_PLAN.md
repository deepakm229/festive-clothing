# Vercel + Supabase Deployment Plan — Summary

Summary of the deployment plan for the Festive Clothing Next.js web application (`web/`) to Vercel with a public URL and Supabase database connectivity.

---

## Overview

Deploy the Next.js app in `web/` to Vercel with a public URL, connected to the existing Supabase PostgreSQL backend via environment variables and SQL migrations. **The app code is already wired for Supabase** — the main work is Git upload, Supabase setup, and Vercel configuration.

```
Local code (web/) → GitHub → Vercel build & host → Supabase API → PostgreSQL + Storage
```

---

## Current Project Structure

| Path | Purpose | Deploy to Vercel? |
|------|---------|-------------------|
| `web/` | Next.js 16 rental website | **Yes — Vercel target** |
| `src/` | Node.js CLI demo for RPC testing | No |
| `sql/` | Shared Supabase migrations | Run manually in Supabase |

### Already Implemented in `web/`

- **Server client:** `web/src/lib/supabase/server.ts`
- **Admin/service-role client:** `web/src/lib/supabase/admin.ts`
- **Session/auth proxy:** `web/src/proxy.ts` + `web/src/lib/supabase/middleware.ts`
- **Data fetching:** `web/src/lib/data/clothes.ts`, `web/src/actions/booking.ts`
- **Vercel config:** `web/vercel.json`
- **Env template:** `web/.env.local.example`

**Note:** The repo may not yet be a git repository. Initialize git and push to GitHub before Vercel can import it.

---

## Phase 1 — Supabase Database Setup

### 1.1 Create or confirm Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a project (or reuse an existing one).
3. Note credentials from **Project Settings → API**:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never in browser)

### 1.2 Run SQL migrations (in order)

Open **Supabase Dashboard → SQL Editor** and execute:

1. `sql/rpc_functions.sql` — creates `clothes` and `bookings` tables, sample data, `check_availability()` and `create_booking()` RPCs, and public read RLS on active clothes.
2. `sql/storage_and_admin.sql` — creates public `clothes-images` storage bucket and admin RLS policies.

Verify in **Table Editor** that `clothes` has rows and RPC functions appear under **Database → Functions**.

### 1.3 Create admin user

In **Authentication → Users → Add user**, create an email/password admin account for `/admin/login`.

### 1.4 Configure Supabase Auth for production URL

After the first Vercel deploy, update **Authentication → URL Configuration**:

- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** add `https://your-app.vercel.app/**` and `http://localhost:3000/**` for local dev

Required for admin login cookies/sessions on the public URL.

---

## Phase 2 — Database Connection Configuration

The web app does **not** use a direct PostgreSQL connection string. It connects via the Supabase HTTP API using the official JS client — the recommended pattern for Vercel serverless.

### 2.1 Local development

From `web/`:

```bash
cp .env.local.example .env.local
```

Fill in `web/.env.local` (gitignored):

| Variable | Scope | Used by |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public (browser + server) | All Supabase clients, `next.config.ts` image domains |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (browser + server) | All Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only secret** | Admin CRUD + image uploads via `web/src/lib/supabase/admin.ts` |

**Naming gotcha:** The root demo (`.env.example`) uses `SUPABASE_URL` / `SUPABASE_ANON_KEY` without the `NEXT_PUBLIC_` prefix. The web app requires the `NEXT_PUBLIC_` prefix — do not copy root env vars verbatim.

Test locally:

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:3000/clothes` — you should see outfits from Supabase. Test booking and `/admin/login`.

### 2.2 How the connection works in code

```typescript
// Server Components / Server Actions (web/src/lib/supabase/server.ts)
createServerClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, { cookies })

// Admin writes (web/src/lib/supabase/admin.ts)
createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Public data (web/src/lib/data/clothes.ts)
supabase.from("clothes").select("*").eq("active", true)

// Booking RPCs (web/src/actions/booking.ts)
supabase.rpc("check_availability", { ... })
supabase.rpc("create_booking", { ... })
```

If `SUPABASE_SERVICE_ROLE_KEY` is omitted, admin actions fall back to the logged-in session + RLS policies (see `getWritableClient()` in `web/src/actions/admin.ts`). For reliable admin image uploads, set the service role key in production.

### 2.3 Build-time requirement

`web/next.config.ts` reads `NEXT_PUBLIC_SUPABASE_URL` at **build time** to allow Supabase Storage images in `next/image`. This variable must be set in Vercel **before** the first build, not only at runtime.

---

## Phase 3 — Upload Code to GitHub

Vercel deploys from Git. Initialize the repo at the project root:

```bash
cd "c:\Personal Projects\Festive_clothing"
git init
git add .
git commit -m "Initial commit: Festive Clothing web app and Supabase backend"
```

**Before committing**, confirm secrets are excluded:

- Root `.gitignore` ignores `.env`
- `web/.gitignore` ignores `.env*` and `.vercel`

Create a GitHub repo (e.g. `festive-clothing`), then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/festive-clothing.git
git branch -M main
git push -u origin main
```

---

## Phase 4 — Deploy to Vercel

### 4.1 Import project

1. Sign in at [vercel.com](https://vercel.com) (GitHub account linked).
2. **Add New → Project** → import your GitHub repo.
3. **Critical setting:** set **Root Directory** to `web` (not the repo root). The root folder contains a separate Node demo that Vercel should not build.

### 4.2 Environment variables in Vercel

In **Project Settings → Environment Variables**, add for **Production**, **Preview**, and **Development**:

| Name | Value source |
|------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role key (mark as sensitive) |

These mirror `web/.env.local.example`. Vercel injects them into the build and serverless functions automatically — no code changes needed.

### 4.3 Build settings

`web/vercel.json` already specifies:

- `framework`: nextjs
- `buildCommand`: `npm run build`
- `installCommand`: `npm install`

Leave **Output Directory** as default. Click **Deploy**.

### 4.4 Public URL

After a successful build, Vercel assigns a URL like:

`https://festive-clothing-xxxx.vercel.app`

Every push to `main` triggers automatic redeployment. Optional: add a custom domain under **Project Settings → Domains**.

---

## Phase 5 — Post-Deploy Verification

| Check | URL / action | Expected |
|-------|--------------|----------|
| Home page loads | `/` | Hero, categories render |
| Clothes from DB | `/clothes` | Active outfits from Supabase |
| Detail + availability | `/clothes/[id]` | Availability checker calls RPC |
| Booking | `/booking` | Creates booking via `create_booking` RPC |
| Admin login | `/admin/login` | Auth with user from Phase 1.3 |
| Admin CRUD | `/admin/clothes` | Add/edit/delete with image upload |
| Supabase Auth URLs | Dashboard | Production URL added (Phase 1.4) |

**Troubleshooting:**

- Clothes page empty → re-run `sql/rpc_functions.sql` sample inserts
- Admin login redirect fails → fix Supabase redirect URLs
- Images broken → confirm `NEXT_PUBLIC_SUPABASE_URL` was set before build

---

## Security Checklist

- Never commit `.env`, `.env.local`, or service role keys to GitHub.
- `SUPABASE_SERVICE_ROLE_KEY` must only exist in Vercel env vars and local `.env.local` — it bypasses RLS.
- `NEXT_PUBLIC_*` keys are safe for the browser; RLS policies in SQL restrict what anon users can do.
- Rotate keys in Supabase if they were ever exposed in a commit.

---

## What You Do NOT Need to Change

No code changes are required for deployment if env vars and SQL migrations are in place. The Supabase clients, server actions, proxy auth, and Vercel config are already implemented.

### Optional future improvements

- Add a root-level `.env.example` note pointing web devs to `web/.env.local.example`
- Add `web/.env.production.example` documenting Vercel-only vars
- Enable Vercel Analytics / error monitoring (Phase 6 in `Festive_Clothing_website.md`)

---

## Action Items Checklist

- [ ] Run `sql/rpc_functions.sql` then `sql/storage_and_admin.sql` in Supabase SQL Editor; create admin user
- [ ] Configure `web/.env.local` from `.env.local.example` and verify `npm run dev` connects to Supabase
- [ ] Initialize git repo, ensure `.env` files are gitignored, push to GitHub
- [ ] Import GitHub repo in Vercel with **Root Directory = `web`**; add all 3 Supabase env vars
- [ ] Update Supabase Auth Site URL and Redirect URLs with production Vercel URL
- [ ] Test public pages, booking RPC, admin login, and image uploads on live URL
