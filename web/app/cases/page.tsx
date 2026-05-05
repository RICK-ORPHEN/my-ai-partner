import { createClient } from '@/lib/supabase/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';
import Link from 'next/link';

export default async function CasesPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('student_products')
    .select('id, title, description, public_url, cover_image, ai_review_score, profiles:user_id(display_name, username)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(60);

  return (
    <>
      <Nav />
      <Container className="py-14">
        <Badge>受講生の作品</Badge>
        <h1 className="text-display text-5xl mt-3">作って公開した、本物の作品集</h1>
        <p className="text-ink/70 mt-3 max-w-3xl">プロンプトで終わらせない。実際に <strong>動く・見られる</strong> 作品だけを掲載しています。</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {(products ?? []).map((p:any)=>(
            <a key={p.id} href={p.public_url ?? '#'} target="_blank" rel="noopener" className="card p-5 hover:shadow-lg transition">
              <div className="text-lg font-semibold">{p.title}</div>
              <p className="text-sm text-ink/70 mt-2">{p.description}</p>
              <div className="text-xs text-ink/50 mt-3">by {p.profiles?.display_name}</div>
              {p.ai_review_score && <div className="text-xs text-brand mt-1">AIスコア {p.ai_review_score}/100</div>}
            </a>
          ))}
          {(!products || products.length === 0) && (
            <div className="card p-10 md:col-span-2 lg:col-span-3 text-center">
              <p className="text-ink/60">最初の作品が公開されるまでお待ちください。</p>
              <Link href="/signup" className="btn-primary mt-4 inline-flex">あなたが第1号になる</Link>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
}
