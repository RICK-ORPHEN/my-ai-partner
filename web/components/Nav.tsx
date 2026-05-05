import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="border-b border-ink/5 bg-white/90 backdrop-blur sticky top-0 z-30">
      <nav className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-display text-2xl text-brand">MY AI</span>
          <span className="text-display text-2xl">PARTNER</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/courses" className="hover:text-brand">コース</Link>
          <Link href="/pricing" className="hover:text-brand">料金</Link>
          <Link href="/cases" className="hover:text-brand">受講生の作品</Link>
          <Link href="/about" className="hover:text-brand">私たち</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm py-2">ダッシュボード</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-brand">ログイン</Link>
              <Link href="/signup" className="btn-primary text-sm py-2">無料で始める</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
