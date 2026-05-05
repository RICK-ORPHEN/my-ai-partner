import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ count: users }, { count: subs }, { count: prods }, { count: pubs }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('subscription_tier','free'),
    supabase.from('student_products').select('*', { count: 'exact', head: true }),
    supabase.from('student_products').select('*', { count: 'exact', head: true }).eq('status','published')
  ]);
  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">管理ダッシュボード</h1>
      <div className="grid md:grid-cols-4 gap-5 mt-8">
        <Stat label="登録ユーザー" value={users ?? 0} />
        <Stat label="有料会員" value={subs ?? 0} />
        <Stat label="プロダクト" value={prods ?? 0} />
        <Stat label="公開済み" value={pubs ?? 0} />
      </div>
    </Container>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-6">
      <div className="text-sm text-ink/60">{label}</div>
      <div className="text-display text-5xl mt-2">{value}</div>
    </div>
  );
}
