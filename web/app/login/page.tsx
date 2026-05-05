'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.push(next);
    router.refresh();
  }

  async function magic() {
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` }
    });
    if (error) setErr(error.message);
    else setErr('メールを確認してください（マジックリンク送信済）');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft" style={{ background:'#F8F8F6' }}>
      <div className="card p-10 w-full max-w-md">
        <Link href="/" className="text-display text-3xl text-brand">MY AI PARTNER</Link>
        <h1 className="text-2xl font-semibold mt-6">ログイン</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="w-full border rounded-md px-4 py-3" placeholder="メールアドレス" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input className="w-full border rounded-md px-4 py-3" placeholder="パスワード" value={pw} onChange={e=>setPw(e.target.value)} type="password" />
          {err && <div className="text-sm text-brand">{err}</div>}
          <button disabled={loading} className="btn-primary w-full">{loading?'…':'ログイン'}</button>
        </form>
        <button onClick={magic} className="btn-ghost w-full mt-3">マジックリンクで送る</button>
        <p className="text-sm text-ink/60 mt-6 text-center">
          初めての方は <Link href="/signup" className="text-brand font-semibold">無料登録</Link>
        </p>
      </div>
    </div>
  );
}
