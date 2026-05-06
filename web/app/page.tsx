import Link from 'next/link';
import Image from 'next/image';
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

      {/* HERO ---------------------------------------------------- */}
      <section className="relative" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-20 md:pb-28 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Copy column */}
          <div>
            <h1
              className="font-serif font-bold leading-[1.1] text-ink jp-balance"
              style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.4rem)' }}
            >
              AIと創る、
              <br />
              <span className="text-vermilion">理想の自分</span>へ。
            </h1>
            <p className="mt-7 md:mt-8 text-base md:text-lg text-ink jp-text leading-[1.95] max-w-xl">
              AIを活用して、アイデアを形にし、人生を変えるプロダクトを生み出す。
              <br />
              ここは、あなたの可能性が加速する場所。
            </p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-7 py-4 font-medium tracking-tight transition"
              >
                無料で始める（クレカ不要）
              </Link>
              <Link
                href="/lesson/restaurant_01"
                className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-vermilion transition border-b border-ink/30 hover:border-vermilion pb-1 self-start sm:self-auto"
              >
                Lesson 1-2 完全無料体験
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Photo column */}
          <div className="relative">
            <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-sm">
              <Image
                src="/images/lp/hero_aspirational.png"
                alt="AIと共に理想の未来を見つめる若者"
                fill
                priority
                className="object-cover"
              />
              {/* Cursive script overlay */}
              <div
                className="absolute right-4 md:right-6 top-[55%] text-cream-50/95 select-none pointer-events-none"
                style={{
                  fontFamily: '"Snell Roundhand", "Brush Script MT", cursive',
                  fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
                  fontStyle: 'italic',
                  lineHeight: 1.1,
                  textShadow: '0 2px 18px rgba(6,14,49,0.4)',
                }}
              >
                Be who you
                <br />
                want to be.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-FEATURE ROW ------------------------------------------- */}
      <section style={{ background: 'var(--cream)' }} className="border-t border-ink/5">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-12 md:py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            <Feature
              Icon={IconRocket}
              title="実践型カリキュラム"
              text="AIの基礎からプロダクト開発まで、実践を通して学ぶ。"
            />
            <Feature
              Icon={IconConcept}
              title="本物のプロダクト開発"
              text="卒業時には、実際に使えるプロダクトをリリース。"
            />
            <Feature
              Icon={IconUser}
              title="現役プロが伴走"
              text="第一線で活躍するメンターが、あなたの挑戦をサポート。"
            />
            <Feature
              Icon={IconLayer}
              title="最高のコミュニティ"
              text="同じ志を持つ仲間とつながり、刺激し合える環境。"
            />
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER ------------------------------------------ */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/lp/after_man.png"
            alt=""
            fill
            className="object-cover opacity-50 object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, var(--ink) 0%, var(--ink) 30%, rgba(6,14,49,0.85) 55%, rgba(6,14,49,0.4) 80%, transparent 100%)',
            }}
          />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-[1fr,auto,1fr,1fr] gap-6 md:gap-10 items-start text-cream-50">
          {/* BEFORE */}
          <div>
            <div className="text-xs tracking-[0.25em] text-vermilion mb-5">BEFORE</div>
            <h3 className="font-serif text-2xl md:text-3xl jp-balance leading-[1.5] text-cream-50/90 mb-7">
              何をすればいいか分からない
              <br />
              自信がない、動き出せない日々。
            </h3>
            <ul className="space-y-3.5">
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

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center pt-12">
            <span className="w-14 h-14 grid place-items-center rounded-full border border-cream-50/20">
              <IconArrowRight className="w-6 h-6 text-cream-50" />
            </span>
          </div>

          {/* AFTER */}
          <div>
            <div className="text-xs tracking-[0.25em] text-vermilion mb-5">AFTER</div>
            <h3 className="font-serif text-2xl md:text-3xl jp-balance leading-[1.5] text-cream-50 mb-7">
              自分のサービスを持ち、
              <br />
              誰かの役に立っている。
            </h3>
            <ul className="space-y-3.5">
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

          {/* Spacer for photo on right */}
          <div className="hidden md:block" />
        </div>
      </section>

      {/* WORKS / 卒業生事例 -------------------------------------- */}
      <section id="works" style={{ background: 'var(--cream)' }}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <h2 className="font-serif font-bold text-3xl md:text-[40px] text-ink text-center jp-balance leading-[1.3] mb-12">
            卒業生は、こんな
            <span className="relative inline-block">
              <span
                className="absolute left-0 right-0 bottom-0.5 h-3.5 bg-vermilion/35 -z-0"
                aria-hidden
              />
              <span className="relative">未来</span>
            </span>
            を手に入れています。
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AlumniCard
              img="/images/lp/portfolio_dashboard.png"
              tag="SaaS開発・月商300万円"
              age="24歳・フリーランス"
              text="自分の業務を効率化するSaaSを開発し、法人向けに提供。"
            />
            <AlumniCard
              img="/images/lp/portfolio_linebot.png"
              tag="AIエージェント構築・受託案件獲得"
              age="27歳・会社員"
              text="AIエージェント開発で受託案件を獲得し、副業で月50万円を達成。"
            />
            <AlumniCard
              img="/images/lp/portfolio_education.png"
              tag="教育サービス構築・コミュニティ運営"
              age="26歳・起業家"
              text="自分の経験をコンテンツ化し、教育プラットフォームをリリース。"
            />
            <AlumniCard
              img="/images/lp/portfolio_realestate.png"
              tag="自動化ツール開発・時間と収入の自由"
              age="30歳・マーケター"
              text="業務を自動化するツールを開発し、時間と収入の自由を実現。"
            />
          </div>
          <div className="mt-10 flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-2 rounded-full ${i === 0 ? 'w-6 bg-vermilion' : 'w-2 bg-ink/20'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ---------------------------------------------- */}
      <section className="relative" style={{ background: 'var(--ink)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/lp/sunset_cta.png"
            alt=""
            fill
            className="object-cover opacity-65"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(6,14,49,0.85) 0%, rgba(6,14,49,0.6) 40%, rgba(6,14,49,0.4) 100%)',
            }}
          />
        </div>
        <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-[1fr,auto] gap-10 items-end">
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
          <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12">
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

