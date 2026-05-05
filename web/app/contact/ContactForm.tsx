'use client';
import { useState } from 'react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const fd = new FormData(e.currentTarget);
    await fetch('/api/contact', { method: 'POST', body: fd });
    setBusy(false); setSent(true);
  }
  if (sent) return <div className="card p-7 mt-6">送信しました。担当者よりご連絡します。</div>;
  return (
    <form onSubmit={submit} className="card p-7 mt-6 space-y-4">
      <input name="name" placeholder="お名前" className="w-full border rounded-md px-4 py-3" required />
      <input name="email" placeholder="メール" type="email" className="w-full border rounded-md px-4 py-3" required />
      <textarea name="message" placeholder="お問い合わせ内容" className="w-full border rounded-md px-4 py-3 min-h-[140px]" required />
      <button disabled={busy} className="btn-primary w-full">{busy?'送信中…':'送信する'}</button>
    </form>
  );
}
