import type { Metadata } from 'next';
import './globals.css';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const publicBase = isGitHubPages ? '/AiCopter' : '';

export const metadata: Metadata = {
  title: 'Ai Copter | Face Intelligence & Autonomous Flight',
  description: 'A bilingual showcase of secure face recognition and autonomous drone perception in Unreal Engine.',
  metadataBase: new URL(isGitHubPages
    ? 'https://christianeleyh91.github.io'
    : 'https://ai-copter.christianeleyh91.chatgpt.site'),
  icons: {
    icon: [
      { url: `${publicBase}/favicon.ico`, sizes: 'any' },
      { url: `${publicBase}/favicon-16.png`, sizes: '16x16', type: 'image/png' },
      { url: `${publicBase}/favicon-32.png`, sizes: '32x32', type: 'image/png' },
    ],
    shortcut: `${publicBase}/favicon.ico`,
    apple: { url: `${publicBase}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png' },
  },
  openGraph: {
    title: 'AI Copter',
    description: 'Face Intelligence × Autonomous Flight',
    images: [`${publicBase}/og.png`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Copter',
    description: 'Face Intelligence × Autonomous Flight',
    images: [`${publicBase}/og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" data-theme="dark"><body>{children}</body></html>;
}
