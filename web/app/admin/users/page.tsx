import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const supabase = await createClient();
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);
  if (q) query = query.ilike('email', `%${q}%`);
  const { data: users } = await query;
  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">ユーザー</h1>
      <form className="mt-4">
        <input name="q" defaultValue={q} placeholder="メールで検索" className="border rounded-md px-4 py-2 w-80" />
      </form>
      <div className="card mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-ink/5"><tr>
            <th className="text-left px-4 py-3">Email</th>
            <th className="text-left px-4 py-3">業種</th>
            <th className="text-left px-4 py-3">Track</th>
            <th className="text-left px-4 py-3">プラン</th>
            <th className="text-left px-4 py-3">登録日</th>
          </tr></thead>
          <tbody>
            {(users ?? []).map(u=>(
              <tr key={u.id} className="border-t border-ink/5">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.industry ?? '-'}</td>
                <td className="px-4 py-3">{u.learner_track}</td>
                <td className="px-4 py-3">{u.subscription_tier}</td>
                <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString('ja-JP')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  );
}
