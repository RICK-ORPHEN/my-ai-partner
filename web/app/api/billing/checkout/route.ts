import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));

  const fd = await req.formData();
  const plan = (fd.get('plan') ?? 'monthly') as string;
  const priceMap: Record<string,string|undefined> = {
    monthly: process.env.STRIPE_PRICE_MONTHLY,
    yearly:  process.env.STRIPE_PRICE_YEARLY,
    team:    process.env.STRIPE_PRICE_TEAM
  };
  const price = priceMap[plan];
  if (!price) return NextResponse.json({ error: 'plan_not_configured' }, { status: 400 });

  const session = await stripe().checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email!,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?ok=1`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing?cancel=1`,
    metadata: { user_id: user.id, plan }
  });
  return NextResponse.redirect(session.url!, { status: 303 });
}
