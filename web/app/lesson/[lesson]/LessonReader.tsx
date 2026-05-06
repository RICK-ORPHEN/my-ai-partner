'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  IconObjectives,
  IconWhy,
  IconExample,
  IconLibrary,
  IconHandsOn,
  IconSubmission,
  IconNext,
  IconCopy,
  IconCheck,
  IconBranch,
  IconUser,
  IconSpark,
  IconArrowRight,
  IconLightning,
  IconTarget,
  IconBook,
  IconPlay,
  IconClock,
  IconQuote,
  IconLayer,
} from '@/components/icons/Lesson';

type Example = { title: string; before: string; approach: string; after: string; prompt: string };
type PromptItem = { name: string; use_case: string; prompt: string };
type RubricItem = { criterion: string; weight: number; what_we_check: string };
type HandsOn = { intro?: string; tools?: string[]; steps?: string[] };
type Deliverable = { format?: string; what?: string; min_chars?: number; good_example?: string };

type Body = {
  tldr?: string;
  objectives?: string[];
  why?: string;
  concept?: string;
  examples?: Example[];
  prompt_library?: PromptItem[];
  hands_on?: HandsOn;
  deliverable?: Deliverable | string;
  rubric?: RubricItem[];
  next_action?: string;
};

type Profile = {
  display_name: string | null;
  industry: string | null;
  industryLabel: string | null;
  goal: string | null;
  learner_track: string | null;
};

type Meta = {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  step: number;
};

type CoachTurn = { role: 'coach' | 'student'; content: string; options?: string[] };

const AFFILIATE_LINKS: Record<string, string> = {
  vercel: process.env.NEXT_PUBLIC_AFFILIATE_VERCEL || 'https://vercel.com',
  supabase: process.env.NEXT_PUBLIC_AFFILIATE_SUPABASE || 'https://supabase.com',
  squarespace: process.env.NEXT_PUBLIC_AFFILIATE_SQUARESPACE || 'https://squarespace.com',
};

const QUICK_NAV = [
  { id: 'practice', label: '実践', Icon: IconPlay },
  { id: 'why', label: '理由', Icon: IconWhy },
  { id: 'insights', label: '要点', Icon: IconLayer },
  { id: 'examples', label: '事例', Icon: IconExample },
  { id: 'prompts', label: 'プロンプト', Icon: IconLibrary },
  { id: 'submit', label: '提出', Icon: IconSubmission },
];

