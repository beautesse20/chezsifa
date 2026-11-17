import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileCartBar } from '@/components/Extras';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [lang, settings] = await Promise.all([getLang(), getStore().getSettings()]);
  const banner = lang === 'en' ? settings.banner_en : settings.banner_fr;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: 'Chez Sifa',
    description: 'BBQ au charbon de bois et cuisine congolaise à emporter, service traiteur.',
    url: 'https://chezsifa.vercel.app', telephone: '+1-' + settings.phone, email: 'chezsifa@gmail.com',
    servesCuisine: ['Barbecue', 'Congolaise'], priceRange: '$$',
    address: { '@type': 'PostalAddress', addressLocality: 'Surrey', addressRegion: 'BC', addressCountry: 'CA' },
    hasMenu: 'https://chezsifa.vercel.app/carte', acceptsReservations: false
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="#main" className="sr-only">Aller au contenu</a>
      {banner ? <div style={{ background: 'var(--gold)', color: 'var(--charcoal)', textAlign: 'center', fontWeight: 700, fontSize: 14, padding: '8px 16px' }}>{banner}</div> : null}
      <Header phone={settings.phone} />
      <main id="main">{children}</main>
      <Footer lang={lang} phone={settings.phone} />
      <MobileCartBar />
    </>
  );
}
