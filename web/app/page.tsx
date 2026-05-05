import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';
import { INDUSTRIES, CROSS_SKILLS, STEP_TITLES } from '@/lib/curriculum';

export default function HomePage() {
  return (
    <>
      <Nav />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand/5 blur-3xl" />
        </div>
        <Container className="pt-20 md:pt-28 pb-16 md:pb-24">
          <Badge>業種8 × 横断スキル4 = 完成までやり切るAIスクール</Badge>
          <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mt-6 leading-[0.95]">
            AIで <span className="text-brand">作って公開する</span><br/>力を、業務の真ん中に。
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink/70 max-w-2xl">
            業種別7レッスン × 横断4スキルで、プロンプトを覚えるだけで終わらない。
            自分のプロダクトを <strong>本物のURLで公開</strong> できるところまで導きます。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup" className="btn-primary">無料で診断を受ける</Link>
            <Link href="/courses" className="btn-ghost">カリキュラムを見る</Link>
          </div>
          <p className="mt-4 text-xs text-ink/50">クレカ不要 / 1分で開始 / Lesson 1-2 は完全無料</p>
        </Container>
      </section>

      {/* 価値提案：プロンプトじゃなくプロダクト */}
      <section className="bg-ink text-white">
        <Container className="py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'プロンプトを覚えない', d: '覚えたところで業務は変わらない。動くプロダクトを残すことだけを目的に学ぶ。' },
              { n: '02', t: '業種別の具体例で学ぶ', d: '飲食・小売・不動産…自分の業界の実例だけを抜き出して、最短で効く学習。' },
              { n: '03', t: '公開URLが残る', d: 'Vercel/Supabase もしくは Squarespace で、本物のお客様に見せられる作品を必ず1つ持って卒業。' }
            ].map((b)=>(
              <div key={b.n} className="border-l-4 border-brand pl-5">
                <div className="text-display text-5xl text-brand">{b.n}</div>
                <div className="text-2xl font-semibold mt-2">{b.t}</div>
                <p className="mt-3 text-white/70 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 業種マトリックス */}
      <section className="bg-bg-soft" style={{ background: '#F8F8F6' }}>
        <Container className="py-16 md:py-24">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <Badge>業種別コース</Badge>
              <h2 className="text-display text-4xl md:text-5xl mt-3">8業種 × 7レッスン</h2>
            </div>
            <Link href="/courses" className="text-brand font-semibold hover:underline">すべてのコース →</Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mt-10">
            {INDUSTRIES.map((i)=>(
              <Link key={i.id} href={`/courses/${i.id}`} className="card p-6 hover:-translate-y-0.5 transition group">
                <div className="text-3xl">{i.icon}</div>
                <div className="text-xl font-semibold mt-3">{i.title}</div>
                <div className="text-sm text-ink/60 mt-1">{i.subtitle}</div>
                <div className="mt-4 text-xs text-brand opacity-0 group-hover:opacity-100">7レッスン →</div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 横断スキル */}
      <section>
        <Container className="py-16 md:py-24">
          <Badge>横断スキルコース</Badge>
          <h2 className="text-display text-4xl md:text-5xl mt-3">作って売る人になる、4つの土台</h2>
          <p className="mt-4 text-ink/70 max-w-3xl">業種コースと並行して受講可。すべて成果物提出＋AI採点付き。</p>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {CROSS_SKILLS.map((c)=>(
              <Link key={c.id} href={`/courses/${c.id}`} className="card p-7 hover:shadow-lg transition flex items-start gap-5">
                <div className="text-4xl">{c.icon}</div>
                <div>
                  <div className="text-2xl font-semibold">{c.title}</div>
                  <div className="text-ink/60 mt-1">{c.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 7段ステップ */}
      <section className="bg-ink text-white">
        <Container className="py-16 md:py-24">
          <Badge className="bg-white/10 text-white">学習フロー</Badge>
          <h2 className="text-display text-4xl md:text-5xl mt-3">プロダクト完成までの7段</h2>
          <div className="grid md:grid-cols-7 gap-3 mt-10">
            {STEP_TITLES.map((t,i)=>(
              <div key={t} className="border-t-2 border-brand pt-4">
                <div className="text-display text-3xl text-brand">{String(i+1).padStart(2,'0')}</div>
                <div className="text-sm font-semibold mt-2">{t}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-white/70 max-w-3xl">レッスン6・7で、Vercel+Supabase または Squarespace で公開まで完了。受講生は卒業時に「公開URLを所有」している状態になります。</p>
        </Container>
      </section>

      {/* 公開ルート分岐 */}
      <section>
        <Container className="py-16 md:py-24">
          <Badge>公開ルートはあなたのレベルで分岐</Badge>
          <h2 className="text-display text-4xl md:text-5xl mt-3">どちらの道でも、ちゃんと公開URLが残る</h2>
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <div className="card p-7 border-2 border-ink/5">
              <Badge>Track A</Badge>
              <div className="text-2xl font-semibold mt-3">コーディング派</div>
              <div className="text-ink/70 mt-1">自分で更新したい / 技術に興味あり</div>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                <li>✓ Next.js テンプレ提供（業種別）</li>
                <li>✓ Supabase 接続コード自動生成</li>
                <li>✓ Vercel ワンクリックデプロイ</li>
                <li>✓ 独自ドメイン取得ガイド</li>
              </ul>
              <div className="text-xs text-ink/50 mt-5">推奨スタック: Next.js 15 + Supabase + Vercel</div>
            </div>
            <div className="card p-7 border-2 border-brand/30">
              <Badge>Track B</Badge>
              <div className="text-2xl font-semibold mt-3">ノーコード派</div>
              <div className="text-ink/70 mt-1">本業に集中したい / コードは書かない</div>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                <li>✓ Squarespace 業種別テンプレ</li>
                <li>✓ AIで生成したコピー・画像を流し込み</li>
                <li>✓ 独自ドメイン購入＆SSL自動</li>
                <li>✓ SEO設定 / GA連携ガイド</li>
              </ul>
              <div className="text-xs text-ink/50 mt-5">推奨スタック: Squarespace Business</div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="brand-slash">
        <Container className="py-20 text-white">
          <h3 className="text-display text-4xl md:text-6xl">今日、診断を受ける。<br/>3分で、あなたのコースが決まる。</h3>
          <Link href="/signup" className="btn-primary bg-white text-brand hover:bg-white/90 mt-8 inline-flex">無料で診断を受ける →</Link>
        </Container>
      </section>

      <Footer />
    </>
  );
}
