import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('student_products')
    .select('*, profiles:user_id(email, display_name)')
    .order('updated_at', { ascending: false }).limit(100);
  return (
    <Container className="py-10">
      <h1 className="text-display text-4xl">プロダクト</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {(products ?? []).map((p:any)=>(
          <div key={p.id} className="card p-5">
            <div className="text-xs uppercase text-ink/50">{p.status}</div>
            <div className="text-lg font-semibold mt-1">{p.title}</div>
            <div className="text-xs text-ink/60 mt-1">by {p.profiles?.email}</div>
            <div className="text-xs text-ink/50 mt-2">{p.publish_track}</div>
            {p.public_url && <a target="_blank" rel="noopener" className="text-xs text-brand mt-2 block truncate" href={p.public_url}>{p.public_url}</a>}
            {p.ai_review_score && <div className="text-xs text-ink/60 mt-2">AIスコア {p.ai_review_score}/100</div>}
          </div>
        ))}
      </div>
    </Container>
  );
}
