import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from './Sidebar';

export const dynamic = 'force-dynamic';

const INDUSTRY_LABEL: Record<string, string> = {
  restaurant: '飲食',
  retail: '小売',
  realestate: '不動産',
  medical: '医療',
  legal: '士業',
  construction: '建設・製造',
  beauty: '美容',
  education: '教育',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('display_name, industry').eq('id', user.id).single();
  const industryLabel = INDUSTRY_LABEL[profile?.industry ?? ''] ?? null;

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]" style={{ background: '#F4F2EC' }}>
      <Sidebar email={user.email ?? ''} industry={industryLabel} />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
