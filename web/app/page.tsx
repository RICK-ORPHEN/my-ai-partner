import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import {
  IconRocket,
  IconConcept,
  IconUser,
  IconLayer,
  IconCheck,
  IconArrowRight,
} from '@/components/icons/Lesson';

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* HERO ============================================== */}

      {/* MOBILE hero — full-bleed photo BG + text/CTA overlay (matches reference) */}
      <section className="md:hidden relative overflow-hidden" style={{ background: 'var(--cream)' }}>
        {/* Full-bleed photo */}
        <div className="absolute inset-0">
          <img
            src="/images/lp/kv_wide.png"
            alt="AIと共に理想の未来を見つめる若者"
            className="w-full h-full object-cover"
            style={{ objectPosition: '60% 30%' }}
          />
        </div>

        {/* Cursive overlay — placed on the photo's man side */}
        <div
          className="absolute right-4 bottom-12 z-10 text-cream-50/95 select-none pointer-events-none"
          style={{
            fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
            fontSize: '1.15rem',
            fontStyle: 'italic',
            lineHeight: 1.15,
            textAlign: 'right',
            textShadow: '0 2px 14px rgba(6,14,49,0.55)',
          }}
        >
          Be who you
          <br />
          want to be.
        </div>

        {/* Text + CTA overlay on the LEFT half (sits on the cream wall portion of the photo) */}
        <div className="relative z-10 px-5 pt-24 pb-12 min-h-[640px] flex flex-col justify-center max-w-[78%]">
          <h1 className="font-serif font-bold leading-[1.18] text-ink jp-balance" style={{ fontSize: 'clamp(1.85rem, 7.8vw, 2.5rem)' }}>
            AIと創る、
            <br />
            <span className="text-vermilion">理想の自分</span>へ。
          </h1>
          <p className="mt-5 text-[13px] text-ink jp-text leading-[1.9]">
            AIを活用して、アイデアを形にし、
            <br />
            人生を変えるプロダクトを生み出す。
            <br />
            ここは、あなたの可能性が加速する場所。
          </p>
          <div className="mt-7 space-y-3">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center w-full bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-4 py-3.5 text-sm font-medium tracking-tight transition shadow-lg shadow-vermilion/25"
            >
              無料で始める（クレカ不要）
            </Link>
            <Link
              href="/lesson/restaurant_01"
              className="inline-flex items-center gap-1.5 text-xs text-ink hover:text-vermilion transition border-b border-ink/40 pb-0.5 self-start"
            >
              Lesson 1-2 完全無料体験
              <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* DESKTOP hero — full-bleed with cream left fade */}
      <section className="hidden md:block relative overflow-hidden" style={{ background: 'var(--cream)' }}>
        <div className="absolute inset-0 -z-0">
          <img
            src="/images/lp/kv_wide.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
            style={{ objectPosition: '80% 50%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, var(--cream) 0%, var(--cream) 30%, rgba(238,236,231,0.92) 45%, rgba(238,236,231,0.55) 60%, rgba(238,236,231,0) 78%)',
            }}
          />
        </div>
        <div
          className="absolute right-12 lg:right-20 bottom-16 z-10 text-cream-50/95 select-none pointer-events-none"
          style={{
            fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
            fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)',
            fontStyle: 'italic',
            lineHeight: 1.15,
            textShadow: '0 2px 18px rgba(6,14,49,0.45)',
          }}
        >
          Be who you
          <br />
          want to be.
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-10 pt-32 pb-32 min-h-[640px] flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-serif font-bold leading-[1.1] text-ink jp-balance" style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.4rem)' }}>
              AIと創る、
              <br />
              <span className="text-vermilion">理想の自分</span>へ。
            </h1>
            <p className="mt-8 text-lg text-ink jp-text leading-[1.95] max-w-xl">
              AIを活用して、アイデアを形にし、人生を変えるプロダクトを生み出す。
              <br />
              ここは、あなたの可能性が加速する場所。
            </p>
            <div className="mt-9 flex items-center gap-5 flex-wrap">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-7 py-4 font-medium tracking-tight transition shadow-lg shadow-vermilion/20"
              >
                無料で始める（クレカ不要）
              </Link>
              <Link
                href="/lesson/restaurant_01"
                className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-vermilion transition border-b border-ink/30 hover:border-vermilion pb-1"
              >
                Lesson 1-2 完全無料体験
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4-FEATURE SECTION ============================================== */}
      {/* Mobile: vertical stack with dividers. Desktop: 4-column row. */}
      <section style={{ background: 'var(--cream)' }} className="border-t border-ink/5">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-14">
          <div className="md:grid md:grid-cols-4 md:gap-x-6 md:gap-y-10">
            {[
              { Icon: IconRocket, title: '実践型カリキュラム', text: 'AIの基礎からプロダクト開発まで、実践を通して学ぶ。' },
              { Icon: IconConcept, title: '本物のプロダクト開発', text: '卒業時には、実際に使えるプロダクトをリリース。' },
              { Icon: IconUser, title: '現役プロが伴走', text: '第一線で活躍するメンターが、あなたの挑戦をサポート。' },
              { Icon: IconLayer, title: '最高のコミュニティ', text: '同じ志を持つ仲間とつながり、刺激し合える環境。' },
            ].map((f, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 py-5 md:py-0 ${i > 0 ? 'border-t md:border-t-0 border-ink/10' : ''}`}
              >
                <span className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-vermilion/10 text-vermilion">
                  <f.Icon className="w-6 h-6" />
                </span>
                <div className="min-w-0">
                  <div className="font-sans font-bold text-base md:text-lg text-ink jp-balance leading-tight">{f.title}</div>
                  <p className="text-xs md:text-sm text-ink-mute mt-2 jp-text leading-[1.7]">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER ============================================== */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <img
            src="/images/lp/after_man.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-60"
            style={{ objectPosition: 'right center' }}
          />
          {/* Desktop horizontal gradient */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                'linear-gradient(90deg, var(--ink) 0%, var(--ink) 30%, rgba(6,14,49,0.85) 55%, rgba(6,14,49,0.4) 80%, transparent 100%)',
            }}
          />
          {/* Mobile vertical gradient — image stays in center, text overlays top + bottom on dark */}
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                'linear-gradient(180deg, var(--ink) 0%, rgba(6,14,49,0.92) 28%, rgba(6,14,49,0.5) 45%, rgba(6,14,49,0.5) 60%, rgba(6,14,49,0.92) 76%, var(--ink) 100%)',
            }}
          />
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid relative max-w-[1200px] mx-auto px-10 py-24 grid-cols-[1fr,auto,1fr,1fr] gap-10 items-start text-cream-50">
          <BeforeBlock />
          <ArrowBlock />
          <AfterBlock />
          <div />
        </div>

        {/* Mobile layout */}
        <div className="md:hidden relative px-5 py-12 text-cream-50">
          <BeforeBlock />
          <div className="my-10 flex justify-center">
            <span className="w-12 h-12 grid place-items-center rounded-full border border-cream-50/20">
              <IconArrowRight
                className="w-5 h-5 text-cream-50"
                style={{ transform: 'rotate(90deg)' }}
              />
            </span>
          </div>
          <AfterBlock />
        </div>
      </section>

      {/* WORKS / 卒業生事例 ============================================== */}
      <section id="works" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <h2 className="font-serif font-bold text-2xl md:text-[40px] text-ink text-center jp-balance leading-[1.4] mb-10 md:mb-12">
            卒業生は、こんな
            <span className="relative inline-block">
              <span className="absolute left-0 right-0 bottom-0.5 h-3 bg-vermilion/35 -z-0" aria-hidden />
              <span className="relative">未来</span>
            </span>
            を手に入れています。
          </h2>

          {/* Desktop: 4-col grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
            {ALUMNI.map((a, i) => (
              <AlumniCard key={i} {...a} />
            ))}
          </div>

          {/* Mobile: vertical stack of horizontal cards */}
          <div className="md:hidden space-y-3">
            {ALUMNI.map((a, i) => (
              <AlumniCardMobile key={i} {...a} />
            ))}
          </div>

          <div className="mt-8 md:mt-10 flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full ${i === 0 ? 'w-6 bg-vermilion' : 'w-2 bg-ink/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ============================================== */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <img
            src="/images/lp/sunset_cta.png"
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0 hidden md:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(6,14,49,0.85) 0%, rgba(6,14,49,0.6) 40%, rgba(6,14,49,0.4) 100%)',
            }}
          />
          <div
            className="absolute inset-0 md:hidden"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,14,49,0.85) 0%, rgba(6,14,49,0.55) 40%, rgba(6,14,49,0.55) 70%, rgba(6,14,49,0.85) 100%)',
            }}
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:grid relative max-w-[1200px] mx-auto px-10 py-28 grid-cols-[1fr,auto] gap-10 items-end">
          <div>
            <h2
              className="font-serif font-bold text-cream-50 leading-[1.1] jp-balance"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              未来は、創り出せる。
            </h2>
            <p className="mt-5 text-cream-50/85 jp-text text-base md:text-lg leading-[1.85]">
              AIと共に、理想の自分を超えていこう。
            </p>
            <Link
              href="/signup"
              className="mt-9 inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-7 py-4 font-medium tracking-tight transition"
            >
              無料で始める（クレカ不要）
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-6 md:gap-10">
            <Stat label="卒業生満足度" value="92" unit="%" />
            <Stat label="プロダクトリリース率" value="89" unit="%" />
            <Stat label="学習継続率" value="91" unit="%" />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden relative px-5 py-16">
          <h2 className="font-serif font-bold text-cream-50 leading-[1.15] jp-balance text-center" style={{ fontSize: 'clamp(1.8rem, 7.5vw, 2.4rem)' }}>
            未来は、創り出せる。
          </h2>
          <p className="mt-4 text-cream-50/85 jp-text text-sm leading-[1.85] text-center">
            AIと共に、理想の自分を超えていこう。
          </p>
          <Link
            href="/signup"
            className="mt-7 inline-flex items-center justify-center w-full bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-4 font-medium tracking-tight transition"
          >
            無料で始める（クレカ不要）
          </Link>
          <div className="mt-12 grid grid-cols-3 gap-2">
            <Stat label="卒業生満足度" value="92" unit="%" />
            <Stat label="プロダクトリリース率" value="89" unit="%" />
            <Stat label="学習継続率" value="91" unit="%" />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* ---------- shared subcomponents ---------- */

function BeforeBlock() {
  return (
    <div>
      <div className="text-xs tracking-[0.25em] text-vermilion mb-4">BEFORE</div>
      <h3 className="font-serif text-xl md:text-3xl jp-balance leading-[1.5] text-cream-50/90 mb-5">
        何をすればいいか分からない
        <br />
        自信がない、動き出せない日々。
      </h3>
      <ul className="space-y-3">
        {['アイデアはあるけど形にできない', 'スキルがなくて不安', '未来が漠然としている'].map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] text-cream-50/80 jp-text">
            <span className="shrink-0 w-5 h-5 grid place-items-center rounded-full bg-cream-50/15 mt-0.5">
              <IconCheck className="w-3 h-3 text-cream-50/70" />
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
      <span className="w-14 h-14 grid place-items-center rounded-full border border-cream-50/20">
        <IconArrowRight className="w-6 h-6 text-cream-50" />
      </span>
    </div>
  );
}

function AfterBlock() {
  return (
    <div>
      <div className="text-xs tracking-[0.25em] text-vermilion mb-4">AFTER</div>
      <h3 className="font-serif text-xl md:text-3xl jp-balance leading-[1.5] text-cream-50 mb-5">
        自分のサービスを持ち、
        <br />
        誰かの役に立っている。
      </h3>
      <ul className="space-y-3">
        {[
          'AIを使いこなし、アイデアを形にできる',
          '自分の強みを活かして価値を届けている',
          '自由な働き方・理想の人生を実現している',
        ].map((t, i) => (
          <li key={i} className="flex items-start gap-3 text-sm md:text-[15px] text-cream-50 jp-text">
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
  {
    img: '/images/lp/portfolio_dashboard.png',
    tag: 'SaaS開発・月商300万円',
    age: '24歳・フリーランス',
    text: '自分の業務を効率化するSaaSを開発し、法人向けに提供。',
  },
  {
    img: '/images/lp/portfolio_linebot.png',
    tag: 'AIエージェント構築・受託案件獲得',
    age: '27歳・会社員',
    text: 'AIエージェント開発で受託案件を獲得し、副業で月50万円を達成。',
  },
  {
    img: '/images/lp/portfolio_education.png',
    tag: '教育サービス構築・コミュニティ運営',
    age: '26歳・起業家',
    text: '自分の経験をコンテンツ化し、教育プラットフォームをリリース。',
  },
  {
    img: '/images/lp/portfolio_realestate.png',
    tag: '自動化ツール開発・時間と収入の自由',
    age: '30歳・マーケター',
    text: '業務を自動化するツールを開発し、時間と収入の自由を実現。',
  },
];

function AlumniCard({ img, tag, age, text }: { img: string; tag: string; age: string; text: string }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-white border border-ink/5 shadow-card">
      <div className="relative aspect-[4/3] bg-cream-50">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 left-3 inline-flex items-center bg-cream-50/95 text-ink text-[10px] font-bold px-2.5 py-1 rounded">
          {tag}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-vermilion/10 text-vermilion grid place-items-center">
            <IconUser className="w-4 h-4" />
          </span>
          <span className="text-sm font-medium text-ink">{age}</span>
        </div>
        <p className="text-xs text-ink-mute jp-text leading-[1.7]">{text}</p>
      </div>
    </article>
  );
}

function AlumniCardMobile({ img, tag, age, text }: { img: string; tag: string; age: string; text: string }) {
  return (
    <article className="rounded-2xl overflow-hidden bg-white border border-ink/5 shadow-card grid grid-cols-[40%,1fr]">
      <div className="relative">
        <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="text-vermilion font-bold text-[11px] leading-snug jp-balance mb-2">{tag}</div>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm font-medium text-ink">{age}</span>
        </div>
        <p className="text-[11px] text-ink-mute jp-text leading-[1.7]">{text}</p>
      </div>
    </article>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center inline-flex flex-col items-center min-w-0">
      <div className="text-[10px] md:text-[11px] tracking-[0.18em] text-cream-50/85 mb-2 jp-text">{label}</div>
      <div className="relative inline-flex items-end justify-center" style={{ width: 'clamp(110px, 16vw, 170px)', height: 'clamp(96px, 13vw, 140px)' }}>
        {/* Gold laurel wreath PNG */}
        <img
          src="/images/lp/laurel.png"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* Number sits inside the wreath */}
        <div className="relative font-serif font-bold text-cream-50 leading-none pb-1" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
          {value}
          <span className="text-xs md:text-base text-cream-50/85 ml-0.5">{unit}</span>
        </div>
      </div>
      <div className="mt-1.5 inline-flex gap-0.5" style={{ color: '#C8A85A' }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className="w-2 h-2 md:w-2.5 md:h-2.5" fill="currentColor">
            <path d="M10 2l2.4 5.4 5.6.5-4.3 3.9 1.3 5.6L10 14.6 4.9 17.4l1.3-5.6L2 7.9l5.6-.5z" />
          </svg>
        ))}
      </div>
    </div>
  );
}
