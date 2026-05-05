import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';
import Link from 'next/link';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: p } = await supabase.from('student_products').select('*').eq('id', id).eq('user_id', user.id).single();
  if (!p) return <Container className="py-10">プロダクトが見つかりません</Container>;
  return (
    <Container className="py-10 max-w-3xl">
      <Link href="/dashboard/products" className="text-sm text-ink/60 hover:text-brand">← 戻る</Link>
      <h1 className="text-display text-4xl mt-4">{p.title}</h1>
      <p className="text-ink/70 mt-2">{p.description}</p>
      <div className="card p-6 mt-6 space-y-3">
        <div><b>ステータス:</b> {p.status}</div>
        <div><b>公開ルート:</b> {p.publish_track ?? '未指定'}</div>
        {p.public_url && <div><b>公開URL:</b> <a href={p.public_url} target="_blank" rel="noopener" className="text-brand underline">{p.public_url}</a></div>}
        {p.github_url && <div><b>GitHub:</b> <a href={p.github_url} target="_blank" rel="noopener" className="text-brand underline">{p.github_url}</a></div>}
      </div>
      <form action={`/api/products/${p.id}/review`} method="post" className="mt-6">
        <button className="btn-primary">AIにレビューしてもらう</button>
      </form>
      {p.ai_review_md && (
        <div className="card p-6 mt-6">
          <h3 className="font-semibold mb-2">AIレビュー（{p.ai_review_score}/100）</h3>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">{p.ai_review_md}</div>
        </div>
      )}
    </Container>
  );
}
