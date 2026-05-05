import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { INDUSTRIES, CROSS_SKILLS } from '@/lib/curriculum';
import { INDUSTRY_ICONS } from '@/components/icons/Industries';
import { CROSS_SKILL_ICONS } from '@/components/icons/CrossSkills';
import { IconIdea, IconBuild, IconPublish, IconOwn } from '@/components/icons/ValueFlow';
import { IconStar } from '@/components/icons/Star';

const SEVEN_STEPS = [
  { n: '01', t: 'AI活用入門',         dur: '60min' },
  { n: '02', t: 'プロンプト基礎',     dur: '60min' },
  { n: '03', t: 'データ整理・自動化', dur: '90min' },
  { n: '04', t: '顧客対応自動化',     dur: '90min' },
  { n: '05', t: 'コンテンツ生成',     dur: '90min' },
  { n: '06', t: '業務システム制作', dur: '120min' },
  { n: '07', t: '公開・運用',         dur: '60min' }
];

const PORTFOLIO_SAMPLES = [
  { img: '/images/lp/portfolio_realestate.png', title: '不動産LP',                 score: 94 },
  { img: '/images/lp/portfolio_restaurant.png', title: '飲食店予約システム',       score: 91 },
  { img: '/images/lp/portfolio_beauty.png',     title: '美容サロンサイト',         score: 93 },
  { img: '/images/lp/portfolio_linebot.png',    title: 'LINE Bot 予約',            score: 90 },
  { img: '/images/lp/portfolio_dashboard.png',  title: '業務自動化ダッシュボード', score: 92 },
  { img: '/images/lp/portfolio_education.png',  title: '教育メディアサイト',       score: 88 }
];

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ============================================================
           HERO — Full-bleed BG photo with left gradient fade
         ============================================================ */}
      <section className="relative bg-cream overflow-hidden">
        {/* BG photo full bleed */}
        <div className="absolute inset-0">
          <Image src="/images/lp/kv_full_v3.png" alt="" fill priority className="object-cover editorial-img" sizes="100vw"/>
          <div className="absolute inset-0 kv-mask"/>
        </div>

        {/* Hero content */}
        <Container className="relative pt-16 md:pt-20 pb-16 md:pb-24 min-h-[640px] md:min-h-[720px] flex items-center">
          <div className="grid md:grid-cols-12 w-full">
            <div className="md:col-span-7 lg:col-span-6">
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-ink-mute mb-6">
                <span className="tag">Issue No.01</span>
                <span className="tag">Vol.01</span>
                <span className="tag">2026 Tokyo</span>
              </div>

              <h1 className="h-display text-[16vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw] leading-[0.9] tracking-tightest text-ink jp-text">
                My AI<br/>Partner
              </h1>

              <h2 className="h-display text-2xl md:text-3xl lg:text-4xl mt-7 leading-[1.2] tracking-tightest jp-balance">
                学ぶのではなく、<span className="text-vermilion">作って公開する。</span>
              </h2>

              <p className="text-ink-soft text-sm md:text-base mt-6 max-w-[42ch] leading-relaxed jp-balance">
                プロンプトを覚えるだけのスクールはもう要らない。動いて、見せられて、使われるものを作る。それだけが私たちの目的です。
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link href="/signup" className="btn-primary text-[14px] py-3.5 px-7">
                  無料で始める（クレカ不要）
                </Link>
                <Link href="/courses" className="text-[13px] text-ink-soft hover:text-vermilion font-medium underline-offset-4 hover:underline">
                  Lesson 1-2 完全無料体験 →
                </Link>
              </div>
            </div>
          </div>

          {/* Floating dark badge */}
          <div className="hidden md:flex absolute right-6 lg:right-12 bottom-12 lg:bottom-16 w-44 h-44 rounded-full bg-ink text-cream-50 flex-col items-center justify-center text-center p-4 shadow-page">
            <div className="font-serif font-bold text-base leading-tight">公開URL保証</div>
            <div className="w-12 h-px bg-cream-50/35 my-2.5"/>
            <div className="font-serif text-sm leading-tight">ポートフォリオ所有</div>
            <div className="w-12 h-px bg-cream-50/35 my-2.5"/>
            <div className="tag text-vermilion">AI採点付き</div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           VALUE FLOW — IDEA → BUILD → PUBLISH → OWN
         ============================================================ */}
      <section className="border-y border-ink/10 bg-paper">
        <Container className="py-12 md:py-14">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-5">
              <div className="font-serif text-xl md:text-2xl tracking-editorial leading-snug jp-balance">
                プロンプトを覚える時代は終わった。<br/>
                ここは、<span className="text-vermilion">プロダクトを作る場所。</span>
              </div>
            </div>
            <div className="md:col-span-7">
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {[
                  { Icon: IconIdea,    en: 'IDEA',    ja: '考える' },
                  { Icon: IconBuild,   en: 'BUILD',   ja: '作る' },
                  { Icon: IconPublish, en: 'PUBLISH', ja: '公開する' },
                  { Icon: IconOwn,     en: 'OWN',     ja: '自分の資産に' }
                ].map((s, i) => (
                  <div key={s.en} className="relative flex flex-col items-center text-center">
                    <s.Icon className="w-9 h-9 md:w-11 md:h-11 text-ink"/>
                    <div className="tag mt-3 text-vermilion">{s.en}</div>
                    <div className="text-[11px] md:text-xs mt-1 text-ink-soft">{s.ja}</div>
                    {i < 3 && <div className="absolute top-4 md:top-5 -right-2 md:-right-3 text-ink/30 text-base md:text-lg">→</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           CURRICULUM — 3 column dense
         ============================================================ */}
      <section>
        <div className="border-b border-ink/10">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Curriculum</span>
            <span className="h-px flex-1 bg-ink/15"/>
            <span className="tag text-ink-mute">Section 01</span>
          </Container>
        </div>
        <Container className="py-14 md:py-20">

          <h2 className="h-display text-3xl md:text-5xl tracking-tightest leading-[1.1] mb-12 max-w-3xl jp-balance">
            業種 × スキルの二軸で、実務に直結する<span className="text-vermilion">全84レッスン。</span>
          </h2>

          <div className="grid md:grid-cols-12 gap-10 md:gap-12">
            <div className="md:col-span-4">
              <div className="tag text-ink-mute mb-6">8つの業種コース</div>
              <div className="grid grid-cols-4 gap-y-7 gap-x-2">
                {INDUSTRIES.map(i=>{
                  const Icon = INDUSTRY_ICONS[i.id];
                  return (
                    <Link key={i.id} href={`/courses/${i.id}`} className="flex flex-col items-center text-center group">
                      <Icon className="w-8 h-8 text-ink group-hover:text-vermilion transition-colors"/>
                      <div className="text-xs text-ink-soft mt-2 group-hover:text-vermilion transition-colors">{i.title}</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="tag text-ink-mute mb-6">7つのステップで、必ず公開できる。</div>
              <div className="border-t border-ink/15">
                {SEVEN_STEPS.map(s=>(
                  <div key={s.n} className="grid grid-cols-12 gap-2 py-3.5 border-b border-ink/10 items-baseline">
                    <span className="col-span-2 md:col-span-1 font-serif text-sm font-bold text-ink">{s.n}</span>
                    <span className="col-span-7 md:col-span-8 text-[13px] text-ink-soft">{s.t}</span>
                    <span className="col-span-3 flex items-center gap-1.5 justify-end">
                      <span className="hidden md:inline-block flex-1 border-b border-dotted border-ink/20 mb-1"/>
                      <span className="tag text-ink-mute">{s.dur}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="tag text-ink-mute mb-6">4つの横断スキルコース</div>
              <ul className="space-y-5">
                {CROSS_SKILLS.map(c=>{
                  const Icon = CROSS_SKILL_ICONS[c.id];
                  return (
                    <li key={c.id}>
                      <Link href={`/courses/${c.id}`} className="flex items-start gap-3 group">
                        <div className="w-9 h-9 border border-ink/15 flex items-center justify-center group-hover:border-vermilion group-hover:text-vermilion transition-colors flex-shrink-0">
                          <Icon className="w-5 h-5"/>
                        </div>
                        <div>
                          <div className="font-serif text-sm tracking-editorial group-hover:text-vermilion transition-colors">{c.title}</div>
                          <div className="text-[11px] text-ink-mute mt-0.5 jp-text">{c.subtitle}</div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           COURSE TRACK — A vs B
         ============================================================ */}
      <section className="bg-paper">
        <div className="border-y border-ink/10">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Course Track</span>
            <span className="h-px flex-1 bg-ink/15"/>
            <span className="tag text-ink-mute">Section 02</span>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <h2 className="h-display text-3xl md:text-5xl tracking-tightest leading-[1.1] mb-10 jp-balance">
            自分に合うルートで、<span className="text-vermilion">必ず公開できる。</span>
          </h2>

          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-span-5 bg-ink text-cream-50 p-7 md:p-8">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-xl font-bold">Track A</span>
                <span className="tag text-cream-50/70">コーディング派</span>
              </div>
              <p className="text-cream-50/70 text-sm leading-relaxed mb-5 jp-text">自分で更新したい / 技術に興味がある方</p>
              <div className="flex items-center gap-4 mb-5 text-cream-50/85">
                <span className="text-xs font-semibold tracking-wide">Next.js</span>
                <span className="opacity-30">/</span>
                <span className="text-xs font-semibold tracking-wide">Supabase</span>
                <span className="opacity-30">/</span>
                <span className="text-xs font-semibold tracking-wide">Vercel</span>
              </div>
              <ul className="space-y-2.5 text-sm border-t border-cream-50/15 pt-4">
                {['Next.js テンプレ提供','Supabase 接続コード自動生成','Vercel ワンクリックデプロイ'].map(f=>(
                  <li key={f} className="flex gap-2.5 items-baseline jp-text">
                    <span className="text-vermilion">✓</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="relative aspect-[16/10] mt-6 overflow-hidden">
                <Image src="/images/lp/track_a.png" alt="" fill className="object-cover editorial-img" sizes="(min-width:768px) 40vw, 100vw"/>
              </div>
            </div>

            <div className="md:col-span-5 bg-cream p-7 md:p-8 border border-ink/10">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-serif text-xl font-bold">Track B</span>
                <span className="tag text-ink-mute">ノーコード派</span>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed mb-5 jp-text">本業に集中したい / コードは書かない方</p>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-bold tracking-wide">SQUARESPACE</span>
              </div>
              <ul className="space-y-2.5 text-sm border-t border-ink/10 pt-4">
                {['業種別テンプレート','AI生成コピー・画像を流し込み','公開までノーコードで完結'].map(f=>(
                  <li key={f} className="flex gap-2.5 items-baseline jp-text">
                    <span className="text-vermilion">✓</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="relative aspect-[16/10] mt-6 overflow-hidden">
                <Image src="/images/lp/track_b.png" alt="" fill className="object-cover editorial-img" sizes="(min-width:768px) 40vw, 100vw"/>
              </div>
            </div>

            <div className="md:col-span-2 space-y-7">
              {[
                { t:'独自ドメイン取得',   d:'オリジナルドメインで信頼性を確保' },
                { t:'SEO設定サポート',   d:'検索に強いサイト構造を構築' },
                { t:'効果計測ガイド',     d:'アクセス解析・改善までサポート' }
              ].map(s=>(
                <div key={s.t} className="border-t border-ink/15 pt-4">
                  <div className="font-serif text-sm font-bold tracking-editorial">{s.t}</div>
                  <div className="text-[11px] text-ink-mute mt-1.5 leading-relaxed jp-text">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           AI GRADING — sample only (no certificate)
         ============================================================ */}
      <section>
        <div className="border-b border-ink/10">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">AI Grading</span>
            <span className="h-px flex-1 bg-ink/15"/>
            <span className="tag text-ink-mute">Section 03</span>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="md:col-span-4">
              <h2 className="h-display text-3xl md:text-4xl tracking-tightest leading-[1.1] jp-balance">
                AIが100点満点で採点。<br/>
                改善点と次のステップを提示。
              </h2>
              <p className="text-sm text-ink-soft mt-6 leading-relaxed jp-balance">
                提出された成果物をAIが多角的に評価。実務で使える完成度に達するまで、具体的な改善ポイントと次の学習を提案します。
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 gap-5">
              <div className="bg-paper border border-ink/10 p-6 col-span-2 md:col-span-1">
                <div className="tag text-ink-mute mb-1">総合スコア</div>
                <div className="flex items-baseline gap-1 mt-2">
                  <div className="h-display text-6xl font-bold">92</div>
                  <div className="text-ink-mute">/100</div>
                </div>
                <div className="flex gap-1 mt-3 text-vermilion">
                  {Array.from({length:5}).map((_,i)=><IconStar key={i} className="w-4 h-4" filled={true}/>)}
                </div>
              </div>
              <div className="bg-paper border border-ink/10 p-6 col-span-2 md:col-span-1">
                <div className="tag text-ink-mute mb-2">改善ポイント</div>
                <ul className="space-y-2 text-xs text-ink-soft mt-2">
                  <li className="flex gap-2"><span className="text-vermilion">→</span><span className="jp-text">データの自動化をさらに強化</span></li>
                  <li className="flex gap-2"><span className="text-vermilion">→</span><span className="jp-text">CTAの配置を最適化する</span></li>
                  <li className="flex gap-2"><span className="text-vermilion">→</span><span className="jp-text">事例セクションを追加する</span></li>
                </ul>
              </div>
              <div className="col-span-2 bg-paper border border-ink/10 p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <div className="tag text-ink-mute">次のステップ</div>
                  <div className="tag text-vermilion">進捗率 68%</div>
                </div>
                <div className="font-serif text-base">Lesson 24 に進みましょう</div>
                <div className="h-1.5 bg-ink/10 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-vermilion" style={{ width: '68%' }}/>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           PORTFOLIO — uniform 6-card gallery
         ============================================================ */}
      <section className="bg-ink text-cream-50">
        <div className="border-y border-cream-50/15">
          <Container className="py-3 flex items-center gap-6 text-cream-50/85">
            <span className="tag text-vermilion">Portfolio</span>
            <span className="h-px flex-1 bg-cream-50/15"/>
            <span className="tag">Section 04</span>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
            <h2 className="md:col-span-7 h-display text-3xl md:text-5xl tracking-tightest leading-[1.05] jp-balance">
              卒業すると、<span className="text-vermilion">作品が資産になる。</span>
            </h2>
            <div className="md:col-span-5 flex md:justify-end">
              <Link href="/cases" className="text-[13px] text-cream-50 underline-offset-4 hover:underline">作品をもっと見る →</Link>
            </div>
          </div>

          {/* Uniform 3x2 grid (or 2x3 on tablet, 1 col on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {PORTFOLIO_SAMPLES.map(p=>(
              <div key={p.title} className="group">
                <div className="relative aspect-[3/2] overflow-hidden bg-cream-50/5 border border-cream-50/10">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"/>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="font-serif text-sm tracking-editorial">{p.title}</div>
                  <div className="tag text-vermilion">スコア {p.score}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 grid md:grid-cols-12 gap-6 items-center border-t border-cream-50/15 pt-8">
            <div className="md:col-span-12">
              <div className="font-serif text-lg md:text-xl tracking-editorial">AIレビューでさらに成長。完成度スコア・改善点・次のレベルへの示唆をAIが提示。</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           PRICE — 4 plans
         ============================================================ */}
      <section>
        <div className="border-b border-ink/10">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Price</span>
            <span className="h-px flex-1 bg-ink/15"/>
            <span className="tag text-ink-mute">Section 05</span>
          </Container>
        </div>
        <Container className="py-14 md:py-20">
          <h2 className="h-display text-3xl md:text-5xl tracking-tightest leading-[1.1] mb-12 jp-balance">
            あなたのペースで、<span className="text-vermilion">選べるプラン。</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
            <div className="bg-cream p-7">
              <div className="font-serif text-base font-bold mb-2">Free</div>
              <div className="h-display text-4xl font-bold">¥0</div>
              <div className="text-xs text-ink-mute mt-1 jp-text">Lesson 1-2 完全無料体験</div>
              <Link href="/signup" className="btn-ghost w-full mt-6 text-[12px] py-2.5">無料で始める</Link>
            </div>
            <div className="bg-cream p-7">
              <div className="font-serif text-base font-bold mb-2">月額プラン</div>
              <div className="flex items-baseline gap-1">
                <div className="h-display text-4xl font-bold">¥9,800</div>
                <div className="text-xs text-ink-mute">/ 月</div>
              </div>
              <ul className="text-xs text-ink-soft mt-3 space-y-1.5 jp-text">
                <li>全コース受け放題</li>
                <li>AI採点 無制限</li>
              </ul>
              <Link href="/signup" className="btn-ghost w-full mt-6 text-[12px] py-2.5">月額で始める</Link>
            </div>
            <div className="bg-ink text-cream-50 p-7 relative">
              <span className="absolute -top-2 right-4 bg-vermilion text-cream-50 tag px-2 py-0.5">おすすめ</span>
              <div className="font-serif text-base font-bold mb-2">年額プラン</div>
              <div className="flex items-baseline gap-1">
                <div className="h-display text-4xl font-bold">¥98,000</div>
                <div className="text-xs text-cream-50/55">/ 年</div>
              </div>
              <ul className="text-xs text-cream-50/75 mt-3 space-y-1.5 jp-text">
                <li>全コース＋ポートフォリオ公開</li>
                <li>2ヶ月分お得</li>
              </ul>
              <Link href="/signup" className="bg-vermilion text-cream-50 w-full mt-6 inline-flex justify-center text-[12px] py-2.5 hover:bg-cream-50 hover:text-ink transition-colors">年額で始める</Link>
            </div>
            <div className="bg-cream p-7">
              <div className="font-serif text-base font-bold mb-2">法人 / Team</div>
              <div className="flex items-baseline gap-1">
                <div className="h-display text-4xl font-bold">¥49,800</div>
                <div className="text-xs text-ink-mute jp-text">/ 月（5名）</div>
              </div>
              <ul className="text-xs text-ink-soft mt-3 space-y-1.5 jp-text">
                <li>アドミン管理 / 進捗一括把握</li>
                <li>カスタマーサクセス</li>
              </ul>
              <Link href="/contact" className="btn-ghost w-full mt-6 text-[12px] py-2.5">お問い合わせ</Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           CLOSING CTA
         ============================================================ */}
      <section className="bg-paper">
        <Container className="py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6">
              <h3 className="h-display text-3xl md:text-5xl tracking-tightest leading-[1.05] jp-balance">
                まずは無料で、<span className="text-vermilion">1つ作ってみる。</span>
              </h3>
              <p className="text-xs text-ink-mute mt-3">クレカ不要・いつでも解約OK</p>
            </div>
            <div className="md:col-span-6">
              <Link href="/signup" className="btn-primary w-full justify-center text-base py-5 group">
                <span>今すぐ無料で体験する</span>
                <span className="ml-3 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================
           TRUST BAR — bottom stats (with breathing room)
         ============================================================ */}
      <section className="bg-ink text-cream-50">
        <Container className="py-14 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
            {[
              { l:'受講生満足度',          v:'4.8',   u:'/5'  },
              { l:'専属講師の実務経験',    v:'1,200+', u:'時間' },
              { l:'導入企業（法人プラン）',v:'100+',  u:'社'   },
              { l:'サポート満足度',        v:'98',    u:'%'    }
            ].map(x=>(
              <div key={x.l} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="tag text-cream-50/55 jp-text">{x.l}</div>
                <div className="flex items-baseline gap-1 mt-3">
                  <div className="h-display text-4xl md:text-5xl font-bold">{x.v}</div>
                  <div className="text-cream-50/55 text-sm">{x.u}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
