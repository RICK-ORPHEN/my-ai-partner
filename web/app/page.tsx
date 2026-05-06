import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="font-serif font-bold text-3xl md:text-5xl text-ink tracking-tight">
          My AI Partner
        </div>
        <div className="text-xs md:text-sm tracking-[0.2em] text-ink-mute mt-2 font-medium">
          AI PRODUCT SCHOOL
        </div>
        <div className="mt-12 text-sm text-ink-mute">準備中</div>
        {user && (
          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 text-sm font-medium transition"
          >
            ダッシュボードへ
          </Link>
        )}
      </div>
    </main>
  );
}
