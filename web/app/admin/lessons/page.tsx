import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminLessonsPage() {
  const supabase = await createClient();
  const { data: lessons } = await supabase.from('lessons').select('*, courses:course_id(title, kind)').order('course_id').order('step');
  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">レッスン管理</h1>
      <p className="text-ink/60 mt-2">{lessons?.length ?? 0}本のレッスン</p>
      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-ink/5"><tr>
            <th className="text-left px-4 py-3">コース</th>
            <th className="text-left px-4 py-3">STEP</th>
            <th className="text-left px-4 py-3">タイトル</th>
            <th className="text-left px-4 py-3">分</th>
            <th className="text-left px-4 py-3">公開Track</th>
            <th className="text-left px-4 py-3">アフィリ</th>
          </tr></thead>
          <tbody>
            {(lessons ?? []).map((l:any)=>(
              <tr key={l.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{l.courses?.title}</td>
                <td className="px-4 py-3">{l.step}</td>
                <td className="px-4 py-3">{l.title}</td>
                <td className="px-4 py-3">{l.duration_min}</td>
                <td className="px-4 py-3">{l.publishing_track ?? '-'}</td>
                <td className="px-4 py-3">{l.affiliate_link_target ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
