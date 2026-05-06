import { createClient } from '@/lib/supabase/server';
import { IconWallet, IconCheck, IconArrowRight } from '@/components/icons/Lesson';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const tier = profile?.subscription_tier ?? 'free';

  const PLANS = [
    {
      id: 'monthly',
      label: '月額プラン',
      price: '¥9,800',
      unit: '/月',
      note: 'いつでも解約OK',
      features: ['全コースアクセス', 'AI採点無制限', 'ポートフォリオ公開', '全プロンプトライブラリ'],
      recommended: false,
    },
    {
      id: 'yearly',
      label: '年額プラン',
      price: '¥98,000',
      unit: '/年',
      note: '2ヶ月分お得',
      features: ['月額の全特典', '年額分割払い相当', '優先サポート', 'コミュニティ参加'],
      recommended: true,
    },
  ];

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      <div className="mb-10">
        <div className="text-sm tracking-wide text-vermilion mb-2">料金プラン</div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight jp-balance">
          あなたに合ったプランを
        </h1>
        <p className="text-ink-mute mt-2 jp-text">いつでも変更・解約できます。</p>
      </div>

      {/* Current plan */}
      <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 mb-8 grid md:grid-cols-[auto,1fr,auto] gap-5 items-center">
        <span className="w-14 h-14 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
          <IconWallet className="w-6 h-6" />
        </span>
        <div>
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-1">現在のプラン</div>
          <div className="font-sans font-bold text-2xl text-ink">{tier.toUpperCase()}</div>
          {profile?.current_period_end && (
            <div className="text-xs text-ink-mute mt-1">
              次回更新: {new Date(profile.current_period_end).toLocaleDateString('ja-JP')}
            </div>
          )}
        </div>
        <form action="/api/billing/portal" method="post">
          <button className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white hover:border-vermilion hover:text-vermilion transition px-5 py-2.5 text-sm font-medium">
            支払い設定を管理
            <IconArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {PLANS.map((p) => (
          <form
            key={p.id}
            action="/api/billing/checkout"
            method="post"
            className={`relative rounded-2xl bg-white shadow-card p-7 ${
              p.recommended ? 'border-2 border-vermilion' : 'border border-ink/5'
            }`}
          >
            {p.recommended && (
              <span className="absolute -top-3 left-7 inline-flex items-center gap-1.5 bg-vermilion text-cream-50 text-[10px] uppercase tracking-wider rounded-full px-3 py-1">
                おすすめ
              </span>
            )}
            <input type="hidden" name="plan" value={p.id} />
            <div className="text-sm text-ink-mute mb-1 jp-text">{p.label}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-sans font-bold text-4xl text-ink">{p.price}</span>
              <span className="text-sm text-ink-mute">{p.unit}</span>
            </div>
            <div className="text-xs text-vermilion mb-5">{p.note}</div>
            <ul className="space-y-2 mb-6">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink jp-text">
                  <IconCheck className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full inline-flex items-center justify-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition">
              {p.label}を始める
              <IconArrowRight className="w-4 h-4" />
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
