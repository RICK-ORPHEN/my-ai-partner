'use client';
import { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const fd = new FormData(e.currentTarget);
    await fetch('/api/contact', { method: 'POST', body: fd });
    setBusy(false); setSent(true);
  }
  return (
    <>
      <Nav />
      <Container className="py-14 max-w-2xl">
        <h1 className="text-display text-5xl">お問い合わせ</h1>
        {sent ? (
          <div className="card p-7 mt-6">送信しました。担当者よりご連絡します。</div>
        ) : (
          <form onSubmit={submit} className="card p-7 mt-6 space-y-4">
            <input name="name" placeholder="お名前" className="w-full border rounded-md px-4 py-3" required />
            <input name="email" placeholder="メール" type="email" className="w-full border rounded-md px-4 py-3" required />
            <textarea name="message" placeholder="お問い合わせ内容" className="w-full border rounded-md px-4 py-3 min-h-[140px]" required />
            <button disabled={busy} className="btn-primary w-full">{busy?'送信中…':'送信する'}</button>
          </form>
        )}
      </Container>
      <Footer />
    </>
  );
}
