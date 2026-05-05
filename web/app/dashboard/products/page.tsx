import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: products } = await supabase.from('student_products').select('*').eq('user_id', user.id).order('updated_at', { ascending: false });

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-display text-4xl">私のプロダクト</h1>
        <Link href="/dashboard/products/new" className="btn-primary">新規プロダクト</Link>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {(products ?? []).map(p=>(
          <Link key={p.id} href={`/dashboard/products/${p.id}`} className="card p-5 hover:shadow-lg transition">
            <div className="text-xs uppercase text-ink/50">{p.status}</div>
            <div className="text-lg font-semibold mt-1">{p.title}</div>
            <div className="text-sm text-ink/60 mt-1">{p.description}</div>
            {p.public_url && <div className="text-xs text-brand mt-3 truncate">{p.public_url}</div>}
            {p.ai_review_score && <div className="text-xs text-ink/60 mt-2">AIレビュー: {p.ai_review_score}/100</div>}
          </Link>
        ))}
        {(!products || products.length === 0) && (
          <div className="card p-8 text-center md:col-span-2 lg:col-span-3">
            <p className="text-ink/70">プロダクトはまだありません。</p>
          </div>
        )}
      </div>
    </Container>
  );
}
