import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <Container className="py-14 max-w-3xl">
        <h1 className="text-display text-5xl">プライバシーポリシー</h1>
        <div className="mt-8 prose prose-sm">
          <p>My AI Partner（以下「当社」）は、受講者の個人情報を以下の目的で利用します：</p>
          <ul>
            <li>サービス提供（学習進捗管理、AI採点、ポートフォリオ公開）</li>
            <li>お問い合わせ対応・サポート連絡</li>
            <li>請求・決済処理（Stripe）</li>
          </ul>
          <p>当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。</p>
        </div>
      </Container>
      <Footer />
    </>
  );
}
