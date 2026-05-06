import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex flex-col leading-[1.05]">
          <span className="font-serif font-bold text-xl text-ink tracking-tight">My AI Partner</span>
          <span className="text-[10px] tracking-[0.18em] text-ink-mute mt-0.5 font-medium">AI PRODUCT SCHOOL</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink">
          <Link href="#about" className="hover:text-vermilion transition-colors">About</Link>
          <Link href="#curriculum" className="hover:text-vermilion transition-colors">Curriculum</Link>
          <Link href="#works" className="hover:text-vermilion transition-colors">Works</Link>
          <Link href="#voice" className="hover:text-vermilion transition-colors">Voice</Link>
          <Link href="#faq" className="hover:text-vermilion transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="inline-flex items-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-5 py-2.5 text-sm font-medium transition">
              ダッシュボード
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline text-sm text-ink hover:text-vermilion font-medium">ログイン</Link>
              <Link href="/signup" className="inline-flex items-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-5 py-2.5 text-sm font-medium transition">
                無料で体験する
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
