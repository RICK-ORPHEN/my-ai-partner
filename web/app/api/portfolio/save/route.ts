import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export const runtime = 'nodejs';
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));
  const fd = await req.formData();
  const slug = (fd.get('slug') ?? '').toString().toLowerCase().replace(/[^a-z0-9_-]/g,'');
  if (!slug) return NextResponse.redirect(new URL('/dashboard/portfolio?err=slug', req.url));
  const headline = (fd.get('headline') ?? '').toString();
  const intro_md = (fd.get('intro_md') ?? '').toString();
  const is_public = !!fd.get('is_public');
  await supabase.from('portfolios').upsert({
    user_id: user.id, slug, headline, intro_md, is_public
  });
  return NextResponse.redirect(new URL('/dashboard/portfolio?saved=1', req.url));
}
