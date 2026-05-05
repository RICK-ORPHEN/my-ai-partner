import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-ink text-cream-50">
      <div className="container-editorial py-20 md:py-24">
        <div className="grid md:grid-cols-12 gap-12 md:gap-10">
          <div className="md:col-span-6">
            <div className="h-display text-3xl md:text-4xl lg:text-5xl leading-[1.05] tracking-tightest jp-balance">
              業種×横断スキルで<br/>
              <span className="text-vermilion">作って公開できる、</span><br/>
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
              <li><Link href="/portfolio">ポートフォリオ</Link></li>
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
        <div className="border-t border-cream-50/15 mt-16 pt-6 flex justify-between items-center text-xs text-cream-50/50">
          <div>© 2026 My AI Partner. All rights reserved.</div>
          <div className="tag">Vol.01 / 2026</div>
        </div>
      </div>
    </footer>
  );
}
