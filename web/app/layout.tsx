import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'My AI Partner — 業種×横断スキルで作って公開できるAIスクール',
  description: 'AI活用を業種別に学び、自分のプロダクトを公開しポートフォリオ化するインタラクティブAIスクール。',
  openGraph: {
    title: 'My AI Partner',
    description: 'AIで作って公開する力を身につける',
    type: 'website'
  }
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
