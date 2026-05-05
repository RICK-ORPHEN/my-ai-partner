import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  const fd = await req.formData();
  await supabase.from('profiles').update({
    display_name: (fd.get('display_name') ?? '').toString() || null,
    industry: (fd.get('industry') ?? '').toString() || null,
    goal: (fd.get('goal') ?? '').toString() || null
  }).eq('id', user.id);
  return NextResponse.redirect(new URL('/dashboard/settings?saved=1', req.url));
}
