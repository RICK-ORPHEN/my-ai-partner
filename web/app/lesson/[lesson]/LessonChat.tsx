'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Msg = { role: 'assistant' | 'user' | 'task' | 'prompt_user'; msg: string };
type Props = {
  lessonId: string;
  script: Msg[];
  deliverable: string;
  affiliateTarget?: string | null;
};

const AFFILIATE_LINKS: Record<string,string> = {
  vercel: process.env.NEXT_PUBLIC_AFFILIATE_VERCEL || 'https://vercel.com',
  supabase: process.env.NEXT_PUBLIC_AFFILIATE_SUPABASE || 'https://supabase.com',
  squarespace: process.env.NEXT_PUBLIC_AFFILIATE_SQUARESPACE || 'https://squarespace.com'
};

export function LessonChat({ lessonId, script, deliverable, affiliateTarget }: Props) {
  const supabase = createClient();
  const [shown, setShown] = useState(1);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [pending, setPending] = useState('');
  const [submission, setSubmission] = useState('');
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState<{ score: number; feedback_md: string } | null>(null);

  function next() {
    if (shown < script.length) setShown(shown + 1);
  }

  function sendInput() {
    if (!pending.trim()) return;
    setUserInputs([...userInputs, pending.trim()]);
    setPending('');
    next();
  }

  async function submitWork() {
    setScoring(true);
    const res = await fetch('/api/submissions/score', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lesson_id: lessonId, content_text: submission })
    });
    const j = await res.json();
    setScore(j);
    setScoring(false);
    if (j?.score && j.score >= 60) {
      await supabase.from('lesson_progress').upsert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString()
      });
    }
  }

  return (
    <>
      <div className="card p-6 mt-6 space-y-4">
        {script.slice(0, shown).map((m, i) => {
          if (m.role === 'assistant') return <div key={i} className="bg-bg-soft" />;
          return null;
        })}
        {script.slice(0, shown).map((m, i) => (
          <div key={i} className={
            m.role === 'assistant' ? 'flex gap-3 items-start' :
            m.role === 'task' ? 'border-l-4 border-brand pl-4 py-2' :
            'flex gap-3 items-start justify-end'
          }>
            {m.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-brand text-white grid place-items-center text-sm font-bold">AI</div>}
            <div className={
              m.role === 'assistant' ? 'rounded-2xl bg-white border px-5 py-3 max-w-[80%]' :
              m.role === 'task' ? 'text-ink/80' :
              'rounded-2xl bg-brand text-white px-5 py-3 max-w-[80%]'
            }>{m.msg}</div>
          </div>
        ))}

        {/* current step controls */}
        {shown < script.length && (() => {
          const cur = script[shown - 1];
          if (cur?.role === 'prompt_user') {
            return (
              <div className="flex gap-2 mt-3">
                <input value={pending} onChange={e=>setPending(e.target.value)} className="flex-1 border rounded-md px-4 py-3" placeholder="返信を入力" />
                <button onClick={sendInput} className="btn-primary">送信</button>
              </div>
            );
          }
          return (
            <button onClick={next} className="btn-ghost mt-3">続ける</button>
          );
        })()}
      </div>

      {/* Deliverable */}
      {shown >= script.length && (
        <div className="card p-7 mt-6">
          <h3 className="text-xl font-semibold">成果物の提出</h3>
          <p className="text-ink/70 mt-2">{deliverable}</p>
          <textarea value={submission} onChange={e=>setSubmission(e.target.value)} className="w-full border rounded-md px-4 py-3 min-h-[160px] mt-4" placeholder="あなたの成果物を貼り付け（テキスト/URL/コードでもOK）" />
          <button disabled={scoring || !submission.trim()} onClick={submitWork} className="btn-primary mt-4">
            {scoring ? 'AI採点中…' : 'AI採点を受ける'}
          </button>
          {score && (
            <div className="mt-6 border-t pt-5">
              <div className="text-display text-5xl text-brand">{score.score}<span className="text-base text-ink/40">/100</span></div>
              <pre className="whitespace-pre-wrap mt-3 text-sm text-ink/80">{score.feedback_md}</pre>
            </div>
          )}
          {affiliateTarget && (
            <div className="mt-6 p-5 rounded-xl bg-brand/5 border border-brand/20">
              <div className="font-semibold">公開ステップ — {affiliateTarget} を準備</div>
              <p className="text-sm text-ink/70 mt-1">このレッスンの成果物を世に出すために、{affiliateTarget} のアカウントを作りましょう。</p>
              <Link href={AFFILIATE_LINKS[affiliateTarget] ?? '#'} target="_blank" rel="noopener" className="btn-primary mt-3 inline-flex">{affiliateTarget} を開く →</Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
