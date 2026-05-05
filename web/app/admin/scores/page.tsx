import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminScoresPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ai_scores')
    .select('id, score, scored_at, scored_by, submission_id, submissions:submission_id(lesson_id, user_id, profiles:user_id(email))')
    .order('scored_at', { ascending: false }).limit(100);
  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">AI採点ログ</h1>
      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-ink/5"><tr>
            <th className="text-left px-4 py-3">日時</th>
            <th className="text-left px-4 py-3">受講生</th>
            <th className="text-left px-4 py-3">レッスン</th>
            <th className="text-left px-4 py-3">スコア</th>
          </tr></thead>
          <tbody>
            {(data ?? []).map((s:any)=>(
              <tr key={s.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{new Date(s.scored_at).toLocaleString('ja-JP')}</td>
                <td className="px-4 py-3">{s.submissions?.profiles?.email}</td>
                <td className="px-4 py-3">{s.submissions?.lesson_id}</td>
                <td className="px-4 py-3 font-semibold text-brand">{s.score}/100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
