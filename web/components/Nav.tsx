import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export async function Nav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-ink/10">
      <div className="container-editorial flex items-center justify-between py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif font-bold text-lg tracking-tightest">My AI Partner</span>
          <span className="tag text-ink-mute mt-1">AI Product School</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium tracking-tight">
          <Link href="/courses" className="hover:text-vermilion transition-colors">コース一覧</Link>
          <Link href="/cases" className="hover:text-vermilion transition-colors">受講生の作品</Link>
          <Link href="/pricing" className="hover:text-vermilion transition-colors">料金プラン</Link>
          <Link href="#faq" className="hover:text-vermilion transition-colors">よくある質問</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard" className="btn-ghost py-2 px-4 text-[13px]">ダッシュボード</Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline text-[13px] hover:text-vermilion font-medium">ログイン</Link>
              <Link href="/signup" className="btn-primary py-2.5 px-5 text-[13px]">無料で体験する</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
