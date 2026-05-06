import { Container } from '@/components/Container';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { LessonReader } from './LessonReader';
import Link from 'next/link';

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

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/lesson/${lesson}`);

  const [{ data: l }, { data: profile }] = await Promise.all([
    supabase.from('lessons').select('*, courses:course_id(title, kind)').eq('id', lesson).single(),
    supabase.from('profiles').select('display_name, industry, goal, learner_track').eq('id', user.id).single(),
  ]);
  if (!l) notFound();

  await supabase.from('lesson_progress').upsert({
    user_id: user.id,
    lesson_id: lesson,
    status: 'in_progress',
    started_at: new Date().toISOString(),
  });

  const body = (l.body ?? {}) as Record<string, unknown>;
  const courseTitle = l.courses?.title ?? '';
  const lessonTitle = l.title.includes(' — ') ? l.title.split(' — ')[1] : l.title;
  const stepNum = l.step;

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Top bar */}
      <header className="border-b border-ink/10" style={{ background: 'var(--ink)' }}>
        <div className="container-editorial py-3 flex items-center justify-between text-cream-50">
          <Link href={`/courses/${l.course_id}`} className="text-sm text-cream-50/70 hover:text-cream-50 tag inline-flex items-center gap-2">
            ← {courseTitle}
          </Link>
          <ProgressDots current={stepNum} total={7} />
        </div>
      </header>

      {/* Hero — compact, visual */}
      <Container className="pt-10 md:pt-14 pb-8 max-w-editorial">
        <div className="grid md:grid-cols-[auto,1fr,auto] gap-6 md:gap-10 items-center">
          {/* Big step number */}
          <div className="shrink-0">
            <div className="relative w-24 h-24 md:w-32 md:h-32 grid place-items-center border-2 border-vermilion">
              <span className="font-serif font-bold text-vermilion leading-none" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                {String(stepNum).padStart(2, '0')}
              </span>
              <span className="absolute -top-3 left-2 px-2 py-0.5 text-[10px] tracking-widest bg-cream text-vermilion border border-vermilion">STEP</span>
              <span className="absolute -bottom-3 right-2 px-2 py-0.5 text-[10px] tracking-widest bg-cream text-ink-mute border border-ink/30">/ 7</span>
            </div>
          </div>

          {/* Title block */}
          <div className="min-w-0">
            <div className="tag text-vermilion mb-3">{courseTitle}</div>
            <h1 className="h-display jp-balance text-ink leading-[1.05]" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}>
              {lessonTitle}
            </h1>
            {body.tldr ? (
              <p className="mt-4 text-base md:text-lg text-ink-soft jp-text leading-[1.8] max-w-measure">
                {String(body.tldr)}
              </p>
            ) : null}
          </div>

          {/* Persona chip */}
          <div className="hidden md:block shrink-0">
            <div className="border border-ink/15 p-4 min-w-[180px]">
              <div className="tag text-ink-mute mb-2">FOR YOU</div>
              <div className="font-serif text-lg text-ink leading-tight jp-balance">
                {profile?.display_name ?? 'You'}
              </div>
              <div className="text-xs text-ink-mute mt-1 jp-text">
                {INDUSTRY_LABEL[profile?.industry ?? ''] ?? '一般'}
                {profile?.goal ? ` · ${(profile.goal as string).slice(0, 14)}` : ''}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <LessonReader
        lessonId={lesson}
        body={body}
        affiliateTarget={l.affiliate_link_target}
        profile={{
          display_name: profile?.display_name ?? null,
          industry: profile?.industry ?? null,
          goal: profile?.goal ?? null,
          learner_track: profile?.learner_track ?? null,
        }}
      />
    </div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => {
        const passed = i < current - 1;
        const active = i === current - 1;
        return (
          <span
            key={i}
            className={`h-1 transition-all ${
              active ? 'w-6 bg-vermilion' : passed ? 'w-3 bg-cream-50/70' : 'w-3 bg-cream-50/20'
            }`}
          />
        );
      })}
      <span className="ml-2 text-xs text-cream-50/70 tag">
        {current}/{total}
      </span>
    </div>
  );
}
