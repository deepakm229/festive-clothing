# Festive Clothing — Supabase RPC Demo

A small Node.js app that connects to Supabase and calls PostgreSQL RPC functions.

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com).

2. **Run the SQL migration** — open `sql/rpc_functions.sql` in **Supabase Dashboard → SQL Editor** and execute it. This creates:
   - `clothes` and `bookings` tables
   - `check_availability()` RPC
   - `create_booking()` RPC

3. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Fill in `SUPABASE_URL` and `SUPABASE_ANON_KEY` from **Project Settings → API**.

4. **Install and run:**

   ```bash
   npm install
   npm start
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | List clothes + check availability (default demo) |
| `npm run list-clothes` | Fetch active clothes from the database |
| `npm run check-availability -- 1 2026-10-01 2026-10-03` | RPC: check if cloth 1 is free |
| `npm run create-booking -- 1 "Jane Doe" 9876543210 jane@example.com 2026-10-01 2026-10-03` | RPC: create a booking |

## How RPC works

Supabase exposes PostgreSQL functions as RPC endpoints. From JavaScript:

```js
const { data, error } = await supabase.rpc('check_availability', {
  p_cloth_id: 1,
  p_from: '2026-10-01',
  p_to: '2026-10-03',
});
```

The helper in `src/supabaseClient.js` wraps this pattern:

```js
import { callRpc } from './supabaseClient.js';

const available = await callRpc('check_availability', {
  p_cloth_id: 1,
  p_from: '2026-10-01',
  p_to: '2026-10-03',
});
```

## Project structure

```
src/
  supabaseClient.js   # Supabase client + callRpc helper
  index.js            # CLI demo commands
sql/
  rpc_functions.sql   # Tables + PostgreSQL RPC functions
```
