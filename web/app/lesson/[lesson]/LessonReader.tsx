'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  IconChat,
  IconBranch,
  IconUser,
  IconSpark,
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

const AFFILIATE_LINKS: Record<string, string> = {
  vercel: process.env.NEXT_PUBLIC_AFFILIATE_VERCEL || 'https://vercel.com',
  supabase: process.env.NEXT_PUBLIC_AFFILIATE_SUPABASE || 'https://supabase.com',
  squarespace: process.env.NEXT_PUBLIC_AFFILIATE_SQUARESPACE || 'https://squarespace.com',
};

type CoachTurn = { role: 'coach' | 'student'; content: string; options?: string[] };

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

  const deliverable: Deliverable =
    typeof b.deliverable === 'string' ? { what: b.deliverable } : b.deliverable ?? {};

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
    <Container className="max-w-editorial pb-32">
      {/* Section break */}
      <div className="section-break mt-8 mb-16">
        <span className="label">Lesson Reader</span>
        <span className="label opacity-60">No.{lessonId}</span>
      </div>

      {/* Objectives */}
      {b.objectives && b.objectives.length > 0 && (
        <Section index="01" label="Objectives" title="このレッスンで身につくこと" Icon={IconObjectives}>
          <div className="grid md:grid-cols-3 gap-5">
            {b.objectives.map((o, i) => (
              <div key={i} className="mag-card">
                <div className="tag text-vermilion mb-3">0{i + 1}</div>
                <p className="jp-text text-ink leading-[1.8]">{o}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Why */}
      {b.why && (
        <Section index="02" label="Why" title="なぜ学ぶのか" Icon={IconWhy}>
          <div className="grid-12">
            <p className="col-span-12 md:col-span-9 text-lg md:text-xl text-ink jp-text leading-[2]">{b.why}</p>
          </div>
        </Section>
      )}

      {/* Concept */}
      {b.concept && (
        <Section index="03" label="Concept" title="本質を理解する" Icon={IconConcept}>
          <div className="grid-12">
            <div className="col-span-12 md:col-span-9">
              <Markdown content={b.concept} />
            </div>
          </div>
        </Section>
      )}

      {/* Examples */}
      {b.examples && b.examples.length > 0 && (
        <Section index="04" label="Examples" title="現場の3例" Icon={IconExample}>
          <div className="space-y-8">
            {b.examples.map((ex, i) => (
              <article key={i} className="bg-paper border border-ink/10 overflow-hidden">
                <header className="px-7 py-5 bg-ink text-cream-50 grid-12 items-center gap-3">
                  <div className="col-span-2 tag text-cream-50/60">CASE 0{i + 1}</div>
                  <div className="col-span-10 font-serif text-xl jp-balance">{ex.title}</div>
                </header>
                <div className="grid md:grid-cols-2 border-b border-ink/10">
                  <BeforeAfter label="Before" text={ex.before} variant="muted" />
                  <BeforeAfter label="After" text={ex.after} variant="brand" />
                </div>
                <div className="px-7 py-6 border-b border-ink/10">
                  <div className="tag text-ink-mute mb-2">Approach</div>
                  <p className="jp-text text-ink leading-[1.85]">{ex.approach}</p>
                </div>
                <div className="px-7 py-6" style={{ background: 'var(--paper)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="tag text-ink-mute">そのまま使えるプロンプト</div>
                    <CopyButton onClick={() => copy(ex.prompt, `ex-${i}`)} copied={copiedKey === `ex-${i}`} />
                  </div>
                  <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap">{ex.prompt}</pre>
                </div>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* Prompt library */}
      {b.prompt_library && b.prompt_library.length > 0 && (
        <Section index="05" label="Library" title="プロンプト・ライブラリ" Icon={IconLibrary}>
          <p className="text-ink-soft jp-text mb-7 max-w-measure">
            あなたの業務にそのまま貼り付けて使える、実戦プロンプトを5本収録。
          </p>
          <div className="grid gap-4">
            {b.prompt_library.map((p, i) => (
              <details
                key={i}
                className="group bg-paper border border-ink/10 overflow-hidden"
              >
                <summary className="px-6 py-5 cursor-pointer flex items-center justify-between gap-4 hover:bg-cream">
                  <div className="flex-1">
                    <div className="tag text-vermilion mb-1">PROMPT {String(i + 1).padStart(2, '0')}</div>
                    <div className="font-serif text-lg text-ink jp-balance">{p.name}</div>
                    <div className="text-sm text-ink-soft jp-text mt-1">{p.use_case}</div>
                  </div>
                  <span className="text-ink/40 group-open:rotate-45 transition text-2xl font-light leading-none">+</span>
                </summary>
                <div className="px-6 pb-6" style={{ background: 'var(--cream)' }}>
                  <div className="flex items-center justify-end mb-2">
                    <CopyButton onClick={() => copy(p.prompt, `pl-${i}`)} copied={copiedKey === `pl-${i}`} />
                  </div>
                  <pre className="font-mono text-xs leading-[1.75] text-ink whitespace-pre-wrap">{p.prompt}</pre>
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* Hands-on (interactive AI coach) */}
      {b.hands_on && (b.hands_on.steps?.length ?? 0) > 0 && (
        <Section index="06" label="Hands-on" title="AIコーチと進める" Icon={IconHandsOn}>
          {b.hands_on.intro && (
            <p className="text-lg text-ink jp-text leading-[1.85] mb-6 max-w-measure">{b.hands_on.intro}</p>
          )}
          {b.hands_on.tools && b.hands_on.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {b.hands_on.tools.map((t, i) => (
                <span key={i} className="tag text-ink border border-ink/30 px-3 py-1">
                  {t}
                </span>
              ))}
            </div>
          )}
          <CoachConversation
            lessonId={lessonId}
            profile={profile}
            referenceSteps={b.hands_on.steps ?? []}
          />
        </Section>
      )}

      {/* Submission */}
      <Section index="07" label="Submission" title="成果物 → AI採点" Icon={IconSubmission}>
        {deliverable.what && (
          <div className="mag-card mb-6">
            <div className="tag text-ink-mute mb-2">提出物の要件</div>
            <p className="text-ink jp-text leading-[1.85]">{deliverable.what}</p>
            {deliverable.min_chars ? (
              <div className="mt-3 tag text-ink-mute">MIN CHARS · {deliverable.min_chars}</div>
            ) : null}
          </div>
        )}

        {deliverable.good_example && (
          <details className="mb-6 mag-card">
            <summary className="cursor-pointer text-sm text-ink-soft hover:text-ink">良い提出例を見る</summary>
            <div className="mt-4 text-sm text-ink jp-text leading-[1.85] whitespace-pre-wrap">
              {deliverable.good_example}
            </div>
          </details>
        )}

        {b.rubric && b.rubric.length > 0 && (
          <div className="mb-7">
            <div className="tag text-ink-mute mb-3">採点基準</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {b.rubric.map((r, i) => (
                <div key={i} className="bg-paper border border-ink/10 p-4">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="font-serif text-ink">{r.criterion}</div>
                    <div className="tag text-vermilion">{r.weight}pt</div>
                  </div>
                  <div className="text-xs text-ink-soft jp-text leading-[1.7]">{r.what_we_check}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <textarea
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          className="w-full bg-paper border border-ink/15 px-5 py-4 min-h-[240px] font-mono text-sm leading-[1.7] focus:border-vermilion focus:outline-none"
          placeholder="あなたの成果物をここに貼り付け（テキスト/URL/コードでもOK）"
        />
        <div className="flex items-center justify-between mt-3">
          <div className="tag text-ink-mute">
            {submission.length} / {deliverable.min_chars ?? 200} chars
          </div>
          <button
            disabled={scoring || !submission.trim()}
            onClick={submitWork}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {scoring ? 'AI採点中…' : 'AI採点を受ける'}
            <IconNext className="w-4 h-4" />
          </button>
        </div>

        {score && (
          <div className="mt-10 p-8" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
            <div className="flex items-baseline gap-3">
              <div className="font-serif text-7xl leading-none text-vermilion">{score.score}</div>
              <div className="text-cream/50 text-lg">/ 100</div>
            </div>
            <pre className="whitespace-pre-wrap mt-5 text-sm text-cream/85 jp-text leading-[1.85] font-sans">
              {score.feedback_md}
            </pre>
          </div>
        )}
      </Section>

      {/* Affiliate publish nudge */}
      {affiliateTarget && (
        <div className="mt-16 p-10" style={{ background: 'var(--vermilion)', color: 'var(--cream)' }}>
          <div className="tag text-cream/70 mb-3">PUBLISH STEP</div>
          <h3 className="h-serif text-3xl mb-4 jp-balance">
            {affiliateTarget} のアカウントを準備しよう
          </h3>
          <p className="jp-text text-cream/90 leading-[1.85] mb-6 max-w-measure">
            このレッスンの成果物を世に出すために、{affiliateTarget} のアカウントが必要です。受講生特典付きリンクから登録できます。
          </p>
          <Link
            href={AFFILIATE_LINKS[affiliateTarget] ?? '#'}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-3 px-7 py-4 font-medium tracking-tight"
            style={{ background: 'var(--ink)', color: 'var(--cream)' }}
          >
            {affiliateTarget} を開く
            <IconNext className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Next action */}
      {b.next_action && (
        <div className="mt-12 rule pt-8">
          <div className="tag text-ink-mute mb-3">Next Action</div>
          <p className="text-lg text-ink jp-text leading-[1.85] max-w-measure">{b.next_action}</p>
        </div>
      )}
    </Container>
  );
}

function Section({
  index,
  label,
  title,
  Icon,
  children,
}: {
  index: string;
  label: string;
  title: string;
  Icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20 first:mt-0 scroll-mt-24" id={`s-${index}`}>
      <div className="flex items-center gap-4 mb-6">
        <span className="tag text-vermilion">§ {index}</span>
        <span className="rule flex-1" />
        <span className="tag text-ink-mute">{label}</span>
      </div>
      <div className="grid-12 mb-10">
        <div className="col-span-12 md:col-span-9 flex items-start gap-5">
          {Icon ? (
            <span className="shrink-0 w-12 h-12 grid place-items-center text-vermilion border border-vermilion/30">
              <Icon className="w-6 h-6" />
            </span>
          ) : null}
          <h2 className="h-display text-4xl md:text-5xl text-ink jp-balance leading-[1.05]">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function BeforeAfter({
  label,
  text,
  variant,
}: {
  label: string;
  text: string;
  variant: 'muted' | 'brand';
}) {
  return (
    <div className="px-7 py-6 border-b md:border-b-0 md:border-r border-ink/10 last:border-r-0">
      <div className={`tag mb-2 ${variant === 'muted' ? 'text-ink-mute' : 'text-vermilion'}`}>{label}</div>
      <p className={`jp-text leading-[1.85] ${variant === 'muted' ? 'text-ink-soft' : 'text-ink font-medium'}`}>{text}</p>
    </div>
  );
}

function CopyButton({ onClick, copied }: { onClick: () => void; copied: boolean }) {
  return (
    <button
      onClick={onClick}
      className="tag inline-flex items-center gap-1.5 px-3 py-1.5 border border-ink text-ink hover:bg-ink hover:text-cream-50 transition"
    >
      {copied ? (
        <>
          <IconCheck className="w-3.5 h-3.5" />
          DONE
        </>
      ) : (
        <>
          <IconCopy className="w-3.5 h-3.5" />
          COPY
        </>
      )}
    </button>
  );
}

/**
 * Interactive AI coach. Pulls profile context from server so it never re-asks
 * basic info (industry / company / goal). Branches each turn based on answer.
 */
function CoachConversation({
  lessonId,
  profile,
  referenceSteps,
}: {
  lessonId: string;
  profile: Profile;
  referenceSteps: string[];
}) {
  const [turns, setTurns] = useState<CoachTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (turns.length === 0) {
      kickoff();
    }
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
        { role: 'coach', content: '一時的にコーチに接続できませんでした。手順を見ながら進めてください。' },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function kickoff() {
    await callCoach([], 'kickoff');
  }

  async function send(content: string) {
    if (!content.trim()) return;
    const next = [...turns, { role: 'student' as const, content }];
    setTurns(next);
    setDraft('');
    await callCoach(next, 'continue');
  }

  return (
    <div className="border border-ink/15 bg-paper">
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-ink/10" style={{ background: 'var(--cream)' }}>
        <span className="w-9 h-9 grid place-items-center text-vermilion border border-vermilion/30">
          <IconBranch className="w-5 h-5" />
        </span>
        <div className="flex-1">
          <div className="font-serif text-lg text-ink leading-tight">AIコーチとの対話で進める</div>
          <div className="text-xs text-ink-mute jp-text">
            {profile.display_name ? `${profile.display_name}さん` : 'あなた'}の業種・目標は登録済み。同じ質問は二度しません。
          </div>
        </div>
        <span className="tag text-ink-mute hidden md:inline">{turns.length} turns</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="max-h-[420px] overflow-y-auto px-6 py-6 space-y-5">
        {turns.length === 0 && !thinking && (
          <div className="text-sm text-ink-mute jp-text">対話を読み込み中…</div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={`flex gap-3 ${t.role === 'student' ? 'flex-row-reverse' : ''}`}>
            <span
              className={`shrink-0 w-8 h-8 grid place-items-center border ${
                t.role === 'coach' ? 'border-vermilion/40 text-vermilion' : 'border-ink/30 text-ink'
              }`}
            >
              {t.role === 'coach' ? <IconSpark className="w-4 h-4" /> : <IconUser className="w-4 h-4" />}
            </span>
            <div
              className={`max-w-[80%] px-4 py-3 jp-text leading-[1.8] text-[15px] ${
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
                      className="tag text-ink border border-ink/40 px-3 py-1.5 hover:bg-ink hover:text-cream-50 transition"
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
            <span className="shrink-0 w-8 h-8 grid place-items-center border border-vermilion/40 text-vermilion">
              <IconSpark className="w-4 h-4" />
            </span>
            <div className="px-4 py-3 bg-cream-100 text-ink-mute text-sm">考えています…</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-ink/10 p-4 flex gap-3 items-start" style={{ background: 'var(--cream)' }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder={readyToSubmit ? '成果物を§07の提出欄に貼り付けて採点を受けましょう。追加で聞きたいことがあれば入力。' : 'コーチへ返信（複数行可）'}
          className="flex-1 bg-paper border border-ink/15 px-4 py-3 text-sm jp-text leading-[1.7] resize-none focus:border-vermilion focus:outline-none"
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
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shrink-0"
        >
          送信
          <IconNext className="w-4 h-4" />
        </button>
      </div>

      {/* Reference steps (collapsed by default) */}
      <details className="border-t border-ink/10 px-6 py-4 text-sm">
        <summary className="cursor-pointer text-ink-soft hover:text-ink jp-text">
          参考: 元の手順リスト（{referenceSteps.length}手順）
        </summary>
        <ol className="mt-3 space-y-2">
          {referenceSteps.map((s, i) => (
            <li key={i} className="flex gap-3 jp-text text-ink-soft leading-[1.7]">
              <span className="font-mono text-vermilion shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span>{s.replace(/^手順\d+:\s*/, '').replace(/^ステップ\d+:\s*/, '')}</span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}

function Markdown({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="h-serif text-2xl text-ink jp-balance mt-8 first:mt-0">
              {block.replace(/^### /, '')}
            </h3>
          );
        }
        if (block.startsWith('## ')) {
          return (
            <h3 key={i} className="h-serif text-3xl text-ink jp-balance mt-8 first:mt-0">
              {block.replace(/^## /, '')}
            </h3>
          );
        }
        if (/^\d+\.\s/.test(block)) {
          const items = block.split(/\n(?=\d+\.\s)/);
          return (
            <ol key={i} className="space-y-3 ml-1">
              {items.map((item, j) => (
                <li key={j} className="flex gap-4 jp-text text-ink leading-[1.85]">
                  <span className="font-mono text-vermilion text-sm pt-1 shrink-0">
                    {item.match(/^(\d+)/)?.[1]}.
                  </span>
                  <span>{item.replace(/^\d+\.\s*/, '')}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (block.startsWith('* ') || block.startsWith('- ')) {
          const items = block.split(/\n(?=[*-]\s)/);
          return (
            <ul key={i} className="space-y-3">
              {items.map((item, j) => (
                <li key={j} className="flex gap-3 jp-text text-ink leading-[1.85]">
                  <span className="mt-2.5 w-1.5 h-1.5 bg-vermilion shrink-0" />
                  <span>{item.replace(/^[*-]\s*/, '')}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="jp-text text-ink leading-[2] text-base md:text-[17px]">
            {block}
          </p>
        );
      })}
    </div>
  );
}
