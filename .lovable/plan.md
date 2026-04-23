

# car2scrap — Implementation Plan

A modern, conversion-focused website for a car scrap & recycling service in India, with lead capture, an interactive price calculator, WhatsApp integration, and a real admin dashboard.

## Pages & Structure

```text
/                  Landing (hero + calculator + how it works + trust + testimonials + CTA)
/calculator        Full price calculator page
/services          Services offered (scrapping, pickup, RC cancellation, etc.)
/how-it-works      3-step process detail
/contact           Main conversion page (form + phone + WhatsApp + map)
/auth              Admin login (email/password)
/admin             Protected admin dashboard (lead list, filters, status updates)
```

Plus a sticky "Get Best Price" CTA on every public page, a global lead-form modal, and a floating WhatsApp button.

## Design System

- Style: clean modern SaaS, inspired by Stripe/Razorpay
- Palette: dark navy `#0B1220`, white `#FFFFFF`, accent green `#10B981` (eco/trust), accent blue `#3B82F6` (action)
- Fonts: Inter (body) + Poppins (headings) via Google Fonts
- Tokens defined in `index.css` + `tailwind.config.ts` (HSL semantic tokens — no hardcoded colors in components)
- Components: shadcn/ui (Button, Card, Dialog, Form, Input, Select, Slider, Tabs, Badge, Toast)
- Mobile-first, smooth transitions, subtle motion on CTAs and calculator updates

## Price Calculator Logic

Inputs:
- **Category** (required): Hatchback / Sedan / SUV / Pickup-Truck — average kerb weights (900 / 1200 / 1600 / 1800 kg)
- **Model** (optional): ~25 popular Indian models (Maruti Alto, Swift, WagonR, Baleno, Dzire, Hyundai i10, i20, Creta, Honda City, Amaze, Tata Nexon, Tiago, Mahindra Bolero, Scorpio, XUV500, Toyota Innova, Etios, Renault Kwid, Ford EcoSport, etc.) — overrides category weight when chosen
- **Year**: slider 1995 – current year
- **Condition**: Excellent / Good / Poor (button group)

Formula:
```
basePrice = weight_kg × scrapRatePerKg     // ₹38/kg default
ageFactor = max(0.55, 1 − (age × 0.018))   // ~1.8% depreciation per year, floor 55%
conditionFactor = { Excellent: 1.10, Good: 1.00, Poor: 0.85 }
estimate = basePrice × ageFactor × conditionFactor
range = [estimate × 0.92, estimate × 1.08]
```

Output:
- Big price range (e.g., ₹22,400 – ₹26,300)
- Breakdown card: metal value, age adjustment, condition adjustment
- Disclaimer: "Final price may vary after physical inspection"
- Primary CTA: "Book Free Pickup" → opens lead form pre-filled with calculator values

## Lead Capture

Multi-step form (3 steps with progress bar):
1. Car details: model, year, condition
2. Contact: name, phone (10-digit India), city
3. Review + submit

Validation with `react-hook-form` + `zod` (length limits, India phone regex). On submit: insert into `leads` table → invoke `notify-admin-lead` edge function → toast + thank-you state.

Triggers everywhere: hero CTA, sticky CTA, calculator CTA, services cards, contact page — all open the same `LeadFormDialog` (or route to `/contact` on dedicated nav clicks).

## Trust & Conversion Elements

- Badges row: "Govt. Authorized", "Instant Payment", "Free Pickup", "RC Cancellation Support", "Eco-Certified Recycling"
- Testimonials carousel (3–4 seeded)
- Live activity ticker: rotating messages like "Rohit from Delhi booked 12 min ago" (client-side rotation from a seeded list — clearly synthetic, not deceptive about volume)
- Stats strip: "10,000+ cars scrapped", "50+ cities", "₹4.5 Cr paid out"

## Contact Page

- Lead form (same component)
- Phone: `+91 98089 03131` (tel: link)
- WhatsApp button: `https://wa.me/919808903131?text=Hi%2C%20I%20want%20a%20scrap%20price%20quote%20for%20my%20car`
- Address: Gata No.142, Near Testify Rice Mill, Rajarampur, Sikandarabad Industrial Area, Bulandshahar – 203205
- Embedded Google Maps iframe pinned to that address
- Floating WhatsApp FAB on every page

## Backend (Lovable Cloud)

Tables:
- `leads` — id, name, phone, city, car_category, car_model, year, condition, estimated_price_min, estimated_price_max, source, status (new/contacted/converted/rejected), notes, created_at
- `user_roles` — id, user_id, role (enum: admin, user) — separate table per security best practices, with `has_role()` SECURITY DEFINER function
- `profiles` — id, user_id, email, full_name, created_at (auto-created on signup via trigger)

RLS:
- `leads`: anyone can INSERT (public form); only admins can SELECT/UPDATE
- `user_roles`: only admins can manage; users can read their own role
- `profiles`: users read/update their own

Edge function:
- `notify-admin-lead` — triggered after lead insert; sends email to `turbo.rony@yahoo.com` via Lovable's built-in transactional email system (no third-party API key needed). Subject + formatted lead details.

Email infrastructure:
- Set up email domain (user prompted via setup dialog)
- Use built-in `send-transactional-email` function with a custom `new-lead-notification` template

## Admin Dashboard

- `/auth` — email/password login (Lovable Cloud auth, email confirmation off for fast admin onboarding)
- Initial admin: after first signup with `turbo.rony@yahoo.com`, a one-time SQL insert grants the `admin` role
- `/admin` — protected route (redirects to `/auth` if not logged in or not admin):
  - KPI cards: total leads, new today, conversion rate
  - Filterable table: status, city, date range, search by name/phone
  - Click row → side sheet with full details + status dropdown + notes textarea
  - Export CSV button

## Technical Implementation

- React 18 + Vite + TypeScript + Tailwind + shadcn
- React Router for routing
- React Hook Form + Zod for all forms
- TanStack Query for admin data fetching
- Supabase JS client (auto-configured by Lovable Cloud)
- `sonner` for toasts
- Auth: `onAuthStateChange` listener set BEFORE `getSession()`; `ProtectedRoute` wrapper checks both session and `has_role(uid, 'admin')`
- All inputs validated client + server (RLS + zod)
- WhatsApp link uses `encodeURIComponent` for the prefilled message

## Build Order

1. Enable Lovable Cloud, create tables + RLS + roles function
2. Design system (tokens, fonts, base layout, header, footer, sticky CTA, WhatsApp FAB)
3. Landing page with hero, calculator, how-it-works, trust, testimonials, live activity
4. Lead form dialog (multi-step) + insert logic
5. Contact, Services, How It Works, Calculator pages
6. Email domain setup + transactional email template + `notify-admin-lead` trigger
7. Auth page + admin role bootstrap for `turbo.rony@yahoo.com`
8. Admin dashboard with table, filters, status updates, CSV export
9. Polish: animations, mobile QA, accessibility pass

