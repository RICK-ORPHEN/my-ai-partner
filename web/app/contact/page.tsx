import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <>
      <Nav />
      <Container className="pt-16 pb-24 max-w-2xl">
        <div className="tag text-vermilion">Contact</div>
        <h1 className="h-display text-6xl md:text-7xl tracking-tightest leading-[0.9] mt-6">お問い合わせ</h1>
        <p className="font-serif text-lg text-ink-soft mt-8 leading-relaxed">受講検討、法人プラン、取材、提携などお気軽にどうぞ。</p>
        <ContactForm />
      </Container>
      <Footer />
    </>
  );
}
