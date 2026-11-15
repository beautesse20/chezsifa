import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [lang, settings] = await Promise.all([getLang(), getStore().getSettings()]);
  const banner = lang === 'en' ? settings.banner_en : settings.banner_fr;
  return (
    <>
      <a href="#main" className="sr-only">Aller au contenu</a>
      {banner ? <div style={{ background: 'var(--gold)', color: 'var(--charcoal)', textAlign: 'center', fontWeight: 700, fontSize: 14, padding: '8px 16px' }}>{banner}</div> : null}
      <Header phone={settings.phone} />
      <main id="main">{children}</main>
      <Footer lang={lang} phone={settings.phone} />
    </>
  );
}
