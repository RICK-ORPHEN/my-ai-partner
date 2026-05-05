import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');
  const { data: profile } = await supabase.from('profiles').select('is_admin, display_name').eq('id', user.id).single();
  if (!profile?.is_admin) redirect('/dashboard');

  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-ink text-white p-6 sticky top-0 h-screen hidden md:block">
        <div className="text-display text-2xl text-brand">ADMIN</div>
        <div className="mt-8 space-y-1 text-sm">
          {[
            ['/admin','概要'],
            ['/admin/users','ユーザー'],
            ['/admin/lessons','レッスン'],
            ['/admin/products','プロダクト'],
            ['/admin/scores','AI採点ログ'],
            ['/admin/affiliates','アフィリエイト']
          ].map(([h,l])=>(
            <Link key={h} href={h} className="block px-3 py-2 rounded-md hover:bg-white/10">{l}</Link>
          ))}
        </div>
      </aside>
      <main style={{ background:'#F8F8F6' }}>{children}</main>
    </div>
  );
}
