import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    const e1 = await supabase.from('enrollments').select('*').eq('user_id', user.id).eq('course_id', course).maybeSingle();
    enrollment = e1.data;
    const lp = await supabase.from('lesson_progress').select('*').eq('user_id', user.id).in('lesson_id', (lessons ?? []).map(l=>l.id));
    progress = lp.data ?? [];
  }
  const completedCount = progress.filter(p=>p.status==='completed').length;

  return (
    <>
      <Nav />
      <Container className="py-12">
        <Badge>{c.kind === 'industry' ? '業種別コース' : '横断スキルコース'}</Badge>
        <h1 className="text-display text-5xl mt-3">{c.title}</h1>
        <p className="text-ink/70 mt-3 max-w-3xl">{c.subtitle}</p>

        {user ? (
          <form action={`/api/enroll/${course}`} method="post" className="mt-6">
            <button className="btn-primary">{enrollment ? 'コースを続ける' : '受講登録（無料体験）'}</button>
          </form>
        ) : (
          <Link href="/signup" className="btn-primary mt-6 inline-flex">無料で受講開始</Link>
        )}

        {enrollment && (
          <div className="mt-6 text-sm text-ink/60">進捗: {completedCount}/7 レッスン完了</div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {(lessons ?? []).map(l=>{
            const p = progress.find(pp=>pp.lesson_id===l.id);
            const completed = p?.status==='completed';
            return (
              <Link key={l.id} href={`/lesson/${l.id}`} className={`card p-6 hover:shadow-lg ${completed?'opacity-80':''}`}>
                <div className="text-display text-3xl text-brand">STEP {String(l.step).padStart(2,'0')}</div>
                <div className="text-xl font-semibold mt-2">{l.title}</div>
                <div className="text-sm text-ink/60 mt-2">{l.summary}</div>
                <div className="mt-3 text-xs text-ink/50">所要 {l.duration_min}分 {completed && '✓ 完了'}</div>
                {l.affiliate_link_target && <div className="mt-2 text-xs text-brand">公開ステップ ({l.affiliate_link_target})</div>}
              </Link>
            );
          })}
        </div>
      </Container>
      <Footer />
    </>
  );
}
