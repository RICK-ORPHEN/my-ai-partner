'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconHome,
  IconBook,
  IconBox,
  IconLibrary,
  IconWallet,
  IconGear,
  IconLogout,
} from '@/components/icons/Lesson';

const NAV = [
  { href: '/dashboard',           label: 'ダッシュボード', Icon: IconHome },
  { href: '/dashboard/courses',   label: 'マイコース',     Icon: IconBook },
  { href: '/dashboard/products',  label: '私のプロダクト', Icon: IconBox },
  { href: '/dashboard/portfolio', label: 'ポートフォリオ', Icon: IconLibrary },
  { href: '/dashboard/billing',   label: '料金プラン',     Icon: IconWallet },
  { href: '/dashboard/settings',  label: '設定',           Icon: IconGear },
];

export function Sidebar({
  email,
  industry,
}: {
  email: string;
  industry: string | null;
}) {
  const pathname = usePathname();
  return (
    <aside
      className="hidden md:flex flex-col text-cream-50 sticky top-0 h-screen p-6"
      style={{ background: 'var(--ink)' }}
    >
      <Link href="/" className="block leading-tight">
        <div className="font-sans font-extrabold text-xl tracking-tight">MY AI</div>
        <div className="font-sans font-extrabold text-xl tracking-tight">PARTNER</div>
      </Link>

      <nav className="mt-10 space-y-1 flex-1">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active
                  ? 'bg-cream-50/10 text-cream-50 font-medium'
                  : 'text-cream-50/65 hover:bg-cream-50/5 hover:text-cream-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="jp-text">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 pt-5 border-t border-cream-50/10 text-sm space-y-2">
        <div className="text-cream-50/80 truncate text-xs">{email}</div>
        <div className="text-xs text-cream-50/40">業種: {industry ?? '未設定'}</div>
        <form action="/logout" method="post">
          <button className="text-xs text-cream-50/50 hover:text-cream-50 inline-flex items-center gap-1.5 transition">
            <IconLogout className="w-3 h-3" />
            ログアウト
          </button>
        </form>
      </div>
    </aside>
  );
}
