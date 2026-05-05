import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { INDUSTRIES, CROSS_SKILLS, STEP_TITLES } from '@/lib/curriculum';
import { INDUSTRY_ICONS } from '@/components/icons/Industries';
import { CROSS_SKILL_ICONS } from '@/components/icons/CrossSkills';

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ====== HERO — editorial cover ====== */}
      <section className="relative overflow-hidden">
        <Container className="pt-16 md:pt-24 pb-20">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8 fade-up">
              <div className="flex items-center gap-4 text-ink-mute">
                <span className="tag">Issue No.01</span>
                <span className="h-px flex-1 bg-ink/20"/>
                <span className="tag">2026 — Tokyo / Generic Edition</span>
              </div>
              <h1 className="h-display text-[14vw] md:text-[140px] leading-[0.85] mt-10 tracking-tightest">
                作って、<br/>
                <span className="text-vermilion">公開する。</span>
              </h1>
              <p className="font-serif text-2xl md:text-3xl text-ink-soft mt-10 leading-tight tracking-editorial max-w-[24ch]">
                プロンプトを覚える時代は終わり。<br/>
                自分の業務を解くプロダクトを、<br/>
                本物のURLで世に出すスクール。
              </p>
            </div>

            <aside className="md:col-span-4 md:pl-6 fade-up-2">
              <div className="border-l-2 border-ink pl-6">
                <div className="tag text-ink-mute mb-3">Editorial Note</div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  業種別7レッスン × 横断4スキルを横断する、実行型AI学習プログラム。受講生は卒業時に <strong className="text-ink">公開URLとポートフォリオ</strong> を所有する。
                </p>
                <div className="mt-8 space-y-3">
                  <Link href="/signup" className="btn-primary w-full justify-center">無料で診断を受ける</Link>
                  <Link href="/courses" className="btn-ghost w-full justify-center">カリキュラムを見る</Link>
                </div>
                <div className="tag text-ink-mute mt-5">CC不要 / 1分で開始 / Lesson 1-2 完全無料</div>
              </div>
            </aside>
          </div>

          {/* Stats line */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t-2 border-ink fade-up-3">
            {[
              { n: '08', l: '業種別コース' },
              { n: '04', l: '横断スキル' },
              { n: '84', l: '総レッスン' },
              { n: '02', l: '公開ルート' }
            ].map((s)=>(
              <div key={s.n}>
                <div className="h-display text-6xl leading-none tracking-tightest">{s.n}</div>
                <div className="tag text-ink-mute mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====== Manifesto block ====== */}
      <section className="bg-ink text-cream-50">
        <div className="border-y border-cream-50/15">
          <Container className="py-3 flex items-center gap-6 text-cream-50/85">
            <span className="tag">Manifesto</span>
            <span className="h-px flex-1 bg-cream-50/15"/>
            <span className="tag">Section 01</span>
          </Container>
        </div>
        <Container className="py-24 md:py-32">
          <div className="grid md:grid-cols-3 gap-10 md:gap-16">
            {[
              { n: '01', t: 'プロンプトじゃなく、プロダクト。', d: '覚えるだけでは業務は変わらない。動いて見せられるものを残すことだけを目的に学ぶ。' },
              { n: '02', t: '業種別の具体例で学ぶ。', d: '飲食・小売・不動産…自分の業界の実例だけを抜き出して、最短で効く学習設計に集中する。' },
              { n: '03', t: '公開URLが残る。', d: 'Vercel/Supabase か Squarespace で、本物のお客様に見せられる作品をひとつ持って卒業する。' }
            ].map((m)=>(
              <div key={m.n} className="fade-up">
                <div className="flex items-baseline gap-3">
                  <div className="h-display text-7xl text-vermilion leading-none tracking-tightest">{m.n}</div>
                  <div className="h-px flex-1 bg-cream-50/30"/>
                </div>
                <h3 className="font-serif text-3xl mt-6 leading-tight tracking-editorial">{m.t}</h3>
                <p className="mt-5 text-cream-50/75 leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====== Industry matrix ====== */}
      <section>
        <div className="border-y border-ink">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Industry Courses</span>
            <span className="h-px flex-1 bg-ink/20"/>
            <span className="tag text-ink-mute">Section 02</span>
          </Container>
        </div>
        <Container className="py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 mb-16 items-end">
            <h2 className="md:col-span-8 h-display text-6xl md:text-8xl tracking-tightest leading-[0.9]">
              8業種、それぞれに<br/>
              <span className="accent-underline">7段階の道筋</span>。
            </h2>
            <p className="md:col-span-4 text-ink-soft leading-relaxed">
              「学んで終わり」ではなく「公開して終わり」。各業種で7段のレッスンを進めると、最後には自分の業務を解くアプリ or サイトが手元に残る設計です。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
            {INDUSTRIES.map((i, idx)=>{
              const Icon = INDUSTRY_ICONS[i.id];
              return (
                <Link key={i.id} href={`/courses/${i.id}`} className="group bg-cream hover:bg-paper p-7 transition-colors flex flex-col min-h-[200px]">
                  <div className="flex items-start justify-between text-ink">
                    <Icon className="w-10 h-10 group-hover:text-vermilion transition-colors" />
                    <div className="tag text-ink-mute">{String(idx+1).padStart(2,'0')} / 08</div>
                  </div>
                  <div className="mt-auto pt-8">
                    <div className="font-serif text-2xl tracking-editorial">{i.title}</div>
                    <div className="text-sm text-ink-mute mt-2 leading-snug">{i.subtitle}</div>
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
        <Container className="py-20 md:py-28">
          <div className="max-w-3xl mb-16">
            <h2 className="h-display text-6xl md:text-8xl tracking-tightest leading-[0.9]">
              4つの<span className="text-vermilion">土台スキル</span>が、<br/>
              業種を超えて効く。
            </h2>
            <p className="text-ink-soft mt-8 leading-relaxed text-lg">
              Claude Skill開発、LP制作、企画書、自動化チャットツール ── これら横断スキルを、業種コースと並行して身につけます。すべて成果物提出 + AI採点付き。
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
            {CROSS_SKILLS.map((c, idx)=>{
              const Icon = CROSS_SKILL_ICONS[c.id];
              return (
                <Link key={c.id} href={`/courses/${c.id}`} className="group bg-cream hover:bg-paper p-10 flex gap-7 items-start transition-colors">
                  <div className="text-ink group-hover:text-vermilion transition-colors">
                    <Icon className="w-14 h-14"/>
                  </div>
                  <div className="flex-1">
                    <div className="tag text-ink-mute mb-2">Skill {String(idx+1).padStart(2,'0')}</div>
                    <div className="font-serif text-3xl tracking-editorial">{c.title}</div>
                    <div className="text-ink-mute mt-3 leading-relaxed">{c.subtitle}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ====== 7-step timeline ====== */}
      <section className="bg-ink text-cream-50">
        <div className="border-y border-cream-50/15">
          <Container className="py-3 flex items-center gap-6 text-cream-50/85">
            <span className="tag text-vermilion">Process</span>
            <span className="h-px flex-1 bg-cream-50/15"/>
            <span className="tag">Section 04</span>
          </Container>
        </div>
        <Container className="py-24 md:py-32">
          <h2 className="h-display text-6xl md:text-8xl tracking-tightest leading-[0.9] max-w-4xl">
            プロダクト完成までの、<br/>
            <span className="text-vermilion">7段の航海図</span>。
          </h2>

          <ol className="mt-20 space-y-0 border-t border-cream-50/15">
            {STEP_TITLES.map((t, i)=>(
              <li key={t} className="grid md:grid-cols-12 gap-6 py-8 border-b border-cream-50/15 group hover:bg-cream-50/5 -mx-2 md:-mx-6 px-2 md:px-6 transition-colors">
                <div className="md:col-span-2 flex items-center">
                  <div className="h-display text-7xl text-vermilion tracking-tightest leading-none">{String(i+1).padStart(2,'0')}</div>
                </div>
                <div className="md:col-span-7">
                  <div className="font-serif text-3xl tracking-editorial">{t}</div>
                </div>
                <div className="md:col-span-3 text-cream-50/65 text-sm leading-relaxed flex items-center">
                  {i < 5 ? '20-30 min' : '公開ステップ'}
                </div>
              </li>
            ))}
          </ol>
          <p className="text-cream-50/65 mt-10 max-w-2xl leading-relaxed">
            STEP 06-07 で Vercel+Supabase または Squarespace と連携し公開まで実行。受講生は卒業時に <strong className="text-cream-50">公開URLを所有</strong> している状態になります。
          </p>
        </Container>
      </section>

      {/* ====== Track A vs B ====== */}
      <section>
        <div className="border-y border-ink">
          <Container className="py-3 flex items-center gap-6">
            <span className="tag text-vermilion">Publishing Routes</span>
            <span className="h-px flex-1 bg-ink/20"/>
            <span className="tag text-ink-mute">Section 05</span>
          </Container>
        </div>
        <Container className="py-20 md:py-28">
          <h2 className="h-display text-6xl md:text-8xl tracking-tightest leading-[0.9] max-w-4xl">
            <span className="text-vermilion">どちらの道</span>でも、<br/>公開URLが残る。
          </h2>

          <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10 mt-16">
            <div className="bg-cream p-10 md:p-14">
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <div className="tag text-vermilion">Track A</div>
                  <div className="h-display text-5xl tracking-tightest mt-2">コーディング派</div>
                </div>
                <div className="h-display text-7xl text-ink/15 tracking-tightest">A</div>
              </div>
              <p className="text-ink-soft leading-relaxed">自分で更新したい / 技術に興味あり。</p>
              <ul className="mt-8 space-y-4 text-sm">
                {['Next.js テンプレ提供（業種別）','Supabase 接続コード自動生成','Vercel ワンクリックデプロイ','独自ドメイン取得ガイド'].map(f=>(
                  <li key={f} className="flex gap-3 border-b border-ink/10 pb-3">
                    <span className="text-vermilion font-bold">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="tag text-ink-mute mt-8">Stack: Next.js 15 + Supabase + Vercel</div>
            </div>

            <div className="bg-paper p-10 md:p-14">
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <div className="tag text-vermilion">Track B</div>
                  <div className="h-display text-5xl tracking-tightest mt-2">ノーコード派</div>
                </div>
                <div className="h-display text-7xl text-ink/15 tracking-tightest">B</div>
              </div>
              <p className="text-ink-soft leading-relaxed">本業に集中したい / コードは書かない。</p>
              <ul className="mt-8 space-y-4 text-sm">
                {['Squarespace 業種別テンプレ','AI生成コピー・画像をテンプレに流し込み','独自ドメイン購入＆SSL自動','SEO設定 / GA連携ガイド'].map(f=>(
                  <li key={f} className="flex gap-3 border-b border-ink/10 pb-3">
                    <span className="text-vermilion font-bold">→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="tag text-ink-mute mt-8">Stack: Squarespace Business</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ====== Closing CTA ====== */}
      <section className="bg-vermilion text-cream-50">
        <Container className="py-24 md:py-32">
          <div className="grid md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <div className="tag text-cream-50/70">Final Call</div>
              <h3 className="h-display text-6xl md:text-9xl tracking-tightest leading-[0.88] mt-6">
                今日、診断を受ける。<br/>
                3分で、<br/>
                あなたのコースが決まる。
              </h3>
            </div>
            <div className="md:col-span-4">
              <Link href="/signup" className="inline-flex items-center gap-3 bg-ink text-cream-50 px-10 py-6 text-xl font-serif tracking-editorial w-full justify-center hover:bg-cream-50 hover:text-ink transition-colors">
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
