'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Container } from '@/components/Container';

export default function NewProductPage() {
  const supabase = createClient();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [track, setTrack] = useState<'vercel'|'squarespace'|'github'|'other'>('vercel');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('student_products').insert({
      user_id: user.id, title, description: desc, publish_track: track, public_url: url || null,
      status: url ? 'published' : 'wip',
      published_at: url ? new Date().toISOString() : null
    }).select().single();
    setBusy(false);
    if (!error) router.push(`/dashboard/products/${data.id}`);
  }

  return (
    <Container className="py-10 max-w-2xl">
      <h1 className="text-display text-4xl">新規プロダクト</h1>
      <form onSubmit={submit} className="card p-7 mt-6 space-y-4">
        <input className="w-full border rounded-md px-4 py-3" placeholder="プロダクト名" value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className="w-full border rounded-md px-4 py-3 min-h-[100px]" placeholder="プロダクト概要" value={desc} onChange={e=>setDesc(e.target.value)} />
        <select className="w-full border rounded-md px-4 py-3" value={track} onChange={e=>setTrack(e.target.value as any)}>
          <option value="vercel">Vercel + Supabase</option>
          <option value="squarespace">Squarespace</option>
          <option value="github">GitHub Pages</option>
          <option value="other">その他</option>
        </select>
        <input className="w-full border rounded-md px-4 py-3" placeholder="公開URL（あれば）" value={url} onChange={e=>setUrl(e.target.value)} type="url" />
        <button disabled={busy} className="btn-primary w-full">{busy?'…':'登録'}</button>
      </form>
    </Container>
  );
}
