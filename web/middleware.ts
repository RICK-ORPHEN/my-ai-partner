import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookies) { cookies.forEach((c) => res.cookies.set(c.name, c.value, c.options)); }
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;
  const isProtected = path.startsWith('/dashboard') || path.startsWith('/lesson') || path.startsWith('/portfolio/edit') || path.startsWith('/admin');
  if (!user && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }
  if (path.startsWith('/admin') && user) {
    // additional admin guard handled in page itself (read profile.is_admin)
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health|api/stripe/webhook).*)']
};
