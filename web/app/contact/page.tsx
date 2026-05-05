import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { ContactForm } from './ContactForm';

export default function ContactPage() {
  return (
    <>
      <Nav />
      <Container className="py-14 max-w-2xl">
        <h1 className="text-display text-5xl">お問い合わせ</h1>
        <ContactForm />
      </Container>
      <Footer />
    </>
  );
}
