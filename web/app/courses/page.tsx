import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Badge } from '@/components/Badge';
import { INDUSTRIES, CROSS_SKILLS } from '@/lib/curriculum';

export default function CoursesPage() {
  return (
    <>
      <Nav />
      <Container className="py-14">
        <Badge>カリキュラム俯瞰</Badge>
        <h1 className="text-display text-5xl mt-3">8業種 × 7レッスン + 横断4スキル</h1>
        <p className="text-ink/70 mt-4 max-w-3xl">プロンプトを覚えるためのスクールではありません。<strong>業務に効く実プロダクトを公開する</strong>ことが終点です。</p>

        <h2 className="text-display text-3xl mt-14">業種別コース</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
          {INDUSTRIES.map(i=>(
            <Link key={i.id} href={`/courses/${i.id}`} className="card p-6 hover:shadow-lg transition">
              <div className="text-3xl">{i.icon}</div>
              <div className="text-xl font-semibold mt-2">{i.title}</div>
              <div className="text-sm text-ink/60 mt-1">{i.subtitle}</div>
            </Link>
          ))}
        </div>

        <h2 id="cross" className="text-display text-3xl mt-14">横断スキルコース</h2>
        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {CROSS_SKILLS.map(c=>(
            <Link key={c.id} href={`/courses/${c.id}`} className="card p-6 hover:shadow-lg transition flex items-start gap-5">
              <div className="text-3xl">{c.icon}</div>
              <div>
                <div className="text-xl font-semibold">{c.title}</div>
                <div className="text-sm text-ink/60 mt-1">{c.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}
