import type { Metadata } from 'next';
import { getStore } from '@/lib/store';
import { getLang } from '@/lib/server';
import { tx } from '@/lib/format';
import { Composer } from '@/components/Composer';

export const metadata: Metadata = { title: 'Composer une assiette', description: 'Choisissez votre formule, votre plat, le format, l\'accompagnement et vos suppléments : le prix se calcule en direct.' };

export default async function ComposerPage({ searchParams }: { searchParams: Promise<{ plat?: string }> }) {
  const [{ plat }, lang, catalog] = await Promise.all([searchParams, getLang(), getStore().getCatalog()]);
  return (
    <>
      <div className="kuba kuba-sm" />
      <section className="wrap" style={{ paddingTop: 52, paddingBottom: 28 }}>
        <span className="eyebrow">{tx(lang, 'Composer une assiette', 'Build a plate')}</span>
        <h1 className="h-lg">{tx(lang, 'Votre assiette, à votre façon', 'Your plate, your way')}</h1>
        <p className="lead">{tx(lang, 'Une formule, un plat, un format, vos suppléments. Le prix se calcule au fur et à mesure.', 'A formula, a dish, a size, your extras. The price updates as you go.')}</p>
      </section>
      <section className="wrap" style={{ paddingBottom: 96 }}>
        <Composer key={plat || 'none'} catalog={catalog} initialDish={plat} />
      </section>
    </>
  );
}
