import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-24 max-w-3xl">
        <div className="tag text-vermilion">Privacy</div>
        <h1 className="h-display text-6xl md:text-7xl tracking-tightest leading-[0.9] mt-6">プライバシーポリシー</h1>
        <div className="mt-12 prose prose-sm max-w-none font-serif text-base text-ink-soft leading-relaxed space-y-5">
          <p>My AI Partner（以下「当社」）は、受講者の個人情報を以下の目的で利用します：</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>サービス提供（学習進捗管理、AI採点、ポートフォリオ公開）</li>
            <li>お問い合わせ対応・サポート連絡</li>
            <li>請求・決済処理（Stripe）</li>
          </ul>
          <p>当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。外部サービス（Supabase, Stripe, Vercel, Squarespace, OpenAI, Google）との連携時は、各社のプライバシーポリシーに準拠します。</p>
        </div>
      </Container>
      <Footer />
    </>
  );
}
