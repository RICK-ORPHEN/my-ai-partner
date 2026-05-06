'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function NavMobile({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#curriculum', label: 'Curriculum' },
    { href: '#works', label: 'Works' },
    { href: '#voice', label: 'Voice' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="メニューを開く"
        className="md:hidden inline-flex items-center justify-center w-10 h-10 text-ink"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" style={{ background: 'var(--cream)' }}>
          <div className="px-6 py-5 flex items-center justify-between border-b border-ink/10">
            <Link href="/" onClick={() => setOpen(false)} className="flex flex-col leading-[1.05]">
              <span className="font-serif font-bold text-xl text-ink tracking-tight">My AI Partner</span>
              <span className="text-[10px] tracking-[0.18em] text-ink-mute mt-0.5 font-medium">AI PRODUCT SCHOOL</span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="メニューを閉じる"
              className="inline-flex items-center justify-center w-10 h-10 text-ink"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav className="px-6 py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-5 border-b border-ink/10 text-ink text-lg"
              >
                <span>{l.label}</span>
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M9 6l6 6-6 6" strokeLinecap="round" />
                </svg>
              </Link>
            ))}
          </nav>
          <div className="px-6 mt-8">
            {loggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-4 font-medium transition"
              >
                ダッシュボード
              </Link>
            ) : (
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="block w-full text-center bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-4 font-medium transition"
              >
                無料で体験する
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
