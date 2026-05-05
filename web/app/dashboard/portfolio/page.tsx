import { createClient } from '@/lib/supabase/server';
import { Container } from '@/components/Container';
import Link from 'next/link';

export default async function PortfolioEditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: portfolio } = await supabase.from('portfolios').select('*').eq('user_id', user.id).single();
  return (
    <Container className="py-10 max-w-2xl">
      <h1 className="text-display text-4xl">ポートフォリオ設定</h1>
      <p className="text-ink/70 mt-2">作品を集めた公開ページを <code>/p/{`{username}`}</code> で公開できます。</p>
      <form action="/api/portfolio/save" method="post" className="card p-7 mt-6 space-y-4">
        <input name="slug" defaultValue={portfolio?.slug ?? ''} className="w-full border rounded-md px-4 py-3" placeholder="URL用のスラグ（半角英数字）" required />
        <input name="headline" defaultValue={portfolio?.headline ?? ''} className="w-full border rounded-md px-4 py-3" placeholder="ヘッドライン" />
        <textarea name="intro_md" defaultValue={portfolio?.intro_md ?? ''} className="w-full border rounded-md px-4 py-3 min-h-[140px]" placeholder="自己紹介（Markdown対応）" />
        <label className="flex items-center gap-3">
          <input type="checkbox" name="is_public" defaultChecked={portfolio?.is_public ?? false} />
          <span>公開する</span>
        </label>
        <button className="btn-primary w-full">保存</button>
      </form>
      {portfolio?.is_public && portfolio.slug && (
        <div className="mt-6 text-sm">
          公開URL: <Link className="text-brand" href={`/p/${portfolio.slug}`}>/p/{portfolio.slug}</Link>
        </div>
      )}
    </Container>
  );
}
