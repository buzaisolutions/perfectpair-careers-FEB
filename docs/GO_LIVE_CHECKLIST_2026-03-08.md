# Production Go-Live Checklist

Date: 2026-03-08

## Summary

Current status: **Technically ready to launch**, with a few **manual business checks** still required before full commercial rollout.

## Completed Technical Checks

1. **Production deployment**
- Vercel production deployment completed successfully.
- Build output includes all core pages and API routes.

2. **Build validation**
- `npm run build` completed successfully.
- No blocking compile/runtime errors in build pipeline.

3. **Stripe environment (production)**
- Production Vercel environment variables updated to live Stripe keys (`pk_live` / `sk_live`).
- Stripe price IDs configured for all plans:
  - `STRIPE_PRICE_RESUME`
  - `STRIPE_PRICE_RESUME_COVER`
  - `STRIPE_PRICE_MONTHLY`

4. **Checkout hardening (critical fix applied)**
- Checkout now uses **server-side Stripe Price IDs**.
- Client cannot inject arbitrary `price` or `credits` anymore.

5. **Webhook processing hardening (critical fix applied)**
- Webhook now supports one-time and subscription flow with idempotency check (`stripePaymentId`).
- Credits and subscription status updates are handled server-side.

6. **Test endpoint protection**
- `/api/billing/add-test-credits` is now disabled in production (`403`).

7. **Core AI optimization behavior**
- ATS score guard prevents score regression after optimization.
- DOCX export for resume and cover letter uses justified paragraph formatting.

## Manual Checks Still Required (Business/CX)

1. **Real payment test in live Stripe**
- Run a real low-value purchase.
- Verify:
  - Checkout success
  - Webhook delivery success in Stripe dashboard
  - Credits/subscription update in DB
  - Payment record creation in app

2. **Refund and failure handling**
- Test failed payment and cancelled checkout flow.
- Confirm user messaging and billing history accuracy.

3. **Legal/compliance validation**
- Terms, Privacy, Cookies and Disclaimer pages should be legally reviewed.
- Confirm tax/VAT invoicing obligations for your target market.

4. **Operational monitoring**
- Confirm alerting for webhook failures and server errors.
- Confirm DB backup and restore process.

## Final Recommendation

From an engineering perspective, the platform is in a launch-capable state.
Complete the manual payment/compliance checks above before scaling paid traffic.
