import type { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return new Response(`Webhook Error: ${e.message}`, { status: 400 });
  }
  const admin = createAdminClient();
  try {
    if (event.type === 'checkout.session.completed') {
      const s = event.data.object as Stripe.Checkout.Session;
      const userId = s.metadata?.user_id;
      const plan = s.metadata?.plan;
      if (userId && plan) {
        await admin.from('profiles').update({
          subscription_tier: plan === 'yearly' ? 'yearly' : plan === 'team' ? 'team' : 'monthly',
          stripe_customer_id: typeof s.customer === 'string' ? s.customer : s.customer?.id ?? null
        }).eq('id', userId);
      }
    }
    if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      const customer = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
      const tier = sub.status === 'active' ? 'monthly' : 'free';
      await admin.from('profiles').update({
        subscription_tier: tier,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString()
      }).eq('stripe_customer_id', customer);
    }
    await admin.from('stripe_events').upsert({ id: event.id, type: event.type, data: event as any, processed: true });
  } catch (e: any) {
    return new Response(`handler error: ${e.message}`, { status: 500 });
  }
  return new Response('ok');
}
