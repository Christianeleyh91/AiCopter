import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ai Copter | Face Intelligence & Autonomous Flight',
  description: 'A bilingual showcase of secure face recognition and autonomous drone perception in Unreal Engine.',
  metadataBase: new URL('https://ai-copter.app'),
  openGraph: {
    title: 'AI Copter',
    description: 'Face Intelligence × Autonomous Flight',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Copter',
    description: 'Face Intelligence × Autonomous Flight',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" data-theme="dark"><body>{children}</body></html>;
}
