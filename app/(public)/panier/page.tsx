import type { Metadata } from 'next';
import { getStore } from '@/lib/store';
import { earliest, todayLocal } from '@/lib/dates';
import { CartView } from '@/components/CartView';

export const metadata: Metadata = { title: 'Panier', robots: { index: false } };

export default async function PanierPage() {
  const store = getStore();
  const [catalog, settings] = await Promise.all([store.getCatalog(), store.getSettings()]);
  return (
    <>
      <div className="kuba kuba-sm" />
      <CartView catalog={catalog} today={todayLocal()} first={earliest(settings.min_hours).date} phone={settings.phone} minHours={settings.min_hours} />
    </>
  );
}
