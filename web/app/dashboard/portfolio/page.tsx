import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { IconLibrary, IconArrowRight } from '@/components/icons/Lesson';

export default async function PortfolioEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: portfolio } = await supabase.from('portfolios').select('*').eq('user_id', user.id).single();

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      <div className="mb-10">
        <div className="text-sm tracking-wide text-vermilion mb-2">ポートフォリオ</div>
        <h1 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight jp-balance">
          公開ポートフォリオの設定
        </h1>
        <p className="text-ink-mute mt-2 jp-text">
          作品を集めた公開ページを <code className="text-vermilion">/p/&#123;あなたのスラグ&#125;</code> で公開できます。
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,360px] gap-6">
        {/* Form */}
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
              <IconLibrary className="w-5 h-5" />
            </span>
            <h2 className="font-sans font-bold text-lg text-ink">公開ページ情報</h2>
          </div>
          <form action="/api/portfolio/save" method="post" className="space-y-5">
            <Field label="URL用のスラグ（半角英数字）" required>
              <input
                name="slug"
                defaultValue={portfolio?.slug ?? ''}
                required
                placeholder="例: rick-design"
                className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
              />
            </Field>
            <Field label="ヘッドライン">
              <input
                name="headline"
                defaultValue={portfolio?.headline ?? ''}
                placeholder="例: 飲食×AIで店舗を強くするデザイナー"
                className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
              />
            </Field>
            <Field label="自己紹介（Markdown対応）">
              <textarea
                name="intro_md"
                defaultValue={portfolio?.intro_md ?? ''}
                placeholder="自己紹介・実績・スキルなど"
                className="w-full rounded-xl border border-ink/15 bg-cream-50 px-4 py-3 text-sm min-h-[160px] focus:outline-none focus:ring-2 focus:ring-vermilion/30 focus:border-vermilion"
              />
            </Field>
            <label className="flex items-center gap-3 rounded-xl border border-ink/10 bg-cream-50 px-4 py-3 cursor-pointer">
              <input type="checkbox" name="is_public" defaultChecked={portfolio?.is_public ?? false} className="accent-vermilion" />
              <span className="text-sm text-ink jp-text">このページを公開する</span>
            </label>
            <button className="w-full inline-flex items-center justify-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition">
              保存する
              <IconArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 h-fit">
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-3">公開状態</div>
          {portfolio?.is_public && portfolio.slug ? (
            <>
              <div className="rounded-xl bg-vermilion/10 text-vermilion text-xs px-3 py-1.5 inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                公開中
              </div>
              <Link
                href={`/p/${portfolio.slug}`}
                className="block font-sans font-medium text-ink hover:text-vermilion transition truncate text-sm"
              >
                /p/{portfolio.slug}
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-ink/10 text-ink-mute text-xs px-3 py-1.5 inline-flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-mute" />
                非公開
              </div>
              <p className="text-sm text-ink-mute jp-text leading-relaxed">
                スラグを入力し、「公開する」にチェックして保存すると公開されます。
              </p>
            </>
          )}
        </div>
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
