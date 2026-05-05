import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function LegalPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-24 max-w-3xl">
        <div className="tag text-vermilion">Legal</div>
        <h1 className="h-display text-6xl md:text-7xl tracking-tightest leading-[0.9] mt-6">特定商取引法に基づく表記</h1>
        <dl className="mt-12 space-y-4 text-sm border-t border-ink/15 pt-8">
          {[
            ['販売業者','My AI Partner 運営事務局'],
            ['運営責任者','運営責任者名'],
            ['所在地','請求があった際に開示'],
            ['電話番号','請求があった際に開示'],
            ['販売価格','各料金ページに表記'],
            ['支払方法','クレジットカード（Stripe決済）'],
            ['商品の引渡時期','決済完了後即時'],
            ['返品・キャンセル','デジタル商品のため、提供後は原則返金不可']
          ].map(([k,v])=>(
            <div key={k} className="grid grid-cols-3 gap-4 py-3 border-b border-ink/10">
              <dt className="font-serif font-bold tracking-editorial">{k}</dt>
              <dd className="col-span-2 text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>
      <Footer />
    </>
  );
}
