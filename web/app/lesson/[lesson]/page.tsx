import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { LessonShell } from './LessonShell';
import { LessonReader } from './LessonReader';

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
    supabase.from('profiles').select('display_name, email, industry, goal, learner_track').eq('id', user.id).single(),
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
  const industryLabel = INDUSTRY_LABEL[profile?.industry ?? ''] ?? null;

  return (
    <LessonShell
      user={{
        display_name: profile?.display_name ?? null,
        email: user.email ?? null,
        industry: industryLabel,
      }}
    >
      <LessonReader
        lessonId={lesson}
        body={body}
        affiliateTarget={l.affiliate_link_target}
        meta={{
          courseId: l.course_id,
          courseTitle,
          lessonTitle,
          step: l.step,
        }}
        profile={{
          display_name: profile?.display_name ?? null,
          industry: profile?.industry ?? null,
          industryLabel,
          goal: profile?.goal ?? null,
          learner_track: profile?.learner_track ?? null,
        }}
      />
    </LessonShell>
  );
}
