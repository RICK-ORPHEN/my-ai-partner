import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { INDUSTRIES, CROSS_SKILLS } from '@/lib/curriculum';
import { INDUSTRY_ICONS } from '@/components/icons/Industries';
import { CROSS_SKILL_ICONS } from '@/components/icons/CrossSkills';

export default function CoursesPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-12">
        <div className="flex items-center gap-4 text-ink-mute">
          <span className="tag text-vermilion">Curriculum Index</span>
          <span className="h-px flex-1 bg-ink/20"/>
          <span className="tag">2026 Edition</span>
        </div>
        <h1 className="h-display text-7xl md:text-9xl tracking-tightest leading-[0.88] mt-10 max-w-5xl">
          8業種 × 7レッスン<br/>
          <span className="text-vermilion">+ 横断4スキル</span>。
        </h1>
        <p className="font-serif text-2xl text-ink-soft mt-10 max-w-2xl leading-tight tracking-editorial">
          プロンプトを覚えるためのスクールではない。<br/>
          業務に効く実プロダクトを公開することが終点。
        </p>
      </Container>

      <div className="border-y border-ink">
        <Container className="py-3 flex items-center gap-6">
          <span className="tag text-vermilion">Industry</span>
          <span className="h-px flex-1 bg-ink/20"/>
          <span className="tag text-ink-mute">8 Tracks</span>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {INDUSTRIES.map((i, idx)=>{
            const Icon = INDUSTRY_ICONS[i.id];
            return (
              <Link key={i.id} href={`/courses/${i.id}`} className="group bg-cream hover:bg-paper p-8 transition-colors">
                <div className="flex items-start justify-between text-ink">
                  <Icon className="w-12 h-12 group-hover:text-vermilion transition-colors"/>
                  <div className="tag text-ink-mute">{String(idx+1).padStart(2,'0')} / 08</div>
                </div>
                <div className="mt-10">
                  <div className="font-serif text-3xl tracking-editorial">{i.title}</div>
                  <div className="text-sm text-ink-mute mt-2">{i.subtitle}</div>
                </div>
                <div className="tag text-vermilion mt-8 opacity-0 group-hover:opacity-100 transition-opacity">View Course →</div>
              </Link>
            );
          })}
        </div>
      </Container>

      <div id="cross" className="border-y border-ink mt-12">
        <Container className="py-3 flex items-center gap-6">
          <span className="tag text-vermilion">Cross Skills</span>
          <span className="h-px flex-1 bg-ink/20"/>
          <span className="tag text-ink-mute">4 Tracks</span>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid md:grid-cols-2 gap-px bg-ink/10 border border-ink/10">
          {CROSS_SKILLS.map((c, idx)=>{
            const Icon = CROSS_SKILL_ICONS[c.id];
            return (
              <Link key={c.id} href={`/courses/${c.id}`} className="group bg-cream hover:bg-paper p-10 flex gap-6 items-start transition-colors">
                <div className="text-ink group-hover:text-vermilion transition-colors">
                  <Icon className="w-14 h-14"/>
                </div>
                <div className="flex-1">
                  <div className="tag text-ink-mute mb-2">Skill {String(idx+1).padStart(2,'0')}</div>
                  <div className="font-serif text-3xl tracking-editorial">{c.title}</div>
                  <div className="text-ink-mute mt-3 leading-relaxed">{c.subtitle}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>

      <Footer />
    </>
  );
}
