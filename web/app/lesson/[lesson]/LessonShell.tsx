'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconObjectives,
  IconBook,
  IconLayer,
  IconLibrary,
  IconSubmission,
  IconUser,
  IconNext,
} from '@/components/icons/Lesson';

const NAV = [
  { href: '/dashboard',           label: 'ダッシュボード', Icon: IconLayer },
  { href: '/dashboard/courses',   label: 'マイコース',     Icon: IconBook },
  { href: '/dashboard/products',  label: '私のプロダクト', Icon: IconObjectives },
  { href: '/dashboard/portfolio', label: 'ポートフォリオ', Icon: IconLibrary },
  { href: '/dashboard/billing',   label: '料金プラン',     Icon: IconSubmission },
  { href: '/dashboard/settings',  label: '設定',           Icon: IconUser },
];

export function LessonShell({
  user,
  children,
}: {
  user: { display_name: string | null; email: string | null; industry: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]" style={{ background: '#F4F2EC' }}>
      <aside className="hidden md:flex flex-col text-cream-50 sticky top-0 h-screen p-6" style={{ background: 'var(--ink)' }}>
        <Link href="/" className="block leading-tight">
          <div className="font-serif text-2xl font-bold tracking-tight">MY AI</div>
          <div className="font-serif text-2xl font-bold tracking-tight">PARTNER</div>
        </Link>
        <nav className="mt-10 space-y-1 flex-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? 'bg-cream-50/10 text-cream-50' : 'text-cream-50/70 hover:bg-cream-50/5 hover:text-cream-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="jp-text">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-6 pt-5 border-t border-cream-50/10 text-sm">
          <div className="text-cream-50/80 truncate">{user.email ?? user.display_name}</div>
          <div className="text-xs text-cream-50/40 mt-1">業種: {user.industry ?? '未設定'}</div>
          <form action="/logout" method="post" className="mt-3">
            <button className="text-xs text-cream-50/50 hover:text-cream-50 inline-flex items-center gap-1.5">
              <IconNext className="w-3 h-3" />
              ログアウト
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
