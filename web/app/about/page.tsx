import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';

export default function AboutPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-24">
        <div className="grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8">
            <div className="tag text-vermilion">About</div>
            <h1 className="h-display text-7xl md:text-9xl tracking-tightest leading-[0.88] mt-8">
              覚えるじゃなく、<br/>
              <span className="text-vermilion">使い切る</span>ためのスクール。
            </h1>
            <div className="font-serif text-xl text-ink-soft mt-12 leading-relaxed tracking-editorial space-y-6 max-w-measure">
              <p>My AI Partner は、AIを「覚える」ではなく「使い切る」ためのスクールです。</p>
              <p>受講生は業種別カリキュラムと横断スキル（スキル開発・LP制作・企画書・自動化チャットツール）を通じて、最終的に <strong className="text-ink">自分の業務を解くプロダクトを公開URLとして所有</strong> する状態を目指します。</p>
              <p>プロンプトを暗記するためのスクールはもう要らない。動いて、見せられて、使われるものを作る。それだけが私たちの目的です。</p>
            </div>
          </div>
          <aside className="md:col-span-4 md:pt-32">
            <div className="border-l-2 border-ink pl-6">
              <div className="tag text-ink-mute mb-3">Editorial</div>
              <p className="text-sm leading-relaxed">My AI Partner 運営事務局<br/>EST. 2026 — Tokyo<br/>Vol.01 / 2026</p>
            </div>
          </aside>
        </div>
      </Container>
      <Footer />
    </>
  );
}
