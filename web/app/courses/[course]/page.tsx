import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconStorefront,
  IconRocket,
} from '@/components/icons/Lesson';

const KIND_LABEL: Record<string, string> = {
  industry: '業種別コース',
  cross_skill: '横断スキルコース',
};

export default async function CourseDetail({ params }: { params: Promise<{ course: string }> }) {
  const { course } = await params;
  const supabase = await createClient();
  const { data: c } = await supabase.from('courses').select('*').eq('id', course).single();
  if (!c) notFound();
  const { data: lessons } = await supabase.from('lessons').select('*').eq('course_id', course).order('step');

  const { data: { user } } = await supabase.auth.getUser();
  let enrollment: any = null;
  let progress: any[] = [];
  if (user) {
    const e1 = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course)
      .maybeSingle();
    enrollment = e1.data;
    const lp = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .in('lesson_id', (lessons ?? []).map((l) => l.id));
    progress = lp.data ?? [];
  }
  const total = lessons?.length ?? 7;
  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <>
      <Nav />
      <main style={{ background: '#F4F2EC' }} className="min-h-screen">
        <div className="px-6 md:px-10 py-10 md:py-14 max-w-[1200px] mx-auto">
          {/* Hero card */}
          <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-10 mb-8">
            <div className="grid md:grid-cols-[auto,1fr,auto] gap-6 items-start">
              <div
                className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl grid place-items-center text-vermilion"
                style={{ background: 'var(--ink)' }}
              >
                <IconStorefront className="w-10 h-10 md:w-12 md:h-12" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 text-xs text-vermilion bg-vermilion/10 rounded-full px-3 py-1 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
                  {KIND_LABEL[c.kind] ?? 'コース'}
                </div>
                <h1 className="font-sans font-bold text-3xl md:text-[40px] text-ink leading-tight jp-balance">
                  {c.title}
                </h1>
                {c.subtitle && (
                  <p className="text-ink-mute mt-3 jp-text leading-relaxed max-w-2xl">{c.subtitle}</p>
                )}
              </div>
              <div className="md:text-right">
                {user ? (
                  <form action={`/api/enroll/${course}`} method="post">
                    <button className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition">
                      {enrollment ? 'コースを続ける' : '受講登録（無料体験）'}
                      <IconArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition"
                  >
                    無料で受講開始
                    <IconArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {enrollment && (
              <div className="mt-7 pt-6 border-t border-ink/5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-ink-mute">進捗</span>
                  <span className="font-medium text-vermilion">
                    {completedCount} / {total} レッスン完了 · {pct}%
                  </span>
                </div>
                <div className="h-2.5 bg-cream-50 rounded-full overflow-hidden border border-ink/5">
                  <div
                    className="h-full bg-vermilion rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lessons grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {(lessons ?? []).map((l: any) => {
              const p = progress.find((pp) => pp.lesson_id === l.id);
              const completed = p?.status === 'completed';
              const inProgress = p?.status === 'in_progress';
              const lessonTitle = l.title.includes(' — ') ? l.title.split(' — ')[1] : l.title;
              return (
                <Link
                  key={l.id}
                  href={`/lesson/${l.id}`}
                  className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 hover:border-vermilion/30 transition group"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-12 h-12 grid place-items-center rounded-full font-sans font-bold text-sm ${
                          completed
                            ? 'bg-vermilion text-cream-50'
                            : inProgress
                            ? 'bg-vermilion/10 text-vermilion border border-vermilion'
                            : 'bg-cream-50 text-ink-mute border border-ink/10'
                        }`}
                      >
                        {completed ? <IconCheck className="w-5 h-5" /> : String(l.step).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-ink-mute">
                          STEP {String(l.step).padStart(2, '0')}
                        </div>
                        {completed && (
                          <div className="text-[10px] text-vermilion uppercase tracking-wider">完了</div>
                        )}
                        {inProgress && (
                          <div className="text-[10px] text-vermilion uppercase tracking-wider">受講中</div>
                        )}
                      </div>
                    </div>
                    {l.affiliate_link_target && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-vermilion bg-vermilion/10 rounded-full px-2.5 py-1">
                        <IconRocket className="w-3 h-3" />
                        公開ステップ
                      </span>
                    )}
                  </div>
                  <div className="font-sans font-bold text-lg text-ink jp-balance leading-snug mb-2">
                    {lessonTitle}
                  </div>
                  {l.summary && (
                    <p className="text-sm text-ink-mute jp-text leading-relaxed line-clamp-2">{l.summary}</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-ink/5 flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-1.5 text-ink-mute">
                      <IconClock className="w-3.5 h-3.5" />
                      所要 {l.duration_min}分
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-vermilion group-hover:translate-x-0.5 transition-transform">
                      開く
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
