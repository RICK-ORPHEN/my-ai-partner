import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
export default function AboutPage() {
  return (
    <>
      <Nav />
      <Container className="py-14 max-w-3xl">
        <h1 className="text-display text-5xl">私たちについて</h1>
        <p className="text-ink/80 mt-6 leading-relaxed">My AI Partner は、AIを「覚える」ではなく「使い切る」ためのスクールです。受講生は業種別カリキュラムと横断スキル（スキル開発・LP制作・企画書・自動化チャットツール）を通じて、最終的に <strong>自分の業務を解くプロダクトを公開URLとして所有</strong> する状態を目指します。</p>
      </Container>
      <Footer />
    </>
  );
}
