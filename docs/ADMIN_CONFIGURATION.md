# Admin Configuration Guide

This guide explains where to change keys, prompts, and AI model configuration.

## 1. Management Module Status

There is currently **no dedicated admin UI panel** to manage runtime keys/prompts/models.
Configuration is done through:
- Environment variables (Vercel Project Settings)
- Source code files

## 2. Where to Change API Keys

### 2.1 Stripe Keys

Update in Vercel Project Settings -> Environment Variables:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_RESUME`
- `STRIPE_PRICE_RESUME_COVER`
- `STRIPE_PRICE_MONTHLY`

Code usage:
- Checkout: `app/api/checkout/route.ts`
- Webhook: `app/api/webhook/route.ts`

### 2.2 Gemini Key

Set in environment variables (depending on the route used):
- `GEMINI_API_KEY` (used in `app/api/optimize/route.ts`)
- `GOOGLE_GENERATIVE_AI_API_KEY` / `GOOGLE_API_KEY` (used in `lib/gemini.ts`)

Recommendation: standardize to a single variable name across all AI modules.

### 2.3 AWS Keys

Set:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`

Code usage:
- `lib/s3.ts`

## 3. Where to Change Prompt

Primary optimization prompts are inside:
- `app/api/optimize/route.ts`

Search for:
- `let prompt = ''`
- resume prompt block
- cover letter prompt block

Any business rules for tone, formatting, ATS behavior, and section constraints should be edited there.

## 4. Where to Change AI Model

Current optimization route model selection:
- `app/api/optimize/route.ts`
- Line using: `genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })`

Alternative model-selector module exists in:
- `lib/gemini.ts`

If you want centralized model governance, migrate optimization route to use `lib/gemini.ts` consistently.

## 5. Recommended Governance Improvements

1. Add an admin settings table in database (`AppConfig`) to store prompt and model per environment.
2. Add role-protected admin page for editing config safely.
3. Add versioning for prompts and model changes (audit trail).
4. Add validation tests before applying config updates to production.
