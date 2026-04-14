import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import '@wilkins/ui/styles';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Wilkins Media Global Guest OS',
  description:
    'A multilingual guest experience platform for global live events. Navigate, translate, and connect in your language.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'Wilkins Media Global Guest OS',
    description: 'Multilingual event experience — Atlanta',
    siteName: 'Wilkins Media',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0F',
};

const RTL_LANGUAGES = new Set(['ar', 'he', 'fa', 'ur']);

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('wilkins_lang')?.value ?? 'en';
  const dir = RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-brand-black text-brand-text`}
      >
        {children}
      </body>
    </html>
  );
}
