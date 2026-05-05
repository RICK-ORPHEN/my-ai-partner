import { createClient } from '@/lib/supabase/server';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import Link from 'next/link';

export default async function CasesPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('student_products')
    .select('id, title, description, public_url, ai_review_score, profiles:user_id(display_name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(60);

  return (
    <>
      <Nav />
      <Container className="pt-16 pb-12">
        <div className="flex items-center gap-4 text-ink-mute">
          <span className="tag text-vermilion">Student Works</span>
          <span className="h-px flex-1 bg-ink/20"/>
          <span className="tag">{products?.length ?? 0} Published</span>
        </div>
        <h1 className="h-display text-7xl md:text-9xl tracking-tightest leading-[0.88] mt-10 max-w-5xl">
          作って公開した、<br/>
          <span className="text-vermilion">本物の作品集</span>。
        </h1>
        <p className="font-serif text-2xl text-ink-soft mt-10 max-w-2xl leading-tight tracking-editorial">
          プロンプトで終わらせない。実際に動く・見られる作品だけを掲載。
        </p>
      </Container>

      <Container className="pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {(products ?? []).map((p:any, idx:number)=>(
            <a key={p.id} href={p.public_url ?? '#'} target="_blank" rel="noopener" className="group bg-cream hover:bg-paper p-7 transition-colors">
              <div className="tag text-ink-mute">Work {String(idx+1).padStart(3,'0')}</div>
              <div className="font-serif text-2xl mt-3 tracking-editorial">{p.title}</div>
              <p className="text-sm text-ink-soft mt-3 leading-relaxed">{p.description}</p>
              <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between text-xs">
                <span className="text-ink-mute">by {p.profiles?.display_name}</span>
                {p.ai_review_score && <span className="tag text-vermilion">AI {p.ai_review_score}/100</span>}
              </div>
            </a>
          ))}
          {(!products || products.length === 0) && (
            <div className="bg-cream p-14 md:col-span-2 lg:col-span-3 text-center">
              <div className="h-display text-4xl tracking-tightest">最初の作品が公開されるまで。</div>
              <Link href="/signup" className="btn-primary mt-6 inline-flex">あなたが第1号になる →</Link>
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
}
