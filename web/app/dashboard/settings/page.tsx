import { createClient } from '@/lib/supabase/server';
import { IconGear, IconArrowRight } from '@/components/icons/Lesson';

const INDUSTRIES = [
  ['restaurant', '飲食'],
  ['retail', '小売'],
  ['realestate', '不動産'],
  ['medical', '医療'],
  ['legal', '士業'],
  ['construction', '建設・製造'],
  ['beauty', '美容'],
  ['education', '教育'],
];

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      <div className="mb-10">
        <div className="text-sm tracking-wide text-vermilion mb-2">設定</div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight jp-balance">
          プロフィール設定
        </h1>
        <p className="text-ink-mute mt-2 jp-text">登録した情報はAIコーチが自動で活用します（同じ質問は二度されません）。</p>
      </div>

      <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
            <IconGear className="w-5 h-5" />
          </span>
          <h2 className="font-sans font-bold text-lg text-ink">あなたについて</h2>
        </div>
        <form action="/api/profile/update" method="post" className="space-y-5">
          <Field label="表示名" required>
            <input
              name="display_name"
              defaultValue={profile?.display_name ?? ''}
              required
              className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
            />
          </Field>
          <Field label="業種">
            <select
              name="industry"
              defaultValue={profile?.industry ?? ''}
              className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
            >
              <option value="">未設定</option>
              {INDUSTRIES.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="学習目標">
            <textarea
              name="goal"
              defaultValue={profile?.goal ?? ''}
              placeholder="例: 自店舗の予約システムをノーコードで作って公開する"
              className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
            />
          </Field>
          <button className="w-full inline-flex items-center justify-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition">
            保存する
            <IconArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-ink mb-2">
        {label}
        {required && <span className="text-vermilion ml-1">*</span>}
      </div>
      {children}
    </label>
  );
}
