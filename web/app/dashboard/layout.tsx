import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
      <aside className="bg-ink text-white p-6 sticky top-0 h-screen hidden md:block">
        <Link href="/" className="block">
          <div className="text-display text-2xl text-brand">MY AI</div>
          <div className="text-display text-2xl">PARTNER</div>
        </Link>
        <div className="mt-10 space-y-1">
          {[
            { href: '/dashboard',           label: '概要' },
            { href: '/dashboard/courses',   label: 'マイコース' },
            { href: '/dashboard/products',  label: '私のプロダクト' },
            { href: '/dashboard/portfolio', label: 'ポートフォリオ' },
            { href: '/dashboard/billing',   label: '料金プラン' },
            { href: '/dashboard/settings',  label: '設定' }
          ].map(i=>(
            <Link key={i.href} href={i.href} className="block px-3 py-2 rounded-md hover:bg-white/10 text-sm">{i.label}</Link>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-sm">
          <div className="text-white/60">{profile?.display_name ?? user.email}</div>
          <div className="text-xs text-white/40 mt-1">業種: {profile?.industry ?? '未設定'}</div>
          <form action="/logout" method="post">
            <button className="text-xs text-white/50 mt-3 hover:text-white">ログアウト</button>
          </form>
        </div>
      </aside>
      <main className="bg-bg-soft" style={{ background: '#F8F8F6' }}>{children}</main>
    </div>
  );
}
