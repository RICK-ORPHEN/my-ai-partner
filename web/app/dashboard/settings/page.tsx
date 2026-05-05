import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <Container className="py-10 max-w-2xl">
      <h1 className="text-display text-4xl">設定</h1>
      <form action="/api/profile/update" method="post" className="card p-7 mt-6 space-y-4">
        <label className="block text-sm font-semibold">表示名</label>
        <input name="display_name" defaultValue={profile?.display_name ?? ''} className="w-full border rounded-md px-4 py-3" />
        <label className="block text-sm font-semibold">業種</label>
        <input name="industry" defaultValue={profile?.industry ?? ''} className="w-full border rounded-md px-4 py-3" />
        <label className="block text-sm font-semibold">学習目標</label>
        <textarea name="goal" defaultValue={profile?.goal ?? ''} className="w-full border rounded-md px-4 py-3 min-h-[100px]" />
        <button className="btn-primary w-full">保存</button>
      </form>
    </Container>
  );
}
