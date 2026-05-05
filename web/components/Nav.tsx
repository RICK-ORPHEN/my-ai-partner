import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur border-b border-ink/10">
      <div className="container-editorial flex items-center justify-between py-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="h-display text-2xl tracking-tightest leading-none">My AI</span>
          <span className="h-display text-2xl tracking-tightest leading-none text-vermilion">Partner</span>
          <span className="tag text-ink-mute ml-2 hidden sm:inline">Vol.01 / 2026</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium tracking-tight">
          <Link href="/courses" className="hover:text-vermilion transition-colors">コース</Link>
          <Link href="/cases" className="hover:text-vermilion transition-colors">作品集</Link>
          <Link href="/pricing" className="hover:text-vermilion transition-colors">料金</Link>
          <Link href="/about" className="hover:text-vermilion transition-colors">私たち</Link>
        </nav>
        <div className="flex items-center gap-3 text-[13px]">
          {user ? (
            <Link href="/dashboard" className="btn-ghost py-2 px-4">ダッシュボード</Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline hover:text-vermilion font-medium">ログイン</Link>
              <Link href="/signup" className="btn-primary py-2.5 px-5">無料で始める</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