export function LessonReader({
  lessonId,
  body,
  affiliateTarget,
  profile,
  meta,
}: {
  lessonId: string;
  body: Body | Record<string, unknown>;
  affiliateTarget?: string | null;
  profile: Profile;
  meta: Meta;
}) {
  const supabase = createClient();
  const b = body as Body;
  const [submission, setSubmission] = useState('');
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState<{ score: number; feedback_md: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activePromptIdx, setActivePromptIdx] = useState<number | null>(null);
  const [activeExampleIdx, setActiveExampleIdx] = useState(0);

  const deliverable: Deliverable =
    typeof b.deliverable === 'string' ? { what: b.deliverable } : b.deliverable ?? {};

  const conceptInsights = useMemo(() => extractInsights(b.concept ?? ''), [b.concept]);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    });
  }

  async function submitWork() {
    setScoring(true);
    const res = await fetch('/api/submissions/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, content_text: submission }),
    });
    const j = await res.json();
    setScore(j);
    setScoring(false);
    if (j?.score && j.score >= 60) {
      const { data } = await supabase.auth.getUser();
      await supabase.from('lesson_progress').upsert({
        user_id: data.user?.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
    }
  }

  return (
    <div className="px-6 md:px-10 py-8 md:py-10 max-w-[1320px] mx-auto">
      {/* Crumb */}
      <div className="text-vermilion text-sm tracking-wide mb-4 inline-flex items-center gap-2">
        <Link href={`/courses/${meta.courseId}`} className="hover:underline">
          {meta.courseTitle}
        </Link>
        <span className="text-ink-mute">/</span>
        <span className="text-ink-mute">STEP {meta.step} / 7</span>
      </div>

      {/* Hero */}
      <div className="grid md:grid-cols-[1fr,auto] items-start gap-6 mb-10">
        <div>
          <h1 className="font-sans font-bold tracking-tight text-ink leading-[1.15] jp-balance" style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)' }}>
            {meta.lessonTitle}
          </h1>
          {b.tldr ? (
            <p className="mt-3 text-base md:text-lg text-ink-mute jp-text leading-[1.85] max-w-3xl">
              {String(b.tldr)}
            </p>
          ) : null}
        </div>
        <a
          href="#s-practice"
          className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium transition shrink-0"
        >
          まず実践する
          <IconArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Sticky quick-nav (rounded chips) */}
      <div className="sticky top-0 z-30 -mx-6 md:-mx-10 px-6 md:px-10 py-3 mb-8 backdrop-blur" style={{ background: 'rgba(244,242,236,0.92)' }}>
        <div className="flex gap-2 overflow-x-auto">
          {QUICK_NAV.map(({ id, label, Icon }) => (
            <a
              key={id}
              href={`#s-${id}`}
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-ink/5 hover:border-vermilion/40 hover:text-vermilion transition text-sm shadow-soft"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="jp-text">{label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="目標" value={String(b.objectives?.length ?? 0)} unit="個" Icon={IconTarget} />
        <Stat label="現場の事例" value={String(b.examples?.length ?? 0)} unit="件" Icon={IconExample} />
        <Stat label="プロンプト" value={String(b.prompt_library?.length ?? 0)} unit="本" Icon={IconLibrary} />
        <Stat label="所要" value={String((b.hands_on?.steps?.length ?? 5) * 5)} unit="分" Icon={IconClock} />
      </div>

      {/* §01 Practice */}
      <SoftSection
        id="practice"
        Icon={IconPlay}
        title="まず手を動かす"
        subtitle="読むより先に、AIコーチと対話で進めましょう"
        accent
      >
        <CoachConversation
          lessonId={lessonId}
          profile={profile}
          referenceSteps={b.hands_on?.steps ?? []}
          tools={b.hands_on?.tools ?? []}
        />
      </SoftSection>

      {/* §02 Why + Objectives */}
      {b.why && (
        <SoftSection id="why" Icon={IconWhy} title="なぜ学ぶのか" subtitle="この一歩がどうつながるか">
          <div className="rounded-2xl border border-vermilion/15 bg-vermilion/5 p-6 md:p-8 flex gap-4 items-start">
            <span className="shrink-0 w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
              <IconQuote className="w-5 h-5" />
            </span>
            <p className="font-serif text-xl md:text-2xl text-ink leading-[1.6] jp-balance">{b.why}</p>
          </div>
          {b.objectives && b.objectives.length > 0 && (
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              {b.objectives.map((o, i) => (
                <ObjectiveCard key={i} index={i} text={o} />
              ))}
            </div>
          )}
        </SoftSection>
      )}

      {/* §03 Insights */}
      {conceptInsights.length > 0 && (
        <SoftSection
          id="insights"
          Icon={IconLayer}
          title="押さえる要点"
          subtitle="長文を読まずに掴める核"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {conceptInsights.map((ins, i) => (
              <InsightCard key={i} index={i + 1} title={ins.title} body={ins.body} />
            ))}
          </div>
          {b.concept && (
            <details className="mt-6">
              <summary className="cursor-pointer inline-flex items-center gap-2 text-sm text-vermilion hover:text-ink transition">
                <IconBook className="w-4 h-4" />
                もっと深く読む（全文）
              </summary>
              <div className="mt-5 max-w-3xl">
                <Markdown content={b.concept} />
              </div>
            </details>
          )}
        </SoftSection>
      )}

      {/* §04 Examples */}
      {b.examples && b.examples.length > 0 && (
        <SoftSection
          id="examples"
          Icon={IconExample}
          title={`${profile.industryLabel ?? ''}現場の3例`}
          subtitle="Before → After で変化を見る"
        >
          <div className="flex flex-wrap gap-2 mb-5">
            {b.examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => setActiveExampleIdx(i)}
                className={`px-4 py-2 rounded-full text-sm jp-text transition ${
                  activeExampleIdx === i
                    ? 'bg-ink text-cream-50'
                    : 'bg-white text-ink border border-ink/10 hover:border-ink/40'
                }`}
              >
                <span className="font-mono text-[11px] mr-2 opacity-60">CASE 0{i + 1}</span>
                {ex.title}
              </button>
            ))}
          </div>
          <ExampleCard
            ex={b.examples[activeExampleIdx]}
            onCopy={(p) => copy(p, `ex-${activeExampleIdx}`)}
            copied={copiedKey === `ex-${activeExampleIdx}`}
          />
        </SoftSection>
      )}

      {/* §05 Prompts */}
      {b.prompt_library && b.prompt_library.length > 0 && (
        <SoftSection
          id="prompts"
          Icon={IconLibrary}
          title="そのまま使えるプロンプト"
          subtitle={`貼って動く、${b.prompt_library.length}本`}
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {b.prompt_library.map((p, i) => (
              <PromptCard
                key={i}
                index={i + 1}
                total={b.prompt_library!.length}
                item={p}
                onOpen={() => setActivePromptIdx(i)}
              />
            ))}
          </div>
          {activePromptIdx !== null && (
            <PromptModal
              item={b.prompt_library[activePromptIdx]}
              index={activePromptIdx + 1}
              onClose={() => setActivePromptIdx(null)}
              onCopy={() => copy(b.prompt_library![activePromptIdx].prompt, `pl-${activePromptIdx}`)}
              copied={copiedKey === `pl-${activePromptIdx}`}
            />
          )}
        </SoftSection>
      )}

      {/* §06 Submit */}
      <SoftSection
        id="submit"
        Icon={IconSubmission}
        title="成果物を出す"
        subtitle="60点以上で完了 / 採点はAI"
      >
        {b.rubric && b.rubric.length > 0 && <RubricBars rubric={b.rubric} />}

        {deliverable.what && (
          <div className="mt-6 rounded-2xl bg-white border border-ink/5 shadow-card p-6">
            <div className="flex items-start gap-4">
              <span className="shrink-0 w-10 h-10 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
                <IconSubmission className="w-5 h-5" />
              </span>
              <div>
                <div className="text-xs text-ink-mute uppercase tracking-wider mb-1">提出物</div>
                <p className="text-ink jp-text leading-[1.85]">{deliverable.what}</p>
              </div>
            </div>
          </div>
        )}

        {deliverable.good_example && (
          <details className="mt-3 rounded-2xl bg-white border border-ink/5 shadow-card p-5">
            <summary className="cursor-pointer text-sm text-vermilion hover:text-ink transition inline-flex items-center gap-2">
              <IconQuote className="w-4 h-4" />
              良い提出例を覗く
            </summary>
            <p className="mt-4 text-sm text-ink jp-text leading-[1.85] whitespace-pre-wrap">
              {deliverable.good_example}
            </p>
          </details>
        )}

        <div className="mt-6 rounded-2xl bg-white border border-ink/5 shadow-card overflow-hidden">
          <div className="px-5 py-3 border-b border-ink/5 flex items-center justify-between text-xs text-ink-mute uppercase tracking-wider">
            <span>あなたの成果物</span>
            <span>
              {submission.length} / {deliverable.min_chars ?? 200}
            </span>
          </div>
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            className="w-full bg-white px-5 py-4 min-h-[220px] font-mono text-sm leading-[1.7] focus:outline-none resize-y"
            placeholder="ここに成果物を貼り付け（テキスト/URL/コードでもOK）"
          />
        </div>
        <div className="mt-4 flex items-center justify-end">
          <button
            disabled={scoring || !submission.trim()}
            onClick={submitWork}
            className="inline-flex items-center gap-2 bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-3 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {scoring ? 'AI採点中…' : 'AI採点を受ける'}
            <IconNext className="w-4 h-4" />
          </button>
        </div>

        {score && <ScoreGauge score={score.score} feedback={score.feedback_md} />}
      </SoftSection>

      {/* Affiliate / Next */}
      {affiliateTarget && <PublishCard target={affiliateTarget} />}
      {b.next_action && <NextActionCard next={b.next_action} courseId={meta.courseId} />}
    </div>
  );
}

