# PerfectPair Careers - Application Documentation

## 1. Overview

PerfectPair Careers is a web application that helps candidates optimize resumes and cover letters for specific job descriptions using AI.

Main capabilities:
- Resume optimization with ATS-oriented scoring
- Cover letter generation
- Credit-based billing and monthly subscription via Stripe
- User authentication and profile/document management

## 2. Tech Stack

- Frontend: Next.js App Router + React + Tailwind + Radix UI
- Backend: Next.js API routes
- Database: PostgreSQL (Prisma ORM)
- Auth: NextAuth (Credentials)
- Storage: AWS S3
- AI: Google Gemini
- Payments: Stripe Checkout + Stripe Webhooks
- Deployment: Vercel

## 3. Core Modules

### 3.1 Authentication
- Route: `app/api/auth/[...nextauth]/route.ts`
- Config: `lib/auth.ts`
- Session strategy: JWT

### 3.2 Resume Optimization
- API: `app/api/optimize/route.ts`
- Score check API: `app/api/optimize/check-score/route.ts`
- UI: `app/optimize/_components/optimize-content.tsx`

Features:
- Initial ATS score calculation
- AI optimization (resume and/or cover letter)
- Score protection logic to prevent score regression
- Downloadable DOCX generation

### 3.3 Documents
- Upload/list/download APIs under `app/api/documents/*`
- S3 helpers in `lib/s3.ts`

### 3.4 Billing and Payments
- Checkout API: `app/api/checkout/route.ts`
- Webhook API: `app/api/webhook/route.ts`
- Billing data API: `app/api/billing/route.ts`
- Billing UI: `app/billing/_components/billing-content.tsx`

### 3.5 Dashboard and Profile
- Dashboard UI: `app/dashboard/_components/dashboard-content.tsx`
- Profile APIs/UI: `app/api/profile/route.ts`, `app/profile/*`

## 4. Data Model (Prisma)

Main entities in `prisma/schema.prisma`:
- `User`
- `Document`
- `Optimization`
- `JobPosting`
- `Payment`
- `Subscription`

## 5. Environment Variables

Typical required variables:
- Auth: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- DB: `DATABASE_URL` (and Neon-related variants)
- AI: `GEMINI_API_KEY` (or Google Generative key variants)
- AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`
- Stripe:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_RESUME`
  - `STRIPE_PRICE_RESUME_COVER`
  - `STRIPE_PRICE_MONTHLY`

## 6. Deployment

- Platform: Vercel
- Project config: `.vercel/project.json`, `vercel.json`
- Build command: `npm run build`

## 7. Security Notes

- Prices are enforced server-side in checkout.
- Webhook is signature-verified and idempotency-protected for payment records.
- Test credits endpoint is blocked in production.
- Secrets must stay in Vercel environment variables and never in Git.

## 8. Known Operational Recommendations

- Add centralized error monitoring (e.g., Sentry) if not already enabled.
- Add webhook retry/alert dashboard checks in Stripe regularly.
- Keep legal policy pages reviewed for target jurisdictions.
