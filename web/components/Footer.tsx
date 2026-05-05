import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-ink text-white/85">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="text-display text-3xl text-brand">MY AI</div>
          <div className="text-display text-3xl">PARTNER</div>
          <p className="text-sm text-white/60 mt-4">業種×横断スキルで、作って公開できるAIスクール。</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">コース</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/courses">業種別コース</Link></li>
            <li><Link href="/courses#cross">横断スキルコース</Link></li>
            <li><Link href="/cases">受講生作品</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">公開ルート</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/courses#track-a">Vercel + Supabase 派</Link></li>
            <li><Link href="/courses#track-b">Squarespace 派</Link></li>
            <li><Link href="/portfolio">ポートフォリオ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">運営</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about">運営会社</Link></li>
            <li><Link href="/legal">特定商取引法</Link></li>
            <li><Link href="/privacy">プライバシー</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">© 2026 My AI Partner</div>
    </footer>
  );
}
