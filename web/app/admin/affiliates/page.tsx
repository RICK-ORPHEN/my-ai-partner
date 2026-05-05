import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminAffiliatesPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('affiliate_events')
    .select('*, profiles:user_id(email)')
    .order('occurred_at', { ascending: false }).limit(200);

  const totals: Record<string, number> = {};
  (events ?? []).forEach(e => {
    totals[e.service] = (totals[e.service] ?? 0) + (e.amount_jpy ?? 0);
  });

  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">アフィリエイト</h1>
      <div className="grid md:grid-cols-3 gap-5 mt-8">
        {['vercel','supabase','squarespace'].map(s=>(
          <div key={s} className="card p-6">
            <div className="text-sm text-ink/60">{s}</div>
            <div className="text-2xl font-semibold mt-2">¥{(totals[s] ?? 0).toLocaleString('ja-JP')}</div>
          </div>
        ))}
      </div>
      <div className="card mt-8 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-ink/5"><tr>
            <th className="text-left px-4 py-3">日時</th>
            <th className="text-left px-4 py-3">ユーザー</th>
            <th className="text-left px-4 py-3">サービス</th>
            <th className="text-left px-4 py-3">イベント</th>
            <th className="text-left px-4 py-3">金額</th>
          </tr></thead>
          <tbody>
            {(events ?? []).map((e:any)=>(
              <tr key={e.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{new Date(e.occurred_at).toLocaleString('ja-JP')}</td>
                <td className="px-4 py-3">{e.profiles?.email ?? '-'}</td>
                <td className="px-4 py-3">{e.service}</td>
                <td className="px-4 py-3">{e.event_type}</td>
                <td className="px-4 py-3">¥{(e.amount_jpy ?? 0).toLocaleString('ja-JP')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
