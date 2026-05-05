import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <Container className="py-10 max-w-2xl">
      <h1 className="text-display text-4xl">料金プラン</h1>
      <div className="card p-7 mt-6">
        <div className="text-sm text-ink/60">現在のプラン</div>
        <div className="text-2xl font-semibold mt-1">{profile?.subscription_tier ?? 'free'}</div>
        {profile?.current_period_end && <div className="text-xs text-ink/50 mt-1">次回更新: {new Date(profile.current_period_end).toLocaleDateString('ja-JP')}</div>}
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        <form action="/api/billing/checkout" method="post" className="card p-6">
          <input type="hidden" name="plan" value="monthly" />
          <div className="font-semibold">月額プラン</div>
          <div className="text-3xl font-semibold mt-2">¥9,800<span className="text-sm text-ink/50">/月</span></div>
          <button className="btn-primary w-full mt-5">月額を始める</button>
        </form>
        <form action="/api/billing/checkout" method="post" className="card p-6 border-2 border-brand/30">
          <input type="hidden" name="plan" value="yearly" />
          <div className="font-semibold">年額プラン（推奨）</div>
          <div className="text-3xl font-semibold mt-2">¥98,000<span className="text-sm text-ink/50">/年</span></div>
          <div className="text-xs text-brand mt-1">2ヶ月分お得 + ポートフォリオ公開</div>
          <button className="btn-primary w-full mt-5">年額を始める</button>
        </form>
      </div>
      <form action="/api/billing/portal" method="post" className="mt-6">
        <button className="btn-ghost w-full">支払い設定を管理</button>
      </form>
    </Container>
  );
}
