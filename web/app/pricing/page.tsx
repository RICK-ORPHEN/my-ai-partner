import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';

const PLANS = [
  { name: 'Free', price: '¥0', sub: '体験', features: ['Lesson 1-2 無料', '業種診断', 'コミュニティ閲覧'] },
  { name: '月額', price: '¥9,800', sub: '/月', features: ['全コース受け放題', 'AI採点無制限', 'プロダクト公開', 'ポートフォリオ非公開'] },
  { name: '年額', price: '¥98,000', sub: '/年（推奨）', features: ['全コース受け放題', 'AI採点無制限', 'プロダクト公開', 'ポートフォリオ公開', 'PDF認定証', '2ヶ月分お得'] },
  { name: '法人 / Team', price: '¥49,800', sub: '/月（5名）', features: ['アドミン管理', '進捗一括把握', '社内別カリキュラム', 'カスタマーサクセス'] }
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <Container className="py-14">
        <Badge>料金プラン</Badge>
        <h1 className="text-display text-5xl mt-3">あなたの目的にあわせて</h1>
        <p className="text-ink/70 mt-3 max-w-3xl">どのプランも「公開URL所有」までを保証します。まずは無料体験から。</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
          {PLANS.map(p=>(
            <div key={p.name} className="card p-7">
              <div className="font-semibold">{p.name}</div>
              <div className="text-3xl font-semibold mt-2">{p.price}<span className="text-sm text-ink/50">{p.sub}</span></div>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                {p.features.map(f=><li key={f}>✓ {f}</li>)}
              </ul>
              <Link href="/signup" className="btn-primary mt-6 w-full inline-flex justify-center">始める</Link>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}
