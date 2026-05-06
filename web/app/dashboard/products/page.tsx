import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { IconBox, IconArrowRight } from '@/components/icons/Lesson';

const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-ink/10 text-ink-mute',
  reviewing: 'bg-cobalt/10 text-cobalt',
  published: 'bg-vermilion/10 text-vermilion',
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: products } = await supabase
    .from('student_products')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-sm tracking-wide text-vermilion mb-2">私のプロダクト</div>
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight jp-balance">
            あなたが作った成果物
          </h1>
          <p className="text-ink-mute mt-2 jp-text">公開URLとして世に出せる作品を集めましょう。</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition"
        >
          新規プロダクト
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {(!products || products.length === 0) ? (
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-10 text-center">
          <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-vermilion/10 text-vermilion mb-4">
            <IconBox className="w-7 h-7" />
          </span>
          <h2 className="font-sans font-bold text-xl text-ink jp-balance mb-2">まだプロダクトがありません</h2>
          <p className="text-ink-mute jp-text mb-5">レッスン6まで進めると公開できます。</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition"
          >
            コースを進める
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/products/${p.id}`}
              className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 hover:border-vermilion/30 transition group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 ${STATUS_COLORS[p.status] ?? 'bg-ink/10 text-ink-mute'}`}>
                  {p.status}
                </span>
                {p.ai_review_score && (
                  <span className="text-xs text-ink-mute">AI採点 {p.ai_review_score}/100</span>
                )}
              </div>
              <div className="font-sans font-bold text-lg text-ink jp-balance mb-2">{p.title}</div>
              {p.description && (
                <p className="text-sm text-ink-mute jp-text leading-relaxed line-clamp-3">{p.description}</p>
              )}
              {p.public_url && (
                <div className="mt-4 text-xs text-vermilion truncate">{p.public_url}</div>
              )}
              <div className="mt-4 pt-4 border-t border-ink/5 inline-flex items-center gap-1.5 text-sm text-ink-mute group-hover:text-vermilion transition">
                編集する
                <IconArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