/* ---------- subcomponents ---------- */

function Feature({
  Icon,
  title,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="shrink-0 w-12 h-12 grid place-items-center rounded-xl bg-vermilion/10 text-vermilion">
        <Icon className="w-6 h-6" />
      </span>
      <div className="min-w-0">
        <div className="font-sans font-bold text-base md:text-lg text-ink jp-balance leading-tight">{title}</div>
        <p className="text-xs md:text-sm text-ink-mute mt-2 jp-text leading-[1.7]">{text}</p>
      </div>
    </div>
  );
}

function AlumniCard({
  img,
  tag,
  age,
  text,
}: {
  img: string;
  tag: string;
  age: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl overflow-hidden bg-white border border-ink/5 shadow-card">
      <div className="relative aspect-[4/3] bg-cream-50">
        <Image src={img} alt="" fill className="object-cover" />
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

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center">
      <div className="text-[11px] tracking-[0.22em] text-cream-50/85 mb-2">{label}</div>
      <div className="relative inline-flex items-center justify-center px-5 md:px-7">
        <LaurelLeft className="absolute left-0 top-1/2 -translate-y-1/2 w-6 md:w-8 h-auto text-vermilion/85" />
        <LaurelRight className="absolute right-0 top-1/2 -translate-y-1/2 w-6 md:w-8 h-auto text-vermilion/85" />
        <div className="font-serif font-bold text-cream-50 leading-none" style={{ fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)' }}>
          {value}
          <span className="text-base md:text-xl text-cream-50/80 ml-0.5">{unit}</span>
        </div>
      </div>
      <div className="mt-2 inline-flex gap-0.5 text-vermilion">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} viewBox="0 0 20 20" className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor">
            <path d="M10 2l2.4 5.4 5.6.5-4.3 3.9 1.3 5.6L10 14.6 4.9 17.4l1.3-5.6L2 7.9l5.6-.5z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function LaurelLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
        {/* central stem from bottom curving up to upper-right */}
        <path d="M50 125 C 30 110, 18 90, 12 65 C 8 45, 14 25, 30 8" />
        {/* leaves on the outside (left side of stem) */}
        <path d="M44 118 q -10 -2 -16 4" />
        <path d="M36 100 q -12 -1 -18 6" />
        <path d="M28 80 q -14 0 -20 8" />
        <path d="M22 60 q -14 2 -19 11" />
        <path d="M20 40 q -12 4 -16 14" />
        <path d="M24 22 q -8 6 -10 16" />
        {/* leaves on the inside */}
        <path d="M44 118 q 10 -2 14 -10" />
        <path d="M36 100 q 12 -2 14 -12" />
        <path d="M28 80 q 14 -2 16 -14" />
        <path d="M22 60 q 14 -2 17 -14" />
        <path d="M20 40 q 12 -2 14 -14" />
        <path d="M24 22 q 8 -2 10 -12" />
      </g>
    </svg>
  );
}

function LaurelRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ transform: 'scaleX(-1)' }}>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
        <path d="M50 125 C 30 110, 18 90, 12 65 C 8 45, 14 25, 30 8" />
        <path d="M44 118 q -10 -2 -16 4" />
        <path d="M36 100 q -12 -1 -18 6" />
        <path d="M28 80 q -14 0 -20 8" />
        <path d="M22 60 q -14 2 -19 11" />
        <path d="M20 40 q -12 4 -16 14" />
        <path d="M24 22 q -8 6 -10 16" />
        <path d="M44 118 q 10 -2 14 -10" />
        <path d="M36 100 q 12 -2 14 -12" />
        <path d="M28 80 q 14 -2 16 -14" />
        <path d="M22 60 q 14 -2 17 -14" />
        <path d="M20 40 q 12 -2 14 -14" />
        <path d="M24 22 q 8 -2 10 -12" />
      </g>
    </svg>
  );
}
