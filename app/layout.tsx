import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getLang } from '@/lib/server';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://chezsifa.vercel.app'),
  title: { default: 'Chez Sifa – Grillades au charbon & cuisine congolaise', template: '%s · Chez Sifa' },
  description: 'Grillades au charbon, plats congolais et est-africains, gâteaux et sauces maison. Commandez en ligne, prêt en 48 h, à récupérer à Surrey (C.-B.). Service traiteur pour vos événements.',
  openGraph: {
    title: 'Chez Sifa – Le goût du charbon, prêt en 48 h',
    description: 'Commandez en ligne vos grillades, plats du pays et douceurs maison. Service traiteur en Colombie-Britannique.',
    url: 'https://chezsifa.vercel.app', siteName: 'Chez Sifa', locale: 'fr_CA', type: 'website'
  },
  icons: { icon: '/img/flame.png' }
};

export const viewport: Viewport = { themeColor: '#1E1714', width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,800;1,9..144,400;1,9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap" />
      </head>
      <body>
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
