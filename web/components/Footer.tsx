import Link from 'next/link';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#curriculum', label: 'Curriculum' },
  { href: '#works', label: 'Works' },
  { href: '#voice', label: 'Voice' },
  { href: '#faq', label: 'FAQ' },
];

export function Footer() {
  return (
    <>
      {/* MOBILE footer — logo + nav list + sticky bottom CTA */}
      <footer className="md:hidden" style={{ background: 'var(--cream)' }}>
        <div className="px-6 pt-12 pb-8">
          <div className="leading-[1.05] mb-7">
            <div className="font-serif font-bold text-2xl text-ink tracking-tight">My AI Partner</div>
            <div className="text-[10px] tracking-[0.18em] text-ink-mute mt-1 font-medium">AI PRODUCT SCHOOL</div>
          </div>
          <nav className="border-t border-ink/10">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center justify-between py-4 border-b border-ink/10 text-ink"
              >
                <span className="text-base">{l.label}</span>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-ink-mute" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            ))}
          </nav>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center justify-center w-full bg-vermilion hover:bg-vermilion-700 text-cream-50 rounded-xl px-6 py-4 font-medium tracking-tight transition"
          >
            無料で体験する（クレカ不要）
          </Link>
          <div className="mt-6 text-center text-xs text-ink-mute">© 2026 My AI Partner. All rights reserved.</div>
        </div>
      </footer>

      {/* DESKTOP footer — full multi-column */}
      <footer className="hidden md:block" style={{ background: 'var(--ink)', color: 'var(--cream)' }}>
        <div className="container-editorial py-20 md:py-24">
          <div className="grid md:grid-cols-12 gap-12 md:gap-10">
            <div className="md:col-span-6">
              <div className="h-display text-3xl md:text-4xl lg:text-5xl leading-[1.45] tracking-normal jp-balance">
                業種×横断スキルで<br />
                <span className="text-vermilion">作って公開できる、</span><br />
                実行型のAIスクール。
              </div>
              <div className="tag text-cream-50/55 mt-8">EST. 2026 — TOKYO</div>
            </div>
            <div className="md:col-span-2">
              <div className="tag text-cream-50/55 mb-4">Course</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses">業種別コース</Link></li>
                <li><Link href="/courses#cross">横断スキル</Link></li>
                <li><Link href="/cases">受講生作品</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="tag text-cream-50/55 mb-4">Publish</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/courses#track-a">Track A</Link></li>
                <li><Link href="/courses#track-b">Track B</Link></li>
                <li><Link href="/dashboard/portfolio">ポートフォリオ</Link></li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="tag text-cream-50/55 mb-4">Company</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">運営</Link></li>
                <li><Link href="/legal">特商法</Link></li>
                <li><Link href="/privacy">プライバシー</Link></li>
                <li><Link href="/contact">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-6 border-t border-cream-50/10 flex items-center justify-between text-xs text-cream-50/55">
            <span>© 2026 My AI Partner. All rights reserved.</span>
            <span>VOL.01 / 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}
