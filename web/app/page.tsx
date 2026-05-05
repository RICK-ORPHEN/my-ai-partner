import Link from 'next/link';
import Image from 'next/image';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { INDUSTRIES, CROSS_SKILLS } from '@/lib/curriculum';
import { INDUSTRY_ICONS } from '@/components/icons/Industries';
import { CROSS_SKILL_ICONS } from '@/components/icons/CrossSkills';
import { SevenStepIndex } from '@/components/diagrams/SevenStep';

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ============================================================
           HERO — Magazine Cover (full-width photo + title overlay)
         ============================================================ */}
      <section className="relative">
        {/* Issue tag bar */}
        <div className="border-b border-ink/10">
          <Container className="py-3 flex items-center gap-4 text-ink-mute">
            <span className="tag">Issue No.01</span>
            <span className="h-px flex-1 bg-ink/15"/>
            <span className="tag">2026 Tokyo / Generic Edition</span>
          </Container>
        </div>

        {/* Hero photo — full width, with text overlay on right negative space */}
        <div className="relative">
          {/* Desktop: ultra-wide photo with title overlaid on right */}
          <div className="hidden md:block relative w-full overflow-hidden" style={{aspectRatio:'21/9'}}>
            <Image src="/images/lp/kv_hero_v2.png" alt="" fill priority className="object-cover editorial-img" sizes="100vw"/>

            {/* Text overlay positioned on the right negative space */}
            <div className="absolute inset-0">
              <div className="container-editorial h-full">
                <div className="grid grid-cols-12 h-full items-center">
                  <div className="col-span-12 md:col-start-6 md:col-span-7 md:pl-4 lg:pl-8">
                    <h1 className="h-display leading-[0.85] tracking-tightest text-[7vw] lg:text-[6.4vw] xl:text-[6vw] text-ink">
                      作って、<br/>
                      <span className="text-vermilion">公開する。</span>
                    </h1>
                    <p className="font-serif text-base lg:text-lg text-ink-soft mt-6 leading-relaxed tracking-editorial max-w-[28ch]">
                      プロンプトを覚える時代は終わり。<br/>
                      自分の業務を解くプロダクトを、<br/>
                      本物のURLで世に出すスクール。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: vertical photo with text below */}
          <div className="md:hidden relative w-full" style={{aspectRatio:'4/5'}}>
            <Image src="/images/lp/kv_mobile.png" alt="" fill priority className="object-cover editorial-img" sizes="100vw"/>
          </div>
        </div>

        {/* Mobile-only headline (placed below photo) */}
        <div className="md:hidden">
          <Container className="py-10">
            <h1 className="h-display text-[14vw] leading-[0.85] tracking-tightest -mx-1">
              作って、<br/>
              <span className="text-vermilion">公開する。</span>
            </h1>
            <p className="font-serif text-base text-ink-soft mt-6 leading-relaxed tracking-editorial">
              プロンプトを覚える時代は終わり。<br/>
              自分の業務を解くプロダクトを、本物のURLで世に出すスクール。
            </p>
          </Container>
        </div>

        {/* Below KV — info bar: blurb + CTAs + stats */}
        <div className="border-t border-ink/10">
          <Container className="py-10 md:py-12">
            <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
              <div className="md:col-span-5">
                <div className="tag text-vermilion mb-3">Editorial Note</div>
                <p className="text-sm text-ink-soft leading-relaxed max-w-md">
                  業種別7レッスン × 横断4スキルを横断する、実行型のAI学習プログラム。受講生は卒業時に <strong className="text-ink">公開URLとポートフォリオ</strong> を所有する。
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col gap-2">
                <Link href="/signup" className="btn-primary justify-center text-[14px] py-3">無料で診断を受ける</Link>
                <Link href="/courses" className="btn-ghost justify-center text-[14px] py-3">カリキュラムを見る</Link>
                <div className="tag text-ink-mute text-center mt-1">CC不要 / 1分で開始 / Lesson 1-2 完全無料</div>
              </div>
              <div className="md:col-span-3 grid grid-cols-2 gap-4 md:border-l md:border-ink/15 md:pl-6">
                {[
                  { n: '08', l: '業種' },
                  { n: '04', l: '横断' },
                  { n: '84', l: 'レッスン' },
                  { n: '02', l: '公開先' }
                ].map(s=>(
                  <div key={s.l}>
                    <div className="h-display text-3xl leading-none tracking-tightest">{s.n}</div>
                    <div className="tag text-ink-mute mt-1.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </section>

      {/* ====== Manifesto — with photos ====== */}
      <section className="bg-ink text-cream-50">
        <div className="border-y border-cream-50/15">
          <Container className="py-3 flex items-center gap-6 text-cream-50/85">
            <span className="tag">Manifesto</span>
            <span className="h-px flex-1 bg-cream-50/15"/>
            <span className="tag">Section 01</span>
          </Container>
        </div>
        <Container className="py-16 md:py-24">
          <div className="grid md:grid-cols-3 gap-10 md:gap-12">
            {[
              { n: '01', t: 'プロンプトじゃなく、プロダクト。', d: '覚えるだけでは業務は変わらない。動いて見せられるものを残すことだけを目的に学ぶ。', img: '/images/lp/manifesto_01.png' },
              { n: '02', t: '業種別の具体例で学ぶ。',         d: '飲食・小売・不動産…自分の業界の実例だけを抜き出して、最短で効く学習設計に集中する。',         img: '/images/lp/manifesto_02.png' },
              { n: '03', t: '公開URLが残る。',                d: 'Vercel/Supabase か Squarespace で、本物のお客様に見せられる作品をひとつ持って卒業する。', img: '/images/lp/manifesto_03.png' }
            ].map((m)=>(
              <div key={m.n}>
                <div className="relative aspect-square overflow-hidden mb-5">
                  <Image src={m.img} alt="" fill className="object-cover editorial-img" sizes="(min-width: 768px) 33vw, 100vw"/>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="h-display text-4xl text-vermilion leading-none tracking-tightest">{m.n}</div>
                  <div className="h-px flex-1 bg-cream-50/30"/>
                </div>
                <h3 className="font-serif text-xl md:text-2xl mt-4 leading-snug tracking-editorial">{m.t}</h3>
                <p className="mt-4 text-cream-50/70 leading-relaxed text-sm">{m.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====== Industry section ====== */}
      <section>
        <div className="border-y border-ink">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Industry Courses</span>
            <span className="h-px flex-1 bg-ink/20"/>
            <span className="tag text-ink-mute">Section 02</span>
          </Container>
        </div>
        <Container className="py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 mb-14 items-center">
            <div className="md:col-span-7 relative aspect-[16/10] overflow-hidden order-2 md:order-1">
              <Image src="/images/lp/industry.png" alt="" fill className="object-cover editorial-img" sizes="(min-width:768px) 50vw, 100vw"/>
            </div>
            <div className="md:col-span-5 order-1 md:order-2">
              <h2 className="h-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
                8業種、<br/>それぞれに<br/>
                <span className="accent-underline">7段階の道筋</span>。
              </h2>
              <p className="text-ink-soft leading-relaxed text-sm mt-6 max-w-md">
                「学んで終わり」ではなく「公開して終わり」。各業種で7段のレッスンを進めると、最後には自分の業務を解くアプリやサイトが手元に残る。
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
            {INDUSTRIES.map((i, idx)=>{
              const Icon = INDUSTRY_ICONS[i.id];
              return (
                <Link key={i.id} href={`/courses/${i.id}`} className="group bg-cream hover:bg-paper p-6 transition-colors flex flex-col min-h-[180px]">
                  <div className="flex items-start justify-between text-ink">
                    <Icon className="w-8 h-8 group-hover:text-vermilion transition-colors" />
                    <div className="tag text-ink-mute">{String(idx+1).padStart(2,'0')} / 08</div>
                  </div>
                  <div className="mt-auto pt-6">
                    <div className="font-serif text-xl tracking-editorial">{i.title}</div>
                    <div className="text-xs text-ink-mute mt-1.5 leading-snug">{i.subtitle}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ====== Cross-skills ====== */}
      <section className="bg-paper">
        <div className="border-y border-ink">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Cross-disciplinary Skills</span>
            <span className="h-px flex-1 bg-ink/20"/>
            <span className="tag text-ink-mute">Section 03</span>
          </Container>
        </div>
        <Container className="py-16 md:py-20">
          <div className="max-w-3xl mb-12">
            <h2 className="h-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
              4つの<span className="text-vermilion">土台スキル</span>が、<br/>
              業種を超えて効く。
            </h2>
            <p className="text-ink-soft mt-6 leading-relaxed text-sm md:text-base max-w-2xl">
              Claude Skill開発・LP制作・企画書・自動化チャットツール ── これら横断スキルを業種コースと並行して身につけます。すべて成果物提出 + AI採点付き。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            {CROSS_SKILLS.map((c, idx)=>{
              const Icon = CROSS_SKILL_ICONS[c.id];
              return (
                <Link key={c.id} href={`/courses/${c.id}`} className="group bg-cream hover:bg-paper p-8 flex gap-5 items-start transition-colors">
                  <div className="text-ink group-hover:text-vermilion transition-colors">
                    <Icon className="w-10 h-10"/>
                  </div>
                  <div className="flex-1">
                    <div className="tag text-ink-mute mb-1.5">Skill {String(idx+1).padStart(2,'0')}</div>
                    <div className="font-serif text-xl md:text-2xl tracking-editorial">{c.title}</div>
                    <div className="text-ink-mute mt-2 leading-relaxed text-sm">{c.subtitle}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ====== 7-step Index — editorial table of contents ====== */}
      <section className="bg-ink text-cream-50">
        <div className="border-y border-cream-50/15">
          <Container className="py-3 flex items-center gap-6 text-cream-50/85">
            <span className="tag text-vermilion">Process Index</span>
            <span className="h-px flex-1 bg-cream-50/15"/>
            <span className="tag">Section 04</span>
          </Container>
        </div>
        <Container className="py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-end">
            <div className="md:col-span-7">
              <h2 className="h-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
                プロダクト完成までの、<br/>
                <span className="text-vermilion">7段の道のり</span>。
              </h2>
            </div>
            <div className="md:col-span-5">
              <p className="text-cream-50/70 text-sm leading-relaxed max-w-md">
                すべての業種・横断コースに共通する7ステップ。STEP 06–07 で Vercel+Supabase または Squarespace と連携し、卒業時には <strong className="text-cream-50">公開URL</strong> が手元に残る。
              </p>
            </div>
          </div>

          <SevenStepIndex />
        </Container>
      </section>

      {/* ====== Track A vs B — photos only (no SVG) ====== */}
      <section>
        <div className="border-y border-ink">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Publishing Routes</span>
            <span className="h-px flex-1 bg-ink/20"/>
            <span className="tag text-ink-mute">Section 05</span>
          </Container>
        </div>
        <Container className="py-16 md:py-20">
          <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-12">
            <h2 className="md:col-span-7 h-display text-4xl md:text-6xl tracking-tightest leading-[0.95]">
              <span className="text-vermilion">どちらの道</span>でも、<br/>公開URLが残る。
            </h2>
            <p className="md:col-span-5 text-ink-soft text-sm leading-relaxed max-w-md">
              受講生のレベルと希望にあわせて、Vercel+Supabase の本格コーディング派、または Squarespace のノーコード派、どちらかを選んで公開へ進む。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            <div className="bg-cream">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/images/lp/track_a.png" alt="" fill className="object-cover editorial-img" sizes="(min-width:768px) 50vw, 100vw"/>
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <div className="tag text-cobalt">Track A</div>
                    <div className="h-display text-3xl tracking-tightest mt-1">コーディング派</div>
                  </div>
                  <div className="h-display text-5xl text-ink/15 tracking-tightest">A</div>
                </div>
                <p className="text-ink-soft leading-relaxed text-sm">自分で更新したい / 技術に興味あり。</p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {['Next.js テンプレ提供（業種別）','Supabase 接続コード自動生成','Vercel ワンクリックデプロイ','独自ドメイン取得ガイド'].map(f=>(
                    <li key={f} className="flex gap-3 border-b border-ink/10 pb-2.5">
                      <span className="text-vermilion font-bold">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="tag text-ink-mute mt-6">Stack: Next.js 15 + Supabase + Vercel</div>
              </div>
            </div>

            <div className="bg-paper">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src="/images/lp/track_b.png" alt="" fill className="object-cover editorial-img" sizes="(min-width:768px) 50vw, 100vw"/>
              </div>
              <div className="p-8 md:p-10">
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <div className="tag text-vermilion">Track B</div>
                    <div className="h-display text-3xl tracking-tightest mt-1">ノーコード派</div>
                  </div>
                  <div className="h-display text-5xl text-ink/15 tracking-tightest">B</div>
                </div>
                <p className="text-ink-soft leading-relaxed text-sm">本業に集中したい / コードは書かない。</p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {['Squarespace 業種別テンプレ','AI生成コピー・画像をテンプレに流し込み','独自ドメイン購入＆SSL自動','SEO設定 / GA連携ガイド'].map(f=>(
                    <li key={f} className="flex gap-3 border-b border-ink/10 pb-2.5">
                      <span className="text-vermilion font-bold">→</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="tag text-ink-mute mt-6">Stack: Squarespace Business</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ====== Closing CTA ====== */}
      <section className="bg-vermilion text-cream-50">
        <Container className="py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-7">
              <div className="tag text-cream-50/70">Final Call</div>
              <h3 className="h-display text-4xl md:text-7xl tracking-tightest leading-[0.95] mt-4">
                今日、診断を受ける。<br/>
                3分で、<br/>
                あなたのコースが決まる。
              </h3>
            </div>
            <div className="md:col-span-5">
              <Link href="/signup" className="inline-flex items-center gap-3 bg-ink text-cream-50 px-8 py-5 text-lg font-serif tracking-editorial w-full justify-center hover:bg-cream-50 hover:text-ink transition-colors">
                <span>無料診断を始める</span>
                <span>→</span>
              </Link>
              <div className="tag text-cream-50/70 mt-4">CC不要 / 1分で開始 / Lesson 1-2 完全無料</div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