/* ---------- Layout primitives ---------- */

function SoftSection({
  id,
  Icon,
  title,
  subtitle,
  accent,
  children,
}: {
  id?: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id ? `s-${id}` : undefined} className="mt-12 first:mt-0 scroll-mt-24">
      <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6">
          <span
            className={`shrink-0 w-12 h-12 grid place-items-center rounded-full ${
              accent ? 'bg-vermilion text-cream-50' : 'bg-vermilion/10 text-vermilion'
            }`}
          >
            <Icon className="w-6 h-6" />
          </span>
          <div className="min-w-0">
            <h2 className="font-sans font-bold text-xl md:text-2xl text-ink leading-tight jp-balance">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-ink-mute jp-text mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  unit,
  Icon,
}: {
  label: string;
  value: string;
  unit: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl bg-white border border-ink/5 shadow-card p-5">
      <div className="flex items-start gap-4">
        <span className="shrink-0 w-12 h-12 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
          <Icon className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <div className="text-xs text-ink-mute uppercase tracking-wider">{label}</div>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="font-sans font-bold text-3xl md:text-4xl text-ink leading-none">{value}</span>
            <span className="text-sm text-ink-mute">{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ObjectiveCard({ index, text }: { index: number; text: string }) {
  return (
    <div className="rounded-2xl bg-cream-50 border border-ink/5 p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 grid place-items-center rounded-full bg-vermilion text-cream-50 text-xs font-bold">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="text-xs text-ink-mute uppercase tracking-wider">目標</span>
      </div>
      <p className="text-sm md:text-base text-ink jp-text leading-[1.7]">{text}</p>
    </div>
  );
}

function InsightCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-cream-50 border border-ink/5 p-5 flex gap-4">
      <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-vermilion/10 text-vermilion font-bold text-sm">
        {String(index).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="font-sans font-semibold text-base text-ink jp-balance mb-1.5 leading-snug">
          {title}
        </div>
        <p className="text-sm text-ink-mute jp-text leading-[1.8]">{body}</p>
      </div>
    </div>
  );
}

function ExampleCard({
  ex,
  onCopy,
  copied,
}: {
  ex: Example;
  onCopy: (prompt: string) => void;
  copied: boolean;
}) {
  return (
    <div className="rounded-2xl bg-cream-50 border border-ink/5 overflow-hidden">
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
        <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-vermilion/20 text-vermilion">
          <IconExample className="w-4 h-4" />
        </span>
        <h3 className="font-sans font-semibold text-base md:text-lg jp-balance">{ex.title}</h3>
      </div>
      <div className="grid md:grid-cols-[1fr,auto,1fr]">
        <div className="p-6 border-r border-ink/5">
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-2 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ink-mute" />
            BEFORE
          </div>
          <p className="text-sm text-ink-soft jp-text leading-[1.85]">{ex.before}</p>
        </div>
        <div className="hidden md:flex items-center justify-center px-3">
          <span className="w-10 h-10 grid place-items-center rounded-full bg-vermilion text-cream-50">
            <IconArrowRight className="w-5 h-5" />
          </span>
        </div>
        <div className="p-6 bg-vermilion/5">
          <div className="text-xs text-vermilion uppercase tracking-wider mb-2 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vermilion" />
            AFTER
          </div>
          <p className="text-sm text-ink jp-text leading-[1.85] font-medium">{ex.after}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-ink/5 flex items-start gap-3 bg-white">
        <span className="shrink-0 w-7 h-7 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
          <IconLightning className="w-3.5 h-3.5" />
        </span>
        <div className="flex-1">
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-1">アプローチ</div>
          <p className="text-sm text-ink jp-text leading-[1.75]">{ex.approach}</p>
        </div>
      </div>
      <div className="px-6 py-5 border-t border-ink/5 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-ink-mute uppercase tracking-wider">使えるプロンプト</span>
          <button
            onClick={() => onCopy(ex.prompt)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink/5 hover:bg-ink hover:text-cream-50 text-ink text-xs transition"
          >
            {copied ? (
              <>
                <IconCheck className="w-3.5 h-3.5" />
                コピー完了
              </>
            ) : (
              <>
                <IconCopy className="w-3.5 h-3.5" />
                コピー
              </>
            )}
          </button>
        </div>
        <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap bg-cream-50 rounded-lg p-4">
          {ex.prompt}
        </pre>
      </div>
    </div>
  );
}

function PromptCard({
  index,
  total,
  item,
  onOpen,
}: {
  index: number;
  total: number;
  item: PromptItem;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="text-left rounded-2xl bg-cream-50 border border-ink/5 p-5 hover:shadow-card hover:border-vermilion/30 transition group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-2">
          <span className="w-8 h-8 grid place-items-center rounded-full bg-vermilion/10 text-vermilion text-xs font-bold">
            {String(index).padStart(2, '0')}
          </span>
          <span className="text-xs text-ink-mute uppercase tracking-wider">プロンプト</span>
        </div>
        <div className="text-xs text-ink-mute">{index} / {total}</div>
      </div>
      <h3 className="font-sans font-semibold text-base text-ink jp-balance mb-2 leading-snug">
        {item.name}
      </h3>
      <p className="text-xs text-ink-mute jp-text leading-[1.7] line-clamp-3">{item.use_case}</p>
      <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-ink-mute group-hover:text-vermilion transition">
        <span className="text-sm">開く</span>
        <IconArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}

function PromptModal({
  item,
  index,
  onClose,
  onCopy,
  copied,
}: {
  item: PromptItem;
  index: number;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      style={{ background: 'rgba(6,14,49,0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-white shadow-page"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-ink/5" style={{ background: 'var(--ink)', color: 'var(--cream)', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-vermilion/20 text-vermilion text-xs font-bold">
              {String(index).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <div className="text-xs text-cream/60 uppercase tracking-wider">プロンプト {String(index).padStart(2, '0')}</div>
              <div className="font-sans font-semibold text-base jp-balance truncate">{item.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="text-cream/70 hover:text-cream text-2xl leading-none px-2 shrink-0">
            ×
          </button>
        </div>
        <div className="px-6 py-5 border-b border-ink/5">
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-2">使う場面</div>
          <p className="text-sm text-ink jp-text leading-[1.8]">{item.use_case}</p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-ink-mute uppercase tracking-wider">プロンプト本文</span>
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ink hover:bg-vermilion text-cream-50 text-xs transition"
            >
              {copied ? (
                <>
                  <IconCheck className="w-3.5 h-3.5" />
                  コピー完了
                </>
              ) : (
                <>
                  <IconCopy className="w-3.5 h-3.5" />
                  コピー
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap bg-cream-50 rounded-lg p-4">
            {item.prompt}
          </pre>
        </div>
      </div>
    </div>
  );
}

function RubricBars({ rubric }: { rubric: RubricItem[] }) {
  const total = rubric.reduce((s, r) => s + r.weight, 0) || 100;
  return (
    <div className="rounded-2xl bg-cream-50 border border-ink/5 p-6">
      <div className="text-xs text-ink-mute uppercase tracking-wider mb-4">採点配分</div>
      <div className="space-y-4">
        {rubric.map((r, i) => {
          const pct = (r.weight / total) * 100;
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="font-sans font-semibold text-sm md:text-base text-ink jp-balance">
                  {r.criterion}
                </div>
                <div className="text-xs text-vermilion font-bold">{r.weight}pt</div>
              </div>
              <div className="h-2 bg-white rounded-full relative overflow-hidden border border-ink/5">
                <div
                  className="absolute inset-y-0 left-0 bg-vermilion rounded-full"
                  style={{ width: `${pct}%`, transition: 'width .8s ease' }}
                />
              </div>
              <p className="mt-1.5 text-xs text-ink-mute jp-text leading-[1.65]">{r.what_we_check}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreGauge({ score, feedback }: { score: number; feedback: string }) {
  const SIZE = 200;
  const STROKE = 16;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const offset = C - (Math.min(Math.max(score, 0), 100) / 100) * C;
  const passed = score >= 60;
  return (
    <div className="mt-8 rounded-2xl p-8 grid md:grid-cols-[auto,1fr] gap-8 items-start" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
      <div className="relative shrink-0 mx-auto" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} className="-rotate-90">
          <circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="rgba(238,236,231,0.15)" strokeWidth={STROKE} fill="none" />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={passed ? 'var(--vermilion)' : '#CFC9BC'}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={C}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-sans font-bold text-6xl leading-none text-cream">{score}</div>
            <div className="text-xs tracking-widest uppercase text-cream/60 mt-2">/ 100</div>
          </div>
        </div>
      </div>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream/10 text-xs text-cream/70 uppercase tracking-wider mb-3">
          {passed ? <IconCheck className="w-3.5 h-3.5" /> : <IconLightning className="w-3.5 h-3.5" />}
          {passed ? 'クリア' : 'もう一歩'}
        </div>
        <h3 className="font-sans font-bold text-2xl md:text-3xl text-cream mb-4">
          {passed ? 'お疲れさまでした' : 'あと少し'}
        </h3>
        <pre className="whitespace-pre-wrap text-sm text-cream/85 jp-text leading-[1.85] font-sans">{feedback}</pre>
      </div>
    </div>
  );
}

function PublishCard({ target }: { target: string }) {
  return (
    <div className="mt-12 rounded-2xl p-8 md:p-10 grid md:grid-cols-[1fr,auto] gap-6 items-center" style={{ background: 'var(--vermilion)', color: 'var(--cream)' }}>
      <div className="flex gap-4 items-start">
        <span className="shrink-0 w-12 h-12 grid place-items-center rounded-full bg-cream/15 text-cream">
          <IconArrowRight className="w-6 h-6" />
        </span>
        <div>
          <div className="text-xs text-cream/70 uppercase tracking-wider mb-2">公開ステップ</div>
          <h3 className="font-sans font-bold text-2xl md:text-3xl mb-2 jp-balance">
            {target} で世に出す準備
          </h3>
          <p className="text-sm md:text-base text-cream/90 jp-text leading-[1.85] max-w-2xl">
            このレッスンで作ったものを公開URLにするには {target} のアカウントが必要です。受講生特典つきリンクから登録できます。
          </p>
        </div>
      </div>
      <Link
        href={AFFILIATE_LINKS[target] ?? '#'}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium shrink-0"
        style={{ background: 'var(--ink)', color: 'var(--cream)' }}
      >
        {target} を開く
        <IconArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

function NextActionCard({ next, courseId }: { next: string; courseId: string }) {
  return (
    <div className="mt-8 rounded-2xl bg-white border border-ink/5 shadow-card p-6 md:p-7 grid md:grid-cols-[auto,1fr,auto] gap-5 items-center">
      <span className="shrink-0 w-12 h-12 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
        <IconArrowRight className="w-6 h-6" />
      </span>
      <div>
        <div className="text-xs text-ink-mute uppercase tracking-wider mb-1">次のアクション</div>
        <p className="text-base text-ink jp-text leading-[1.7]">{next}</p>
      </div>
      <Link
        href={`/courses/${courseId}`}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 bg-ink hover:bg-vermilion text-cream-50 text-sm transition shrink-0"
      >
        コースへ
        <IconArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ---------- AI Coach ---------- */

function CoachConversation({
  lessonId,
  profile,
  referenceSteps,
  tools,
}: {
  lessonId: string;
  profile: Profile;
  referenceSteps: string[];
  tools: string[];
}) {
  const [turns, setTurns] = useState<CoachTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (turns.length === 0) callCoach([], 'kickoff');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns, thinking]);

  async function callCoach(history: CoachTurn[], stage: 'kickoff' | 'continue') {
    setThinking(true);
    try {
      const res = await fetch('/api/lesson/coach', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          history: history.map((t) => ({ role: t.role, content: t.content })),
          stage,
        }),
      });
      const j = await res.json();
      const next: CoachTurn = {
        role: 'coach',
        content: j.coach_message ?? '',
        options: Array.isArray(j.options) ? j.options : undefined,
      };
      setTurns((prev) => [...prev, next]);
      if (j.next_branch === 'ready_to_submit') setReadyToSubmit(true);
    } catch (e) {
      setTurns((prev) => [
        ...prev,
        { role: 'coach', content: '一時的にコーチに接続できませんでした。' },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function send(content: string) {
    if (!content.trim()) return;
    const next = [...turns, { role: 'student' as const, content }];
    setTurns(next);
    setDraft('');
    await callCoach(next, 'continue');
  }

  const studentTurns = turns.filter((t) => t.role === 'student').length;
  const totalSteps = Math.max(referenceSteps.length, 5);
  const progress = Math.min(100, (studentTurns / totalSteps) * 100);

  return (
    <div className="grid md:grid-cols-[260px,1fr] gap-5">
      {/* Side panel */}
      <aside className="rounded-2xl bg-cream-50 border border-ink/5 p-5 flex flex-col">
        <div className="text-xs text-ink-mute uppercase tracking-wider mb-3">あなたの進捗</div>
        <div className="relative pl-5 space-y-3 flex-1">
          <div className="absolute left-1.5 top-1 bottom-1 w-px bg-ink/10" aria-hidden />
          <div
            className="absolute left-1.5 top-1 w-px bg-vermilion transition-all"
            style={{ height: `calc(${progress}% - 4px)` }}
            aria-hidden
          />
          {referenceSteps.slice(0, 7).map((s, i) => {
            const reached = i < studentTurns;
            const current = i === studentTurns;
            return (
              <div key={i} className="relative">
                <span
                  className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2 ${
                    reached
                      ? 'bg-vermilion border-vermilion'
                      : current
                      ? 'bg-cream-50 border-vermilion'
                      : 'bg-cream-50 border-ink/20'
                  }`}
                />
                <div
                  className={`text-xs jp-text leading-[1.55] ${
                    reached ? 'text-ink-mute line-through' : current ? 'text-ink font-medium' : 'text-ink-mute'
                  }`}
                >
                  {(s as string)
                    .replace(/^手順\d+[.:：]?\s*/, '')
                    .replace(/^ステップ\d+[.:：]?\s*/, '')
                    .slice(0, 60)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 pt-4 border-t border-ink/5">
          <div className="text-xs text-ink-mute uppercase tracking-wider mb-1">あなた</div>
          <div className="font-sans font-semibold text-sm text-ink leading-tight jp-balance">
            {profile.display_name ?? 'You'}
          </div>
          <div className="text-xs text-ink-mute mt-1 jp-text">
            {profile.industryLabel ? `${profile.industryLabel}業 / ` : ''}登録済み情報を活用<br />
            <span className="text-ink-mute/80">同じ質問はしません</span>
          </div>
        </div>
        {tools.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-ink-mute uppercase tracking-wider mb-2">ツール</div>
            <div className="flex flex-wrap gap-1.5">
              {tools.slice(0, 5).map((t, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-full bg-white text-ink border border-ink/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Chat panel */}
      <div className="rounded-2xl bg-cream-50 border border-ink/5 flex flex-col" style={{ minHeight: 480 }}>
        <div className="px-5 py-4 flex items-center gap-3 rounded-t-2xl" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          <span className="shrink-0 w-10 h-10 grid place-items-center rounded-full bg-vermilion text-cream-50">
            <IconBranch className="w-5 h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-sans font-semibold text-base leading-tight">AIコーチ</div>
            <div className="text-xs text-cream/60 jp-text">回答ごとに次の質問が変わります</div>
          </div>
          {readyToSubmit && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-vermilion text-cream-50">
              <IconCheck className="w-3 h-3" />
              提出OK
            </span>
          )}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-4" style={{ maxHeight: 480 }}>
          {turns.length === 0 && !thinking && (
            <div className="text-sm text-ink-mute jp-text">対話を読み込み中…</div>
          )}
          {turns.map((t, i) => (
            <div key={i} className={`flex gap-3 ${t.role === 'student' ? 'flex-row-reverse' : ''}`}>
              <span
                className={`shrink-0 w-9 h-9 grid place-items-center rounded-full ${
                  t.role === 'coach' ? 'bg-vermilion/10 text-vermilion' : 'bg-ink/10 text-ink'
                }`}
              >
                {t.role === 'coach' ? <IconSpark className="w-4 h-4" /> : <IconUser className="w-4 h-4" />}
              </span>
              <div
                className={`max-w-[78%] px-4 py-3 rounded-2xl jp-text leading-[1.75] text-[14px] ${
                  t.role === 'coach' ? 'bg-white text-ink border border-ink/5' : 'bg-ink text-cream-50'
                }`}
              >
                {t.content}
                {t.options && t.options.length > 0 && t.role === 'coach' && i === turns.length - 1 && !thinking && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => send(opt)}
                        className="text-xs jp-text px-3 py-1.5 rounded-full bg-vermilion/10 text-vermilion hover:bg-vermilion hover:text-cream-50 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <span className="shrink-0 w-9 h-9 grid place-items-center rounded-full bg-vermilion/10 text-vermilion">
                <IconSpark className="w-4 h-4 animate-pulse" />
              </span>
              <div className="px-4 py-3 rounded-2xl bg-white text-ink-mute text-sm border border-ink/5">考えています…</div>
            </div>
          )}
        </div>

        <div className="border-t border-ink/5 p-3 flex gap-2 items-end rounded-b-2xl bg-white">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            placeholder={readyToSubmit ? '成果物は§06で提出。質問もOK' : 'コーチへ返信（Cmd+Enter で送信）'}
            className="flex-1 bg-cream-50 rounded-xl px-4 py-2.5 text-sm jp-text leading-[1.6] resize-none focus:outline-none focus:ring-2 focus:ring-vermilion/30 min-h-[42px] border border-ink/5"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                send(draft);
              }
            }}
          />
          <button
            onClick={() => send(draft)}
            disabled={thinking || !draft.trim()}
            className="bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 inline-flex items-center justify-center"
          >
            <IconNext className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function extractInsights(concept: string): { title: string; body: string }[] {
  if (!concept) return [];
  const sections = concept.split(/\n(?=###\s)/).filter(Boolean);
  if (sections.length >= 2) {
    return sections.slice(0, 4).map((s) => {
      const m = s.match(/^###\s+(.+)$/m);
      const title = m ? m[1].trim() : '要点';
      const body = s.replace(/^###\s+.+$/m, '').trim();
      return { title, body: summarize(body, 120) };
    });
  }
  const paragraphs = concept.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).slice(0, 4);
  const fallbackTitles = ['核となる考え方', '実務での使い方', '注意点と失敗', '次に何をするか'];
  return paragraphs.map((p, i) => ({
    title: fallbackTitles[i] ?? `要点 ${i + 1}`,
    body: summarize(p, 120),
  }));
}

function summarize(text: string, maxChars: number): string {
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxChars) return cleaned;
  const slice = cleaned.slice(0, maxChars);
  const lastPunct = Math.max(slice.lastIndexOf('。'), slice.lastIndexOf('、'), slice.lastIndexOf('. '));
  return (lastPunct > maxChars * 0.6 ? slice.slice(0, lastPunct + 1) : slice + '…').trim();
}

function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="font-sans font-semibold text-lg text-ink jp-balance mt-6">
              {block.replace(/^### /, '')}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="font-sans font-semibold text-xl text-ink jp-balance mt-6">
              {block.replace(/^## /, '')}
            </h3>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          const items = block.split(/\n(?=\d+\.\s)/);
          return (
            <ol key={i} className="space-y-2 ml-1">
              {items.map((item, j) => (
                <li key={j} className="flex gap-3 jp-text text-ink-soft leading-[1.85]">
                  <span className="font-mono text-vermilion text-sm pt-0.5 shrink-0">
                    {item.match(/^(\d+)/)?.[1]}.
                  </span>
                  <span>{item.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="jp-text text-ink-soft leading-[1.85] text-[15px]">
            {block}
          </p>
        );
      })}
    </div>
  );
}
