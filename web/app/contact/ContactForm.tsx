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
  if (sent) return <div className="border border-ink p-7 mt-10"><div className="tag text-vermilion mb-2">Thanks</div><div className="font-serif text-2xl tracking-editorial">送信しました。担当者よりご連絡します。</div></div>;
  return (
    <form onSubmit={submit} className="mt-10 space-y-5 border-t border-ink/15 pt-10">
      <div>
        <label className="tag text-ink-mute">Name</label>
        <input name="name" placeholder="お名前" className="w-full bg-transparent border-b border-ink/20 focus:border-vermilion outline-none py-3 mt-2 text-lg" required />
      </div>
      <div>
        <label className="tag text-ink-mute">Email</label>
        <input name="email" placeholder="email@example.com" type="email" className="w-full bg-transparent border-b border-ink/20 focus:border-vermilion outline-none py-3 mt-2 text-lg" required />
      </div>
      <div>
        <label className="tag text-ink-mute">Message</label>
        <textarea name="message" placeholder="お問い合わせ内容" className="w-full bg-transparent border-b border-ink/20 focus:border-vermilion outline-none py-3 mt-2 text-lg min-h-[140px]" required />
      </div>
      <button disabled={busy} className="btn-primary w-full">{busy?'送信中…':'送信する →'}</button>
    </form>
  );
}
