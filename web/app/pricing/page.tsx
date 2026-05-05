import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

const PLANS = [
  { name: 'Free',  price: '¥0',       sub: '体験', features: ['Lesson 1-2 無料', '業種診断', 'コミュニティ閲覧'], cta: '無料で診断' },
  { name: '月額',  price: '¥9,800',   sub: '/月', features: ['全コース受け放題', 'AI採点無制限', 'プロダクト公開', 'ポートフォリオ非公開'], cta: '月額で始める' },
  { name: '年額',  price: '¥98,000',  sub: '/年', features: ['全コース受け放題', 'AI採点無制限', 'プロダクト公開', 'ポートフォリオ公開', 'PDF認定証', '2ヶ月分お得'], cta: '年額で始める', recommended: true },
  { name: 'Team',  price: '¥49,800',  sub: '/月（5名）', features: ['アドミン管理', '進捗一括把握', '社内別カリキュラム', 'カスタマーサクセス'], cta: '法人で始める' }
];

export default function PricingPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-12">
        <div className="flex items-center gap-4 text-ink-mute">
          <span className="tag text-vermilion">Pricing</span>
          <span className="h-px flex-1 bg-ink/20"/>
          <span className="tag">4 Plans</span>
        </div>
        <h1 className="h-display text-7xl md:text-9xl tracking-tightest leading-[0.88] mt-10 max-w-4xl">
          目的にあわせた<br/>
          <span className="text-vermilion">4プラン</span>。
        </h1>
        <p className="font-serif text-2xl text-ink-soft mt-10 max-w-2xl leading-tight tracking-editorial">どのプランも「公開URL所有」までを保証。まずは無料体験から。</p>
      </Container>

      <Container className="pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
          {PLANS.map(p=>(
            <div key={p.name} className={`p-9 ${p.recommended ? 'bg-ink text-cream-50' : 'bg-cream'}`}>
              {p.recommended && <div className="tag text-vermilion mb-2">Recommended</div>}
              <div className="tag opacity-70">{p.name}</div>
              <div className={`h-display text-5xl mt-3 tracking-tightest ${p.recommended ? '' : ''}`}>{p.price}</div>
              <div className={`text-sm mt-1 ${p.recommended ? 'text-cream-50/70' : 'text-ink-mute'}`}>{p.sub}</div>
              <ul className={`mt-7 space-y-3 text-sm border-t pt-6 ${p.recommended ? 'border-cream-50/15' : 'border-ink/10'}`}>
                {p.features.map(f=>(
                  <li key={f} className="flex gap-3"><span className="text-vermilion">→</span>{f}</li>
                ))}
              </ul>
              <Link href="/signup" className={`mt-8 inline-flex w-full justify-center px-5 py-3 font-medium ${p.recommended ? 'bg-vermilion text-cream-50 hover:bg-cream-50 hover:text-ink' : 'border border-ink hover:bg-ink hover:text-cream-50'} transition-colors`}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}
