'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Container } from '@/components/Container';
import {
  IconObjectives,
  IconWhy,
  IconConcept,
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
  goal: string | null;
  learner_track: string | null;
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
}: {
  lessonId: string;
  body: Body | Record<string, unknown>;
  affiliateTarget?: string | null;
  profile: Profile;
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

  // Distill concept text into 3-4 key insight chunks (split by ### headings or sentences)
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
    <>
      {/* Sticky quick-nav */}
      <div
        className="sticky top-0 z-40 border-b border-ink/10 backdrop-blur"
        style={{ background: 'rgba(238,236,231,0.92)' }}
      >
        <Container className="max-w-editorial py-3">
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto">
            {QUICK_NAV.map(({ id, label, Icon }) => (
              <a
                key={id}
                href={`#s-${id}`}
                className="shrink-0 inline-flex items-center gap-2 px-3 py-2 border border-ink/15 hover:border-ink hover:bg-ink hover:text-cream-50 transition text-sm tracking-tight"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="jp-text">{label}</span>
              </a>
            ))}
          </div>
        </Container>
      </div>

      <Container className="max-w-editorial pb-32">
        {/* Stat bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 mb-12">
          <Stat
            label="目標"
            value={String(b.objectives?.length ?? 0)}
            unit="個"
            Icon={IconTarget}
          />
          <Stat
            label="現場の事例"
            value={String(b.examples?.length ?? 0)}
            unit="件"
            Icon={IconExample}
          />
          <Stat
            label="プロンプト"
            value={String(b.prompt_library?.length ?? 0)}
            unit="本"
            Icon={IconLibrary}
          />
          <Stat
            label="所要"
            value={String((b.hands_on?.steps?.length ?? 5) * 5)}
            unit="分"
            Icon={IconClock}
          />
        </div>

        {/* §01 Practice (AI Coach) — front and center */}
        <Section
          id="practice"
          index="01"
          label="Practice"
          title="まず手を動かす"
          subtitle="読むより先に、AIコーチと対話で進める"
          Icon={IconPlay}
          accent
        >
          <CoachConversation
            lessonId={lessonId}
            profile={profile}
            referenceSteps={b.hands_on?.steps ?? []}
            tools={b.hands_on?.tools ?? []}
          />
        </Section>

        {/* §02 Why — single bold sentence in pull-quote treatment */}
        {b.why && (
          <Section id="why" index="02" label="Why" title="なぜ学ぶのか" Icon={IconWhy}>
            <PullQuote text={b.why} />
            {b.objectives && b.objectives.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mt-10">
                {b.objectives.map((o, i) => (
                  <ObjectiveCard key={i} index={i} text={o} />
                ))}
              </div>
            )}
          </Section>
        )}

        {/* §03 Insights (distilled from concept text) */}
        {conceptInsights.length > 0 && (
          <Section
            id="insights"
            index="03"
            label="Insights"
            title="押さえる要点"
            subtitle="長文を読まずに掴める核"
            Icon={IconLayer}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {conceptInsights.map((ins, i) => (
                <InsightCard key={i} index={i + 1} title={ins.title} body={ins.body} />
              ))}
            </div>
            {/* full concept hidden by default */}
            {b.concept && (
              <details className="mt-8 border-t border-ink/15 pt-6">
                <summary className="cursor-pointer text-sm text-ink-soft hover:text-ink jp-text inline-flex items-center gap-2">
                  <IconBook className="w-4 h-4" />
                  もっと深く読む（全文）
                </summary>
                <div className="mt-6 max-w-measure">
                  <Markdown content={b.concept} />
                </div>
              </details>
            )}
          </Section>
        )}

        {/* §04 Examples — visual before→after */}
        {b.examples && b.examples.length > 0 && (
          <Section id="examples" index="04" label="Examples" title="現場の3例" Icon={IconExample}>
            <div className="flex flex-wrap gap-2 mb-6">
              {b.examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setActiveExampleIdx(i)}
                  className={`px-4 py-2 text-sm jp-text border transition ${
                    activeExampleIdx === i
                      ? 'bg-ink text-cream-50 border-ink'
                      : 'border-ink/30 text-ink hover:border-ink'
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
          </Section>
        )}

        {/* §05 Prompts — trading-card grid */}
        {b.prompt_library && b.prompt_library.length > 0 && (
          <Section
            id="prompts"
            index="05"
            label="Library"
            title="そのまま使えるプロンプト"
            subtitle="貼って動く、5本"
            Icon={IconLibrary}
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
          </Section>
        )}

        {/* §06 Submit — visual rubric + score gauge */}
        <Section
          id="submit"
          index="06"
          label="Submit"
          title="成果物を出す"
          subtitle="60点以上で完了 / 採点はAI"
          Icon={IconSubmission}
        >
          {b.rubric && b.rubric.length > 0 && <RubricBars rubric={b.rubric} />}

          {deliverable.what && (
            <div className="mt-8 mag-card">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-10 h-10 grid place-items-center text-vermilion border border-vermilion/40">
                  <IconSubmission className="w-5 h-5" />
                </span>
                <div>
                  <div className="tag text-ink-mute mb-1">提出物</div>
                  <p className="text-ink jp-text leading-[1.85]">{deliverable.what}</p>
                </div>
              </div>
            </div>
          )}

          {deliverable.good_example && (
            <details className="mt-4 mag-card">
              <summary className="cursor-pointer text-sm text-ink-soft hover:text-ink jp-text inline-flex items-center gap-2">
                <IconQuote className="w-4 h-4" />
                良い提出例を覗く
              </summary>
              <p className="mt-4 text-sm text-ink jp-text leading-[1.85] whitespace-pre-wrap">
                {deliverable.good_example}
              </p>
            </details>
          )}

          <div className="mt-8 border border-ink/15 bg-paper">
            <div className="px-4 py-2 border-b border-ink/10 flex items-center justify-between">
              <span className="tag text-ink-mute">YOUR DELIVERABLE</span>
              <span className="tag text-ink-mute">
                {submission.length} / {deliverable.min_chars ?? 200}
              </span>
            </div>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              className="w-full bg-paper px-5 py-4 min-h-[220px] font-mono text-sm leading-[1.7] focus:outline-none resize-y"
              placeholder="ここに成果物を貼り付け（テキスト/URL/コードでもOK）"
            />
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              disabled={scoring || !submission.trim()}
              onClick={submitWork}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {scoring ? 'AI採点中…' : 'AI採点を受ける'}
              <IconNext className="w-4 h-4" />
            </button>
          </div>

          {score && <ScoreGauge score={score.score} feedback={score.feedback_md} />}
        </Section>

        {/* Affiliate publish card */}
        {affiliateTarget && <PublishCard target={affiliateTarget} />}

        {/* Next action */}
        {b.next_action && (
          <div className="mt-12 grid md:grid-cols-12 gap-6 items-center border-t border-ink/15 pt-8">
            <div className="md:col-span-2 tag text-ink-mute">Next</div>
            <p className="md:col-span-8 text-lg text-ink jp-text leading-[1.85]">{b.next_action}</p>
            <div className="md:col-span-2 flex justify-start md:justify-end">
              <Link
                href={`/courses/${lessonId.split('_')[0]}`}
                className="inline-flex items-center gap-2 text-vermilion hover:text-ink transition"
              >
                <span className="text-sm">コースへ</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

/* ---------- Sub-components ---------- */

function Section({
  id,
  index,
  label,
  title,
  subtitle,
  Icon,
  accent,
  children,
}: {
  id?: string;
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id ? `s-${id}` : undefined} className="mt-20 first:mt-4 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <span className={`tag ${accent ? 'text-vermilion' : 'text-ink-mute'}`}>§ {index}</span>
        <span className="rule flex-1" />
        <span className={`tag ${accent ? 'text-vermilion' : 'text-ink-mute'}`}>{label}</span>
      </div>
      <div className="flex items-end gap-5 mb-10 flex-wrap">
        {Icon ? (
          <span
            className={`shrink-0 w-14 h-14 grid place-items-center border ${
              accent ? 'text-vermilion border-vermilion bg-vermilion/5' : 'text-ink border-ink/30'
            }`}
          >
            <Icon className="w-7 h-7" />
          </span>
        ) : null}
        <div className="flex-1 min-w-0">
          <h2 className="h-display text-3xl md:text-5xl text-ink jp-balance leading-[1.05]">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-ink-mute jp-text">{subtitle}</p>}
        </div>
      </div>
      {children}
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
    <div className="bg-paper border border-ink/10 p-5">
      <div className="flex items-center justify-between text-ink-mute">
        <span className="tag">{label}</span>
        <Icon className="w-4 h-4" />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-serif text-4xl md:text-5xl text-ink leading-none">{value}</span>
        <span className="text-sm text-ink-mute">{unit}</span>
      </div>
    </div>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote
      className="relative pl-8 md:pl-12 max-w-3xl"
      style={{ borderLeft: '3px solid var(--vermilion)' }}
    >
      <span className="absolute -left-3 top-0 w-6 h-6 grid place-items-center bg-cream text-vermilion">
        <IconQuote className="w-4 h-4" />
      </span>
      <p className="font-serif text-2xl md:text-3xl text-ink jp-balance leading-[1.55]">{text}</p>
    </blockquote>
  );
}

function ObjectiveCard({ index, text }: { index: number; text: string }) {
  return (
    <div className="bg-paper border border-ink/10 p-5 hover:border-ink transition">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-serif text-2xl text-vermilion leading-none">0{index + 1}</span>
        <span className="rule flex-1" />
      </div>
      <p className="text-sm md:text-base text-ink jp-text leading-[1.7]">{text}</p>
    </div>
  );
}

function InsightCard({ index, title, body }: { index: number; title: string; body: string }) {
  return (
    <div className="bg-paper border border-ink/10 p-6 hover:border-ink transition flex gap-4">
      <div className="shrink-0">
        <span className="num-chip">{String(index).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0">
        <div className="font-serif text-lg text-ink jp-balance mb-2 leading-tight">{title}</div>
        <p className="text-sm text-ink-soft jp-text leading-[1.8]">{body}</p>
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
    <div className="bg-paper border border-ink/10">
      <div className="px-7 py-5 bg-ink text-cream-50 flex items-center gap-4">
        <IconExample className="w-5 h-5 text-vermilion shrink-0" />
        <h3 className="font-serif text-xl jp-balance">{ex.title}</h3>
      </div>
      {/* Visual before -> after */}
      <div className="grid md:grid-cols-[1fr,auto,1fr] items-stretch">
        <div className="p-7 border-r border-b md:border-b-0 border-ink/10">
          <div className="tag text-ink-mute mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-ink-mute rounded-full" />
            BEFORE
          </div>
          <p className="text-ink-soft jp-text leading-[1.85]">{ex.before}</p>
        </div>
        <div className="hidden md:flex items-center justify-center px-4">
          <span className="w-10 h-10 grid place-items-center bg-vermilion text-cream-50">
            <IconArrowRight className="w-5 h-5" />
          </span>
        </div>
        <div className="p-7 border-b md:border-b-0 border-ink/10" style={{ background: 'var(--cream)' }}>
          <div className="tag text-vermilion mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-vermilion rounded-full" />
            AFTER
          </div>
          <p className="text-ink jp-text leading-[1.85] font-medium">{ex.after}</p>
        </div>
      </div>
      <div className="px-7 py-5 border-t border-ink/10 flex items-start gap-3">
        <IconLightning className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="tag text-ink-mute mb-1">APPROACH</div>
          <p className="text-sm text-ink jp-text leading-[1.75]">{ex.approach}</p>
        </div>
      </div>
      <div className="px-7 py-5 border-t border-ink/10" style={{ background: 'var(--cream)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="tag text-ink-mute">使えるプロンプト</span>
          <button
            onClick={() => onCopy(ex.prompt)}
            className="tag inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-cream-50 transition"
          >
            {copied ? (
              <>
                <IconCheck className="w-3.5 h-3.5" />
                COPIED
              </>
            ) : (
              <>
                <IconCopy className="w-3.5 h-3.5" />
                COPY
              </>
            )}
          </button>
        </div>
        <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap">{ex.prompt}</pre>
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
      className="text-left bg-paper border border-ink/10 p-5 hover:border-ink transition group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="tag text-vermilion">PROMPT {String(index).padStart(2, '0')}</div>
        <div className="tag text-ink-mute">{index}/{total}</div>
      </div>
      <h3 className="font-serif text-lg text-ink jp-balance mb-2 leading-tight">{item.name}</h3>
      <p className="text-xs text-ink-soft jp-text leading-[1.7] line-clamp-3">{item.use_case}</p>
      <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between text-ink-mute group-hover:text-vermilion transition">
        <span className="tag">開く</span>
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
        className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-paper border border-ink/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-ink text-cream-50 flex items-center justify-between">
          <div>
            <div className="tag text-vermilion mb-0.5">PROMPT {String(index).padStart(2, '0')}</div>
            <div className="font-serif text-lg jp-balance">{item.name}</div>
          </div>
          <button onClick={onClose} className="text-cream-50/70 hover:text-cream-50 text-2xl leading-none px-2">
            ×
          </button>
        </div>
        <div className="px-6 py-5 border-b border-ink/10">
          <div className="tag text-ink-mute mb-2">USE CASE</div>
          <p className="text-sm text-ink jp-text leading-[1.8]">{item.use_case}</p>
        </div>
        <div className="px-6 py-5" style={{ background: 'var(--cream)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="tag text-ink-mute">プロンプト本文</span>
            <button
              onClick={onCopy}
              className="tag inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-cream-50 transition"
            >
              {copied ? (
                <>
                  <IconCheck className="w-3.5 h-3.5" />
                  COPIED
                </>
              ) : (
                <>
                  <IconCopy className="w-3.5 h-3.5" />
                  COPY
                </>
              )}
            </button>
          </div>
          <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap">{item.prompt}</pre>
        </div>
      </div>
    </div>
  );
}

function RubricBars({ rubric }: { rubric: RubricItem[] }) {
  const total = rubric.reduce((s, r) => s + r.weight, 0) || 100;
  return (
    <div className="bg-paper border border-ink/10 p-6">
      <div className="tag text-ink-mute mb-4">採点配分</div>
      <div className="space-y-4">
        {rubric.map((r, i) => {
          const pct = (r.weight / total) * 100;
          return (
            <div key={i}>
              <div className="flex items-baseline justify-between mb-1.5">
                <div className="font-serif text-base text-ink jp-balance">{r.criterion}</div>
                <div className="tag text-vermilion">{r.weight}pt</div>
              </div>
              <div className="h-2 bg-cream-300/60 relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-vermilion"
                  style={{ width: `${pct}%` }}
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
  const SIZE = 220;
  const STROKE = 18;
  const R = (SIZE - STROKE) / 2;
  const C = 2 * Math.PI * R;
  const offset = C - (Math.min(Math.max(score, 0), 100) / 100) * C;
  const passed = score >= 60;
  return (
    <div className="mt-10 grid md:grid-cols-[auto,1fr] gap-8 items-start p-8" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
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
            strokeLinecap="butt"
            style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-serif text-6xl leading-none text-cream">{score}</div>
            <div className="text-xs tracking-widest uppercase text-cream/60 mt-2">/ 100</div>
          </div>
        </div>
      </div>
      <div>
        <div className="tag text-cream/60 mb-2 inline-flex items-center gap-2">
          {passed ? <IconCheck className="w-3.5 h-3.5" /> : <IconLightning className="w-3.5 h-3.5" />}
          {passed ? 'COMPLETED' : 'KEEP GOING'}
        </div>
        <h3 className="h-serif text-3xl text-cream mb-4">{passed ? 'クリア' : 'もう一歩'}</h3>
        <pre className="whitespace-pre-wrap text-sm text-cream/85 jp-text leading-[1.85] font-sans">{feedback}</pre>
      </div>
    </div>
  );
}

function PublishCard({ target }: { target: string }) {
  return (
    <div className="mt-16 p-10 grid md:grid-cols-[1fr,auto] gap-6 items-center" style={{ background: 'var(--vermilion)', color: 'var(--cream)' }}>
      <div>
        <div className="tag text-cream/70 mb-3">PUBLISH STEP</div>
        <h3 className="h-serif text-3xl mb-3 jp-balance">
          {target} で世に出す準備
        </h3>
        <p className="jp-text text-cream/90 leading-[1.85] max-w-measure">
          このレッスンで作ったものを公開URLにするには {target} のアカウントが必要です。受講生特典つきリンクから登録できます。
        </p>
      </div>
      <Link
        href={AFFILIATE_LINKS[target] ?? '#'}
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-3 px-7 py-4 font-medium tracking-tight shrink-0"
        style={{ background: 'var(--ink)', color: 'var(--cream)' }}
      >
        {target} を開く
        <IconArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/**
 * AI Coach — primary interactive component.
 */
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
    <div className="grid md:grid-cols-[280px,1fr] gap-6 items-stretch">
      {/* Side: progress timeline + persona */}
      <aside className="bg-paper border border-ink/10 p-5 flex flex-col">
        <div className="tag text-ink-mute mb-3">YOUR PROGRESS</div>
        {/* Vertical step timeline */}
        <div className="relative pl-5 space-y-3 flex-1">
          <div
            className="absolute left-1.5 top-1 bottom-1 w-px bg-ink/20"
            aria-hidden
          />
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
                      ? 'bg-cream border-vermilion'
                      : 'bg-cream border-ink/30'
                  }`}
                />
                <div
                  className={`text-xs jp-text leading-[1.55] ${
                    reached ? 'text-ink-mute line-through' : current ? 'text-ink font-medium' : 'text-ink/70'
                  }`}
                >
                  {(s as string).replace(/^手順\d+[.:：]?\s*/, '').replace(/^ステップ\d+[.:：]?\s*/, '').slice(0, 60)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Persona */}
        <div className="mt-5 pt-5 border-t border-ink/10">
          <div className="tag text-ink-mute mb-2">FOR YOU</div>
          <div className="font-serif text-base text-ink leading-tight jp-balance">
            {profile.display_name ?? 'You'}
          </div>
          <div className="text-xs text-ink-mute mt-1 jp-text">
            登録済み: 業種・目標・トラック<br />
            <span className="text-ink-mute/80">同じ質問はしません</span>
          </div>
        </div>

        {tools.length > 0 && (
          <div className="mt-4">
            <div className="tag text-ink-mute mb-2">TOOLS</div>
            <div className="flex flex-wrap gap-1.5">
              {tools.slice(0, 5).map((t, i) => (
                <span key={i} className="tag text-ink border border-ink/30 px-2 py-0.5 text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main: chat */}
      <div className="border border-ink/15 bg-paper flex flex-col" style={{ minHeight: 480 }}>
        {/* Header */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-ink/10" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
          <span className="w-9 h-9 grid place-items-center text-vermilion border border-vermilion/40">
            <IconBranch className="w-5 h-5" />
          </span>
          <div className="flex-1">
            <div className="font-serif text-lg leading-tight">AIコーチ</div>
            <div className="text-xs text-cream/60 jp-text">回答ごとに次の質問が変わります</div>
          </div>
          {readyToSubmit && (
            <span className="tag text-vermilion border border-vermilion px-2 py-1 text-[10px] inline-flex items-center gap-1">
              <IconCheck className="w-3 h-3" />
              SUBMIT READY
            </span>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-5" style={{ maxHeight: 480 }}>
          {turns.length === 0 && !thinking && (
            <div className="text-sm text-ink-mute jp-text">対話を読み込み中…</div>
          )}
          {turns.map((t, i) => (
            <div key={i} className={`flex gap-3 ${t.role === 'student' ? 'flex-row-reverse' : ''}`}>
              <span
                className={`shrink-0 w-9 h-9 grid place-items-center border ${
                  t.role === 'coach' ? 'border-vermilion/40 text-vermilion bg-vermilion/5' : 'border-ink/30 text-ink'
                }`}
              >
                {t.role === 'coach' ? <IconSpark className="w-4 h-4" /> : <IconUser className="w-4 h-4" />}
              </span>
              <div
                className={`max-w-[78%] px-4 py-3 jp-text leading-[1.75] text-[14px] ${
                  t.role === 'coach' ? 'bg-cream-100 text-ink' : 'bg-ink text-cream-50'
                }`}
              >
                {t.content}
                {t.options && t.options.length > 0 && t.role === 'coach' && i === turns.length - 1 && !thinking && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => send(opt)}
                        className="text-xs jp-text px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-cream-50 transition"
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
              <span className="shrink-0 w-9 h-9 grid place-items-center border border-vermilion/40 text-vermilion bg-vermilion/5">
                <IconSpark className="w-4 h-4 animate-pulse" />
              </span>
              <div className="px-4 py-3 bg-cream-100 text-ink-mute text-sm">考えています…</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-ink/10 p-3 flex gap-2 items-end">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={1}
            placeholder={readyToSubmit ? '成果物は§06で提出。コーチに追加質問もOK' : 'コーチへ返信（Cmd+Enter で送信）'}
            className="flex-1 bg-paper border border-ink/15 px-3 py-2.5 text-sm jp-text leading-[1.6] resize-none focus:border-vermilion focus:outline-none min-h-[44px]"
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
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0 py-3 px-5"
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
  // Prefer explicit ### sections
  const sections = concept.split(/\n(?=###\s)/).filter(Boolean);
  if (sections.length >= 2) {
    return sections.slice(0, 4).map((s) => {
      const m = s.match(/^###\s+(.+)$/m);
      const title = m ? m[1].trim() : '要点';
      const body = s.replace(/^###\s+.+$/m, '').trim();
      return { title, body: summarize(body, 120) };
    });
  }
  // Fall back: split by paragraphs and take first 3-4 with hand-crafted titles
  const paragraphs = concept.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).slice(0, 4);
  const fallbackTitles = ['核となる考え方', '実務での使い方', '注意点と失敗', '次に何をするか'];
  return paragraphs.map((p, i) => ({ title: fallbackTitles[i] ?? `要点 ${i + 1}`, body: summarize(p, 120) }));
}

function summarize(text: string, maxChars: number): string {
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxChars) return cleaned;
  // Cut at the last sentence boundary before maxChars
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
            <h3 key={i} className="h-serif text-xl text-ink jp-balance mt-6">
              {block.replace(/^### /, '')}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="h-serif text-2xl text-ink jp-balance mt-6">
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
