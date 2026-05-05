import { Container } from '@/components/Container';
import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { LessonChat } from './LessonChat';
import Link from 'next/link';

export default async function LessonPage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/lesson/${lesson}`);

  const { data: l } = await supabase.from('lessons').select('*, courses:course_id(title, kind)').eq('id', lesson).single();
  if (!l) notFound();

  // ensure progress row
  await supabase.from('lesson_progress').upsert({ user_id: user.id, lesson_id: lesson, status: 'in_progress', started_at: new Date().toISOString() });

  return (
    <div className="min-h-screen bg-bg-soft" style={{ background:'#F8F8F6' }}>
      <header className="bg-ink text-white px-6 py-4 flex items-center justify-between">
        <Link href={`/courses/${l.course_id}`} className="text-sm text-white/70 hover:text-white">← {l.courses?.title}</Link>
        <div className="text-sm text-white/70">STEP {l.step} / 7</div>
      </header>
      <Container className="py-10 max-w-4xl">
        <div className="text-display text-4xl">{l.title}</div>
        <p className="text-ink/70 mt-2">{l.summary}</p>
        <div className="card p-6 mt-8">
          <h3 className="font-semibold">このレッスンで身につくこと</h3>
          <ul className="mt-3 list-disc pl-5 text-ink/80 space-y-1">
            {(l.body?.objectives ?? []).map((o: string)=>(<li key={o}>{o}</li>))}
          </ul>
        </div>
        <LessonChat lessonId={lesson} script={l.body?.chat_script ?? []} deliverable={l.body?.deliverable ?? '成果物を提出'} affiliateTarget={l.affiliate_link_target} />
      </Container>
    </div>
  );
}
