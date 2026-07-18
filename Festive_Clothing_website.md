# Festival Clothes Rental Website - Project Plan

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| UI | Next.js | React-based framework with excellent SEO, performance, and seamless Vercel deployment. |
| Database | Supabase (PostgreSQL) | Managed relational database with authentication and auto-generated APIs. |
| API | Supabase | CRUD APIs plus Edge Functions for custom booking logic. |
| Images | Cloudinary | Free image hosting and optimization. |
| Source Control | GitHub | Version control and CI/CD. |
| Hosting | Vercel | Free hosting for Next.js/Next.js. |
| Domain | Namecheap / Cloudflare | Custom domain. |

---

# Architecture

```text
User
  |
Vercel (Next.js)
  |
Supabase
 |-- PostgreSQL
 |-- Auth
 |-- Edge Functions
 |
Cloudinary
```

---

# Functional Requirements

## Public Website

- Browse available clothes
- View images
- View price
- View description
- Search & filter
- Check availability
- Submit booking request

## Admin

- Login
- Add/Edit/Delete clothes
- Upload images
- View bookings
- Cancel bookings
- Block unavailable dates

---

# Database Schema

## clothes

- id
- name
- category
- festival
- description
- size
- price
- security_deposit
- image_url
- active
- created_at

## bookings

- id
- cloth_id
- customer_name
- phone
- email
- booking_from
- booking_to
- status
- remarks
- created_at

---

# Booking Logic

A booking is allowed only if no existing booking overlaps.

Overlap condition:

```
existing.booking_from <= requested_end
AND
existing.booking_to >= requested_start
```

Implement this inside a Supabase Edge Function or PostgreSQL stored procedure so validation happens server-side.

---

# API Plan

## Public

- GET /cloths
- GET /cloths/{id}
- GET /availability/{clothId}
- POST /booking

## Admin

- POST /login
- POST /cloth
- PUT /cloth/{id}
- DELETE /cloth/{id}
- GET /bookings

---

# Next.js Pages

- Home
- Cloth Listing
- Cloth Details
- Booking Form
- Booking Confirmation
- Contact
- Admin Login
- Admin Dashboard

---

# Development Phases

## Phase 1 - Setup

- Create GitHub repository
- Create Supabase project
- Configure Cloudinary
- Create Next.js project
- Deploy Next.js to Vercel

## Phase 2 - Database

- Create schema
- Seed sample data
- Enable Row Level Security
- Configure policies

## Phase 3 - UI

- Responsive layout
- Cloth listing
- Details page
- Search & filtering

## Phase 4 - Booking

- Booking form
- Availability validation
- Save booking
- Success page

## Phase 5 - Admin

- Authentication
- CRUD for clothes
- Booking management

## Phase 6 - Production

- Custom domain
- SSL
- Analytics
- Error logging

---

# Future Enhancements

- Online payments
- WhatsApp notifications
- Email confirmations
- Customer accounts
- Reviews
- Coupons
- AI outfit recommendations
- Delivery scheduling

---

# Estimated Cost

| Item | Cost |
|---|---:|
| Vercel | Free |
| Supabase | Free |
| Cloudinary | Free |
| GitHub | Free |
| Domain | ₹700-1000/year |

Total recurring cost: ₹0/month (excluding domain).

## Final Technology Stack

- UI: Next.js
- Database: Supabase PostgreSQL
- API: Supabase (Auto-generated APIs + Edge Functions)
- Image Hosting: Cloudinary
- Hosting: Vercel
- Source Control: GitHub
- Domain: Namecheap or Cloudflare Registrar
