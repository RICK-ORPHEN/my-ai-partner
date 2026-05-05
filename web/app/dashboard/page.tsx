import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';

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

  return (
    <Container className="py-10">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <Badge>ダッシュボード</Badge>
          <h1 className="text-display text-4xl mt-2">こんにちは、{profile?.display_name ?? user.email?.split('@')[0]}さん</h1>
          <p className="text-ink/60 mt-1">今日の一歩から、あなたのプロダクトが始まります。</p>
        </div>
        <Link href="/courses" className="btn-primary">コースを進める</Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-10">
        <div className="card p-6">
          <div className="text-sm text-ink/60">受講中コース</div>
          <div className="text-3xl font-semibold mt-2">{enrollments?.length ?? 0}</div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-ink/60">公開済プロダクト</div>
          <div className="text-3xl font-semibold mt-2">
            {products?.filter(p=>p.status==='published').length ?? 0}
          </div>
        </div>
        <div className="card p-6">
          <div className="text-sm text-ink/60">直近のAI採点</div>
          <div className="text-3xl font-semibold mt-2">
            {scores?.[0]?.score ?? '—'}<span className="text-base text-ink/40">/100</span>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-5">マイコース</h2>
        {(!enrollments || enrollments.length === 0) ? (
          <div className="card p-8 text-center">
            <p className="text-ink/70">まだコースに登録していません。</p>
            <Link href="/courses" className="btn-primary mt-4 inline-flex">コース一覧へ</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {enrollments.map((e:any)=>(
              <Link key={e.course_id} href={`/courses/${e.course_id}`} className="card p-6 hover:shadow-lg transition">
                <div className="text-xs text-ink/50">{e.courses?.kind === 'industry' ? '業種別' : '横断スキル'}</div>
                <div className="text-xl font-semibold mt-1">{e.courses?.title}</div>
                <div className="mt-4 text-sm text-ink/60">進捗: STEP {e.current_step} / 7</div>
                <div className="h-1.5 bg-ink/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-brand" style={{ width: `${(e.current_step/7)*100}%` }} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-5">私の最近のプロダクト</h2>
        {(!products || products.length === 0) ? (
          <div className="card p-8 text-center">
            <p className="text-ink/70">まだプロダクトを作っていません。レッスン6まで進めると公開できます。</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {products.map(p=>(
              <Link key={p.id} href={`/dashboard/products/${p.id}`} className="card p-5 hover:shadow-lg transition">
                <div className="text-xs text-ink/50 uppercase">{p.status}</div>
                <div className="text-lg font-semibold mt-1">{p.title}</div>
                {p.public_url && <div className="text-xs text-brand mt-2 truncate">{p.public_url}</div>}
              </Link>
            ))}
          </div>
        )}
      </section>

      {scores && scores.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-5">AI採点ヒストリー</h2>
          <div className="card p-6 divide-y divide-ink/5">
            {scores.map((s:any)=>(
              <div key={s.scored_at} className="py-3 flex items-center justify-between">
                <div className="text-sm">{s.submissions?.lessons?.title ?? s.submissions?.lesson_id}</div>
                <div className="text-2xl font-semibold text-brand">{s.score}<span className="text-sm text-ink/40">/100</span></div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
