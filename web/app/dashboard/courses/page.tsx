import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { IconBook, IconArrowRight, IconStorefront } from '@/components/icons/Lesson';

const KIND: Record<string, string> = {
  industry: '業種別',
  cross_skill: '横断スキル',
};

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, current_step, completed, courses:course_id(title, subtitle, kind)')
    .eq('user_id', user.id);

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-sm tracking-wide text-vermilion mb-2">マイコース</div>
          <h1 className="font-sans font-bold text-3xl md:text-4xl text-ink leading-tight jp-balance">
            受講中の全コース
          </h1>
          <p className="text-ink-mute mt-2 jp-text">続きはここから始められます。</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white hover:border-vermilion hover:text-vermilion transition px-5 py-2.5 text-sm font-medium"
        >
          コース一覧を見る
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {(!enrollments || enrollments.length === 0) ? (
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-10 text-center">
          <span className="inline-grid place-items-center w-16 h-16 rounded-full bg-vermilion/10 text-vermilion mb-4">
            <IconBook className="w-7 h-7" />
          </span>
          <h2 className="font-sans font-bold text-xl text-ink jp-balance mb-2">まだコースに登録していません</h2>
          <p className="text-ink-mute jp-text mb-5">業種別 8コースと横断スキル 4コースから選べます。</p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition"
          >
            コース一覧へ
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {enrollments.map((e: any) => (
            <Link
              key={e.course_id}
              href={`/courses/${e.course_id}`}
              className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 hover:border-vermilion/30 transition group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="shrink-0 w-16 h-16 rounded-2xl grid place-items-center text-vermilion"
                  style={{ background: 'var(--ink)' }}
                >
                  <IconStorefront className="w-7 h-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-ink-mute uppercase tracking-wider">
                    {KIND[e.courses?.kind ?? ''] ?? 'コース'}
                  </div>
                  <div className="font-sans font-bold text-xl text-ink mt-0.5 jp-balance">
                    {e.courses?.title}
                  </div>
                  {e.courses?.subtitle && (
                    <p className="text-sm text-ink-mute mt-1 jp-text leading-relaxed">{e.courses.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-ink-mute mb-2">
                  <span>進捗 STEP {e.current_step} / 7</span>
                  <span className="font-medium text-vermilion">
                    {Math.round((e.current_step / 7) * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-cream-50 rounded-full overflow-hidden border border-ink/5">
                  <div
                    className="h-full bg-vermilion rounded-full transition-all"
                    style={{ width: `${(e.current_step / 7) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm text-vermilion group-hover:text-ink transition">
                続きから始める
                <IconArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
