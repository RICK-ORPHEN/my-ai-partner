import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  IconBook,
  IconRocket,
  IconSearch,
  IconArrowRight,
  IconStorefront,
  IconNext,
  IconPlay,
  IconBox,
  IconChart,
} from '@/components/icons/Lesson';

const COURSE_KIND_LABEL: Record<string, string> = {
  industry: '業種別',
  cross_skill: '横断スキル',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, current_step, completed, courses:course_id(title, kind)')
    .eq('user_id', user.id);

  const { data: products } = await supabase
    .from('student_products')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(3);

  const { data: scores } = await supabase
    .from('ai_scores')
    .select('score, scored_at, submission_id, submissions:submission_id(lesson_id, lessons:lesson_id(title))')
    .order('scored_at', { ascending: false })
    .limit(5);

  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'You';
  const publishedCount = products?.filter((p: any) => p.status === 'published').length ?? 0;
  const recentScore = scores?.[0]?.score;
  const primaryEnrollment = enrollments?.[0] as any;

  // next lesson title
  let nextLessonTitle = 'STEP 1: 課題発見ワーク';
  let nextLessonId: string | undefined;
  let nextLessonSummary = 'あなたのビジネスの課題を整理しましょう。';
  if (primaryEnrollment) {
    const { data: nl } = await supabase
      .from('lessons')
      .select('id, step, title, summary')
      .eq('course_id', primaryEnrollment.course_id)
      .eq('step', primaryEnrollment.current_step)
      .single();
    if (nl) {
      nextLessonId = nl.id;
      nextLessonTitle = `STEP ${nl.step}: ${nl.title.includes(' — ') ? nl.title.split(' — ')[1] : nl.title}`;
      nextLessonSummary = nl.summary ?? nextLessonSummary;
    }
  }

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      {/* Hero */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
        <div>
          <div className="text-sm tracking-wide text-vermilion mb-2">ダッシュボード</div>
          <h1 className="font-sans font-bold text-3xl md:text-[40px] text-ink leading-tight jp-balance">
            こんにちは、{displayName}さん
          </h1>
          <p className="text-ink-mute mt-2 jp-text">今日の一歩から、あなたのプロダクトが始まります。</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition"
        >
          コースを進める
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="受講中コース"
          value={String(enrollments?.length ?? 0)}
          unit="コース"
          link="/dashboard/courses"
          linkLabel="マイコースを見る"
          Icon={IconBook}
        />
        <StatCard
          label="公開済プロダクト"
          value={String(publishedCount)}
          unit="件"
          link="/dashboard/products"
          linkLabel="私のプロダクトを見る"
          Icon={IconRocket}
        />
        <StatCard
          label="直近のAI採点"
          value={recentScore != null ? String(recentScore) : '—'}
          unit="/100"
          link="/dashboard/products"
          linkLabel="詳細を確認する"
          Icon={IconSearch}
        />
      </div>

      {/* Course progress + Next lesson */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        {/* Course in progress */}
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
              <IconBook className="w-5 h-5" />
            </span>
            <h2 className="font-sans font-bold text-lg text-ink">受講中のコース</h2>
          </div>
          {primaryEnrollment ? (
            <>
              <div className="flex items-center gap-4">
                <div
                  className="shrink-0 w-20 h-20 rounded-2xl grid place-items-center text-vermilion"
                  style={{ background: 'var(--ink)' }}
                >
                  <IconStorefront className="w-9 h-9" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-ink-mute uppercase tracking-wider">
                    {COURSE_KIND_LABEL[primaryEnrollment.courses?.kind ?? ''] ?? 'コース'}
                  </div>
                  <div className="font-sans font-bold text-xl text-ink mt-0.5 jp-balance">
                    {primaryEnrollment.courses?.title}
                  </div>
                  <div className="text-sm text-ink-mute mt-2">
                    進捗: STEP {primaryEnrollment.current_step} / 7
                  </div>
                  <div className="h-2 bg-cream-50 rounded-full mt-2 overflow-hidden border border-ink/5">
                    <div
                      className="h-full bg-vermilion rounded-full transition-all"
                      style={{ width: `${(primaryEnrollment.current_step / 7) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Link
                href={`/courses/${primaryEnrollment.course_id}`}
                className="mt-5 block text-center rounded-xl border border-ink/10 hover:border-vermilion hover:text-vermilion transition py-3 text-sm font-medium"
              >
                <span className="inline-flex items-center gap-1.5">
                  コースを続ける
                  <IconArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </>
          ) : (
            <EmptyState
              text="まだコースに登録していません。"
              ctaLabel="コース一覧へ"
              ctaHref="/courses"
            />
          )}
        </div>

        {/* Next lesson */}
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
              <IconPlay className="w-5 h-5" />
            </span>
            <h2 className="font-sans font-bold text-lg text-ink">次のレッスン</h2>
          </div>
          <div className="font-sans font-bold text-xl text-ink jp-balance">{nextLessonTitle}</div>
          <p className="text-sm text-ink-mute mt-2 jp-text leading-relaxed">{nextLessonSummary}</p>
          <Link
            href={nextLessonId ? `/lesson/${nextLessonId}` : '/courses'}
            className="mt-5 inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-5 py-2.5 font-medium transition"
          >
            レッスンを始める
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* My recent products */}
      <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-8 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
            <IconBox className="w-5 h-5" />
          </span>
          <h2 className="font-sans font-bold text-lg text-ink">私の最近のプロダクト</h2>
        </div>
        {products && products.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {products.map((p: any) => (
              <Link
                key={p.id}
                href={`/dashboard/products/${p.id}`}
                className="rounded-2xl bg-cream-50 border border-ink/5 p-5 hover:border-vermilion/30 hover:shadow-card transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-vermilion bg-vermilion/10 rounded-full px-2.5 py-1">
                    {p.status}
                  </span>
                  {p.ai_review_score && (
                    <span className="text-xs text-ink-mute">AI採点 {p.ai_review_score}/100</span>
                  )}
                </div>
                <div className="font-sans font-semibold text-base text-ink jp-balance mb-1">{p.title}</div>
                {p.description && (
                  <p className="text-xs text-ink-mute jp-text leading-relaxed line-clamp-2">{p.description}</p>
                )}
                {p.public_url && (
                  <div className="mt-3 text-xs text-vermilion truncate">{p.public_url}</div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr,auto] gap-6 items-center py-6">
            <div className="text-center md:text-left">
              <p className="text-ink jp-text leading-relaxed">まだプロダクトを作っていません。</p>
              <p className="text-sm text-ink-mute mt-1 jp-text">レッスン6まで進めると公開できます。</p>
              <Link
                href="/courses"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-vermilion text-vermilion hover:bg-vermilion hover:text-cream-50 px-5 py-2.5 text-sm font-medium transition"
              >
                コースを進めてプロダクトを作る
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <EmptyBoxIllustration />
          </div>
        )}
      </div>

      {/* AI scores history */}
      {scores && scores.length > 0 && (
        <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
              <IconChart className="w-5 h-5" />
            </span>
            <h2 className="font-sans font-bold text-lg text-ink">AI採点ヒストリー</h2>
          </div>
          <div className="divide-y divide-ink/5">
            {scores.map((s: any) => (
              <div key={s.scored_at} className="py-3 flex items-center justify-between gap-4">
                <div className="text-sm text-ink jp-text min-w-0 truncate">
                  {s.submissions?.lessons?.title ?? s.submissions?.lesson_id}
                </div>
                <div className="font-sans font-bold text-2xl text-vermilion shrink-0">
                  {s.score}
                  <span className="text-sm text-ink-mute font-normal ml-0.5">/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  link,
  linkLabel,
  Icon,
}: {
  label: string;
  value: string;
  unit: string;
  link: string;
  linkLabel: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6">
      <div className="flex items-center gap-4">
        <span className="shrink-0 w-14 h-14 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
          <Icon className="w-6 h-6" />
        </span>
        <div className="min-w-0">
          <div className="text-sm text-ink-mute jp-text">{label}</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-sans font-bold text-3xl md:text-4xl text-ink leading-none">{value}</span>
            <span className="text-sm text-ink-mute">{unit}</span>
          </div>
        </div>
      </div>
      <Link
        href={link}
        className="mt-4 inline-flex items-center gap-1.5 text-sm text-vermilion hover:text-ink transition"
      >
        {linkLabel}
        <IconNext className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function EmptyState({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string;
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div className="text-center py-6">
      <p className="text-ink jp-text">{text}</p>
      <Link
        href={ctaHref}
        className="mt-4 inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-5 py-2.5 text-sm font-medium transition"
      >
        {ctaLabel}
        <IconArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function EmptyBoxIllustration() {
  return (
    <svg
      viewBox="0 0 220 160"
      className="w-44 h-32 md:w-56 md:h-40 mx-auto md:mx-0"
      aria-hidden
    >
      <defs>
        <linearGradient id="boxFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F8C9BD" stopOpacity="0.6" />
          <stop offset="1" stopColor="#F8C9BD" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <ellipse cx="110" cy="140" rx="80" ry="6" fill="rgba(6,14,49,0.08)" />
      <path d="M40 60 L110 38 L180 60 L180 130 L110 152 L40 130 Z" fill="url(#boxFill)" stroke="#D3300A" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M40 60 L110 82 L180 60 M110 82 L110 152" stroke="#D3300A" strokeWidth="1.5" fill="none" />
      <path d="M70 50 L110 64 L150 50 L150 56 L110 70 L70 56 Z" fill="#D3300A" opacity="0.3" />
      <path d="M30 30 q 8 -8 18 -4 M170 28 q 6 -10 16 -6" stroke="#D3300A" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.6" />
      <circle cx="200" cy="40" r="3" fill="#D3300A" opacity="0.4" />
      <circle cx="20" cy="80" r="2.5" fill="#D3300A" opacity="0.4" />
      <path d="M195 25 l-3 3 3 3 3 -3 z M25 50 l-3 3 3 3 3 -3 z" fill="#D3300A" opacity="0.5" />
    </svg>
  );
}
