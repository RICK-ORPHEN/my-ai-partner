import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function LegalPage() {
  return (
    <>
      <Nav />
      <Container className="py-14 max-w-3xl">
        <h1 className="text-display text-5xl">特定商取引法に基づく表記</h1>
        <dl className="mt-8 space-y-3 text-sm">
          <div><dt className="font-semibold">販売業者</dt><dd className="text-ink/70">My AI Partner 運営事務局</dd></div>
          <div><dt className="font-semibold">運営責任者</dt><dd className="text-ink/70">運営責任者名</dd></div>
          <div><dt className="font-semibold">所在地</dt><dd className="text-ink/70">請求があった際に開示</dd></div>
          <div><dt className="font-semibold">電話番号</dt><dd className="text-ink/70">請求があった際に開示</dd></div>
          <div><dt className="font-semibold">販売価格</dt><dd className="text-ink/70">各料金ページに表記</dd></div>
          <div><dt className="font-semibold">支払方法</dt><dd className="text-ink/70">クレジットカード（Stripe決済）</dd></div>
          <div><dt className="font-semibold">商品の引渡時期</dt><dd className="text-ink/70">決済完了後即時</dd></div>
          <div><dt className="font-semibold">返品・キャンセル</dt><dd className="text-ink/70">デジタル商品のため、提供後は原則返金不可</dd></div>
        </dl>
      </Container>
      <Footer />
    </>
  );
}
