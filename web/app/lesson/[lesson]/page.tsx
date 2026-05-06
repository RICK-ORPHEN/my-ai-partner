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

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      <header className="border-b border-ink/10" style={{ background: 'var(--ink)' }}>
        <div className="container-editorial py-4 flex items-center justify-between text-cream-50">
          <Link href={`/courses/${l.course_id}`} className="text-sm text-cream-50/70 hover:text-cream-50 tag">
            ← {courseTitle}
          </Link>
          <div className="tag text-cream-50/70">STEP {l.step} / 7</div>
        </div>
      </header>

      {/* Lesson masthead */}
      <Container className="pt-16 md:pt-20 pb-10 max-w-editorial">
        <div className="grid-12 items-end">
          <div className="col-span-12 md:col-span-9">
            <div className="tag text-vermilion mb-5">
              Lesson {String(l.step).padStart(2, '0')} · {courseTitle}
            </div>
            <h1
              className="h-display jp-balance text-ink"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.6rem)' }}
            >
              {lessonTitle}
            </h1>
            {body.tldr ? (
              <p className="mt-7 text-lg md:text-xl text-ink-soft jp-text leading-[1.85] max-w-measure">
                {String(body.tldr)}
              </p>
            ) : null}
          </div>
          <div className="col-span-12 md:col-span-3 hidden md:block">
            <div className="rule-thick mb-3" />
            <div className="tag text-ink-mute mb-2">For</div>
            <div className="font-serif text-2xl text-ink leading-tight jp-balance">
              {profile?.display_name ?? 'You'}
            </div>
            <div className="text-sm text-ink-mute mt-1 jp-text">
              {INDUSTRY_LABEL[profile?.industry ?? ''] ?? profile?.industry ?? ''}
              {profile?.goal ? ` · ${profile.goal}` : ''}
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
