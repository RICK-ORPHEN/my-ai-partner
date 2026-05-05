import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Container } from '@/components/Container';

export default async function MyCoursesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('course_id, current_step, completed, courses:course_id(title, subtitle, kind)')
    .eq('user_id', user.id);

  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">マイコース</h1>
      <p className="text-ink/60 mt-2">受講中の全コース。続きはここから。</p>
      <div className="grid md:grid-cols-2 gap-5 mt-8">
        {(enrollments ?? []).map((e:any)=>(
          <Link key={e.course_id} href={`/courses/${e.course_id}`} className="card p-6 hover:shadow-lg">
            <div className="text-xs text-ink/50">{e.courses?.kind === 'industry' ? '業種別' : '横断スキル'}</div>
            <div className="text-xl font-semibold mt-1">{e.courses?.title}</div>
            <div className="text-sm text-ink/60 mt-1">{e.courses?.subtitle}</div>
            <div className="mt-4 text-sm text-ink/60">進捗: STEP {e.current_step}/7</div>
            <div className="h-1.5 bg-ink/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-brand" style={{ width: `${(e.current_step/7)*100}%` }} />
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
