'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { INDUSTRIES } from '@/lib/curriculum';

const QUESTIONS = [
  { key: 'industry', title: 'あなたの業種を選んでください', kind: 'options' as const,
    options: INDUSTRIES.map(i=>({ id: i.id, label: `${i.icon} ${i.title}`, sub: i.subtitle })) },
  { key: 'coding', title: 'コーディング経験はありますか？', kind: 'options' as const,
    options: [
      { id: '0', label: '全くない', sub: 'HTMLも触ったことがない' },
      { id: '1', label: '少しある', sub: 'コピペできる / 基本がわかる' },
      { id: '2', label: 'ある',     sub: '簡単な開発をしたことがある' }
    ] },
  { key: 'goal', title: '今、一番解きたい業務課題は？（自由記述）', kind: 'text' as const },
  { key: 'publish_pref', title: '公開する時のスタイル希望は？', kind: 'options' as const,
    options: [
      { id: 'track_a',     label: '自分で更新したい',           sub: 'Vercel + Supabase のコード派ルート' },
      { id: 'track_b',     label: '触りたくない',                sub: 'Squarespace のノーコード派ルート' },
      { id: 'track_hybrid',label: '段階的に', sub: 'まずノーコード → 後にコード派' }
    ] }
];

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const q = QUESTIONS[step];

  async function finish(allAnswers: Record<string,string>) {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    const track = allAnswers['publish_pref'] ?? 'undecided';
    await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      industry: allAnswers['industry'],
      coding_experience: parseInt(allAnswers['coding'] ?? '0'),
      goal: allAnswers['goal'] ?? '',
      learner_track: track
    });
    // Auto-enroll into chosen industry course
    if (allAnswers['industry']) {
      await supabase.from('enrollments').upsert({ user_id: user.id, course_id: allAnswers['industry'] });
    }
    router.push('/dashboard');
  }

  function pick(value: string) {
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    if (step + 1 < QUESTIONS.length) setStep(step+1);
    else finish(next);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft" style={{ background:'#F8F8F6' }}>
      <div className="w-full max-w-2xl">
        <div className="text-center text-sm text-ink/60 mb-3">{step+1} / {QUESTIONS.length}</div>
        <div className="h-1 bg-ink/10 rounded-full overflow-hidden mb-8">
          <div className="h-full bg-brand transition-all" style={{ width: `${((step+1)/QUESTIONS.length)*100}%` }} />
        </div>
        <div className="card p-10">
          <h2 className="text-display text-3xl">{q.title}</h2>
          {q.kind === 'options' && (
            <div className="grid sm:grid-cols-2 gap-3 mt-8">
              {q.options!.map(o=>(
                <button key={o.id} onClick={()=>pick(o.id)}
                  className="text-left border-2 border-ink/5 rounded-xl px-5 py-4 hover:border-brand hover:bg-brand/5 transition">
                  <div className="font-semibold">{o.label}</div>
                  <div className="text-sm text-ink/60 mt-1">{o.sub}</div>
                </button>
              ))}
            </div>
          )}
          {q.kind === 'text' && (
            <TextStep onSubmit={(v)=>pick(v)} />
          )}
          {loading && <div className="mt-8 text-ink/60">設定中…</div>}
        </div>
      </div>
    </div>
  );
}

function TextStep({ onSubmit }: { onSubmit: (v: string)=>void }) {
  const [val, setVal] = useState('');
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); if (val.trim()) onSubmit(val.trim()); }} className="mt-8 space-y-4">
      <textarea value={val} onChange={e=>setVal(e.target.value)} className="w-full border rounded-md px-4 py-3 min-h-[120px]" placeholder="例: 予約電話の対応を自動化したい / SNS投稿に時間がかかる…" />
      <button className="btn-primary w-full">次へ</button>
    </form>
  );
}
