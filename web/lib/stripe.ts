import Stripe from 'stripe';
let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (!_stripe) {
    // apiVersion intentionally omitted — let Stripe SDK pick its bundled default
    // (avoid string-literal type drift between versions)
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {} as any);
  }
  return _stripe;
}
