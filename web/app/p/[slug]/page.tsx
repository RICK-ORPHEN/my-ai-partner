import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Container } from '@/components/Container';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

export default async function PublicPortfolio({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: portfolio } = await supabase.from('portfolios').select('*, profiles:user_id(display_name, avatar_url, industry, username)').eq('slug', slug).eq('is_public', true).single();
  if (!portfolio) notFound();
  const { data: products } = await supabase.from('student_products').select('*').eq('user_id', portfolio.user_id).eq('status', 'published').order('published_at', { ascending: false });

  const profile: any = portfolio.profiles;

  return (
    <>
      <Nav />
      <Container className="py-14">
        <div className="text-display text-5xl text-brand">{portfolio.headline ?? profile?.display_name}</div>
        <div className="text-ink/60 mt-2">{profile?.display_name} · {profile?.industry ?? ''}</div>
        {portfolio.intro_md && (
          <div className="prose prose-sm max-w-3xl whitespace-pre-wrap mt-6">{portfolio.intro_md}</div>
        )}
        <h2 className="text-display text-3xl mt-14">公開済プロダクト</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {(products ?? []).map(p=>(
            <a key={p.id} href={p.public_url ?? '#'} target="_blank" rel="noopener" className="card p-6 hover:shadow-lg transition">
              <div className="font-semibold text-xl">{p.title}</div>
              <p className="text-sm text-ink/70 mt-2">{p.description}</p>
              {p.public_url && <div className="text-xs text-brand mt-3 truncate">{p.public_url}</div>}
              {p.ai_review_score && <div className="text-xs text-ink/50 mt-2">AIレビュー: {p.ai_review_score}/100</div>}
            </a>
          ))}
          {(!products || products.length === 0) && <p className="text-ink/60">公開作品はまだありません。</p>}
        </div>
      </Container>
      <Footer />
    </>
  );
}
