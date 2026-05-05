'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { data, error } = await supabase.auth.signUp({
      email, password: pw,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
        data: { display_name: name }
      }
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    if (data.session) router.push('/onboarding');
    else setErr('確認メールを送りました。メール内のリンクを開いてください。');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft" style={{ background:'#F8F8F6' }}>
      <div className="card p-10 w-full max-w-md">
        <Link href="/" className="text-display text-3xl text-brand">MY AI PARTNER</Link>
        <h1 className="text-2xl font-semibold mt-6">無料アカウント作成</h1>
        <p className="text-sm text-ink/60 mt-1">クレカ不要 / Lesson 1-2は完全無料</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <input className="w-full border rounded-md px-4 py-3" placeholder="お名前" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="w-full border rounded-md px-4 py-3" placeholder="メールアドレス" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input className="w-full border rounded-md px-4 py-3" placeholder="パスワード（8文字以上）" value={pw} onChange={e=>setPw(e.target.value)} type="password" minLength={8} required />
          {err && <div className="text-sm text-brand">{err}</div>}
          <button disabled={loading} className="btn-primary w-full">{loading?'…':'登録して診断を受ける'}</button>
        </form>
        <p className="text-sm text-ink/60 mt-6 text-center">
          既にアカウントをお持ちの方は <Link href="/login" className="text-brand font-semibold">ログイン</Link>
        </p>
      </div>
    </div>
  );
}
