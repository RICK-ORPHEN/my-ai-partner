import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { IconCheck } from '@/components/icons/Lesson';

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ============================================================== */}
      {/* HERO  —  magazine cover                                         */}
      {/* ============================================================== */}

      {/* MOBILE — full-bleed photo + STRONG cream gradient on left covers framed art */}
      <section className="md:hidden relative overflow-hidden" style={{ background: 'var(--cream)', minHeight: '780px' }}>
        <div className="absolute inset-0">
          <img
            src="/images/lp/kv_wide.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ objectPosition: '95% 28%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(95deg, var(--cream) 0%, var(--cream) 38%, rgba(238,236,231,0.92) 52%, rgba(238,236,231,0.45) 68%, rgba(238,236,231,0) 88%)',
            }}
          />
        </div>
        <div
          className="absolute right-5 bottom-12 z-10 text-cream-50/95 select-none pointer-events-none"
          style={{
            fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            lineHeight: 1.15,
            textAlign: 'right',
            textShadow: '0 2px 18px rgba(6,14,49,0.55)',
          }}
        >
          Be who you
          <br />
          want to be.
        </div>
        <div className="relative z-10 px-7 pt-28 pb-20 min-h-[780px] flex flex-col justify-center max-w-[80%]">
          <h1
            className="font-serif font-bold text-ink jp-balance"
            style={{ fontSize: 'clamp(2.2rem, 9vw, 2.9rem)', lineHeight: 1.14, letterSpacing: '-0.015em' }}
          >
            AIと創る、
            <br />
            <span className="text-vermilion">理想の自分</span>へ。
          </h1>
          <p className="mt-7 text-[13px] text-ink jp-text leading-[2.05] max-w-[26ch]">
            AIを活用して、アイデアを形にし、
            <br />
            人生を変えるプロダクトを生み出す。
            <br />
            ここは、あなたの可能性が加速する場所。
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-7 py-4 text-sm font-medium tracking-tight transition self-start shadow-lg shadow-vermilion/20"
          >
            無料で始める
          </Link>
          <Link
            href="/lesson/restaurant_01"
            className="mt-5 inline-flex items-center gap-1.5 text-xs text-ink hover:text-vermilion transition border-b border-ink/30 pb-1 self-start"
          >
            Lesson 1-2 完全無料体験 →
          </Link>
        </div>
      </section>

      {/* DESKTOP — full-bleed photo, object-position right (man only), STRONG cream gradient covers framed art */}
      <section className="hidden md:block relative overflow-hidden" style={{ background: 'var(--cream)' }}>
        <div className="absolute inset-0">
          <img
            src="/images/lp/kv_wide.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ objectPosition: '92% 50%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(95deg, var(--cream) 0%, var(--cream) 38%, rgba(238,236,231,0.92) 52%, rgba(238,236,231,0.55) 65%, rgba(238,236,231,0) 80%)',
            }}
          />
        </div>
        <div
          className="absolute right-12 lg:right-20 bottom-20 z-10 text-cream-50/95 select-none pointer-events-none"
          style={{
            fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
            fontSize: 'clamp(1.6rem, 2.6vw, 2.4rem)',
            fontStyle: 'italic',
            lineHeight: 1.15,
            textShadow: '0 2px 18px rgba(6,14,49,0.45)',
          }}
        >
          Be who you
          <br />
          want to be.
        </div>
        <div className="relative z-10 max-w-[1280px] mx-auto px-12 lg:px-16 pt-44 pb-44 min-h-[820px] flex items-center">
          <div className="max-w-[34rem]">
            <h1
              className="font-serif font-bold text-ink jp-balance"
              style={{ fontSize: 'clamp(3.4rem, 6vw, 5.2rem)', letterSpacing: '-0.022em', lineHeight: 1.06 }}
            >
              AIと創る、
              <br />
              <span className="text-vermilion">理想の自分</span>へ。
            </h1>
            <p
              className="mt-12 text-ink jp-text"
              style={{ fontSize: 'clamp(1rem, 1.15vw, 1.1rem)', lineHeight: 2.15, maxWidth: '34ch' }}
            >
              AIを活用して、アイデアを形にし、
              <br />
              人生を変えるプロダクトを生み出す。
              <br />
              ここは、あなたの可能性が加速する場所。
            </p>
            <div className="mt-14 flex items-center gap-8 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-9 py-5 text-base font-medium tracking-tight transition shadow-lg shadow-vermilion/20"
              >
                無料で始める
              </Link>
              <Link
                href="/lesson/restaurant_01"
                className="inline-flex items-center gap-2 text-sm text-ink hover:text-vermilion transition border-b border-ink/30 hover:border-vermilion pb-1"
              >
                Lesson 1-2 完全無料体験
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FEATURES — quiet, no card chrome                                */}
      {/* ============================================================== */}
      <section style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1280px] mx-auto px-7 md:px-12 py-24 md:py-36">
          {/* Section eyebrow */}
          <div className="mb-14 md:mb-20">
            <div className="text-[11px] tracking-[0.3em] text-ink-mute uppercase mb-4">— Why us</div>
            <h2
              className="font-serif text-ink jp-balance"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', lineHeight: 1.45, letterSpacing: '-0.01em', maxWidth: '24ch' }}
            >
              情報を学ぶのではなく、
              <br />
              <span className="text-vermilion">作り、公開する</span>体験を。
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-y-16 md:gap-y-24 gap-x-20">
            {[
              { num: '01', title: '実践型カリキュラム', text: 'AIの基礎から、実際に動く プロダクト開発まで。手を動かして、変わる。' },
              { num: '02', title: '本物のプロダクト開発', text: '卒業時には、自分の名前で 公開した実プロダクトが残ります。' },
              { num: '03', title: '現役プロが伴走', text: '第一線で活躍するメンターが、 一緒に作り、考え、走り抜けます。' },
              { num: '04', title: '最高のコミュニティ', text: '同じ志の仲間と出会う、 静かで誠実な学びの場所です。' },
            ].map((f, i) => (
              <div key={i} className="flex gap-6 md:gap-8">
                <div className="font-serif text-vermilion text-2xl md:text-3xl shrink-0" style={{ letterSpacing: '0.02em' }}>
                  {f.num}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif text-ink text-xl md:text-2xl jp-balance leading-tight mb-4" style={{ letterSpacing: '-0.005em' }}>
                    {f.title}
                  </h3>
                  <p className="text-ink-soft jp-text text-[14px] md:text-[15px] leading-[2]">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* BEFORE / AFTER — cinematic                                       */}
      {/* ============================================================== */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <img
            src="/images/lp/after_man.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-70"
            style={{ objectPosition: 'right center' }}
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                'linear-gradient(90deg, var(--ink) 0%, var(--ink) 30%, rgba(6,14,49,0.85) 55%, rgba(6,14,49,0.35) 80%, transparent 100%)',
            }}
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                'linear-gradient(180deg, var(--ink) 0%, rgba(6,14,49,0.94) 18%, rgba(6,14,49,0.4) 38%, rgba(6,14,49,0.4) 60%, rgba(6,14,49,0.94) 80%, var(--ink) 100%)',
            }}
          />
        </div>
        <div className="hidden md:block relative max-w-[1280px] mx-auto px-12 py-36 text-cream-50">
          <div className="grid grid-cols-[1fr,auto,1fr,1fr] gap-x-12 items-start">
            <BeforeBlock />
            <ArrowBlock />
            <AfterBlock />
            <div />
          </div>
        </div>
        <div className="md:hidden relative px-7 py-24 text-cream-50">
          <BeforeBlock />
          <div className="my-14 flex justify-center">
            <span className="w-14 h-14 grid place-items-center rounded-full border border-cream-50/25">
              <span className="text-cream-50 text-xl" style={{ transform: 'rotate(90deg)', display: 'inline-block' }}>→</span>
            </span>
          </div>
          <AfterBlock />
        </div>
      </section>

      {/* ============================================================== */}
      {/* WORKS — magazine spread                                          */}
      {/* ============================================================== */}
      <section id="works" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1280px] mx-auto px-7 md:px-12 py-24 md:py-36">
          <div className="text-center mb-14 md:mb-20">
            <div className="text-[11px] tracking-[0.3em] text-ink-mute uppercase mb-4">— Voices</div>
            <h2 className="font-serif text-ink jp-balance" style={{ fontSize: 'clamp(2rem, 3.6vw, 2.8rem)', lineHeight: 1.4, letterSpacing: '-0.01em' }}>
              卒業生は、こんな
              <br className="md:hidden" />
              <span className="relative inline-block">
                <span className="absolute left-0 right-0 bottom-1 h-3 bg-vermilion/30 -z-0" aria-hidden />
                <span className="relative">未来</span>
              </span>
              を手に入れています。
            </h2>
          </div>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {ALUMNI.map((a, i) => <AlumniCard key={i} {...a} />)}
          </div>
          <div className="md:hidden space-y-12">
            {ALUMNI.map((a, i) => <AlumniCardMobile key={i} {...a} />)}
          </div>
          <div className="mt-12 md:mt-16 flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-8 bg-vermilion' : 'w-1.5 bg-ink/15'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CTA — closing magazine page                                */}
      {/* ============================================================== */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <img src="/images/lp/sunset_cta.png" alt="" aria-hidden className="w-full h-full object-cover opacity-65" />
          <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(6,14,49,0.85) 0%, rgba(6,14,49,0.55) 45%, rgba(6,14,49,0.3) 100%)' }} />
          <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(180deg, rgba(238,236,231,0.55) 0%, rgba(238,236,231,0.2) 22%, rgba(6,14,49,0.4) 56%, rgba(6,14,49,0.85) 100%)' }} />
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block relative max-w-[1280px] mx-auto px-12 py-44">
          <div className="grid grid-cols-[1fr,auto] gap-12 items-end">
            <div>
              <h2 className="font-serif font-bold text-cream-50 jp-balance" style={{ fontSize: 'clamp(3rem, 5.6vw, 4.8rem)', lineHeight: 1.08, letterSpacing: '-0.02em' }}>
                未来は、
                <br />
                創り出せる。
              </h2>
              <p className="mt-8 text-cream-50/85 jp-text" style={{ fontSize: 'clamp(1rem, 1.15vw, 1.15rem)', lineHeight: 2 }}>
                AIと共に、理想の自分を超えていこう。
              </p>
              <Link href="/signup" className="mt-12 inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-9 py-5 text-base font-medium tracking-tight transition">
                無料で始める
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-12">
              <Stat label="卒業生満足度" value="92" unit="%" />
              <Stat label="プロダクトリリース率" value="89" unit="%" />
              <Stat label="学習継続率" value="91" unit="%" />
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden relative px-7 pt-20 pb-24">
          <h2 className="font-serif font-bold text-ink jp-balance text-center" style={{ fontSize: 'clamp(2rem, 8vw, 2.6rem)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            未来は、
            <br />
            創り出せる。
          </h2>
          <p className="mt-6 text-ink/80 jp-text text-[14px] leading-[1.95] text-center">
            AIと共に、理想の自分を超えていこう。
          </p>
          <Link href="/signup" className="mt-10 inline-flex items-center justify-center w-full bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-7 py-5 text-sm font-medium tracking-tight transition">
            無料で始める
          </Link>
          <div className="mt-16 grid grid-cols-3 gap-3">
            <StatLight label="卒業生満足度" value="92" unit="%" />
            <StatLight label="プロダクトリリース率" value="89" unit="%" />
            <StatLight label="学習継続率" value="91" unit="%" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ============================================================== */
/* Subcomponents                                                    */
/* ============================================================== */

function BeforeBlock() {
  return (
    <div>
      <div className="text-[11px] tracking-[0.3em] text-vermilion mb-6">BEFORE</div>
      <h3 className="font-serif jp-balance text-cream-50/85 mb-8" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', lineHeight: 1.55 }}>
        何をすればいいか分からない。
        <br />
        動き出せない日々。
      </h3>
      <ul className="space-y-4">
        {['アイデアはあるけど形にできない', 'スキルがなくて不安', '未来が漠然としている'].map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-[14px] md:text-[15px] text-cream-50/75 jp-text">
            <span className="shrink-0 w-5 h-5 grid place-items-center rounded-full border border-cream-50/25 mt-0.5">
              <IconCheck className="w-3 h-3 text-cream-50/65" />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ArrowBlock() {
  return (
    <div className="hidden md:flex items-center justify-center pt-12">
      <span className="w-16 h-16 grid place-items-center rounded-full border border-cream-50/25 text-cream-50 text-2xl">→</span>
    </div>
  );
}

function AfterBlock() {
  return (
    <div>
      <div className="text-[11px] tracking-[0.3em] text-vermilion mb-6">AFTER</div>
      <h3 className="font-serif jp-balance text-cream-50 mb-8" style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', lineHeight: 1.55 }}>
        自分のサービスを持ち、
        <br />
        誰かの役に立っている。
      </h3>
      <ul className="space-y-4">
        {['AIを使いこなし、アイデアを形にできる', '自分の強みを活かして価値を届けている', '自由な働き方・理想の人生を実現している'].map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-[14px] md:text-[15px] text-cream-50 jp-text">
            <span className="shrink-0 w-5 h-5 grid place-items-center rounded-full bg-vermilion mt-0.5">
              <IconCheck className="w-3 h-3 text-cream-50" />
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ALUMNI = [
  { img: '/images/lp/alumni_dashboard.png',  tag: 'SaaS開発・月商300万円',                age: '24歳・フリーランス', text: '自分の業務を効率化するSaaSを開発し、法人向けに提供。' },
  { img: '/images/lp/alumni_chat.png',       tag: 'AIエージェント構築・受託案件獲得',     age: '27歳・会社員',       text: 'AIエージェント開発で受託案件を獲得し、副業で月50万円を達成。' },
  { img: '/images/lp/alumni_education.png',  tag: '教育サービス構築・コミュニティ運営',   age: '26歳・起業家',       text: '自分の経験をコンテンツ化し、教育プラットフォームをリリース。' },
  { img: '/images/lp/alumni_automation.png', tag: '自動化ツール開発・時間と収入の自由',   age: '30歳・マーケター',   text: '業務を自動化するツールを開発し、時間と収入の自由を実現。' },
];

function AlumniCard({ img, tag, age, text }: { img: string; tag: string; age: string; text: string }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-50/30">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      </div>
      <div className="pt-6">
        <div className="text-[11px] tracking-[0.18em] text-vermilion uppercase mb-2 jp-balance">{tag}</div>
        <div className="font-serif text-ink text-base mb-1.5 jp-balance">{age}</div>
        <p className="text-[12.5px] text-ink-mute jp-text leading-[1.85]">{text}</p>
      </div>
    </article>
  );
}

function AlumniCardMobile({ img, tag, age, text }: { img: string; tag: string; age: string; text: string }) {
  return (
    <article>
      <div className="relative aspect-[16/10] overflow-hidden mb-5">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="text-[10px] tracking-[0.25em] text-vermilion uppercase mb-2 jp-balance">{tag}</div>
      <div className="font-serif text-ink text-lg mb-2 jp-balance">{age}</div>
      <p className="text-[13px] text-ink-mute jp-text leading-[1.95]">{text}</p>
    </article>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center inline-flex flex-col items-center min-w-0">
      <div className="text-[10px] tracking-[0.2em] text-cream-50/85 mb-3 jp-text">{label}</div>
      <div className="relative inline-flex items-end justify-center" style={{ width: 'clamp(150px, 16vw, 190px)', height: 'clamp(125px, 13vw, 160px)' }}>
        <img src="/images/lp/laurel.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain" />
        <div className="relative font-serif font-bold text-cream-50 leading-none pb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}>
          {value}
          <span className="text-base text-cream-50/85 ml-0.5 font-normal">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function StatLight({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center inline-flex flex-col items-center min-w-0">
      <div className="text-[9px] tracking-[0.2em] text-ink mb-2 jp-text leading-tight">{label}</div>
      <div className="relative inline-flex items-end justify-center" style={{ width: '100%', maxWidth: '120px', aspectRatio: '5/4' }}>
        <img src="/images/lp/laurel.png" alt="" aria-hidden className="absolute inset-0 w-full h-full object-contain" />
        <div className="relative font-serif font-bold text-ink leading-none pb-1" style={{ fontSize: '1.85rem' }}>
          {value}
          <span className="text-xs text-ink-mute ml-0.5 font-normal">{unit}</span>
        </div>
      </div>
    </div>
  );
}
