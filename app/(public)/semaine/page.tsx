import type { Metadata } from 'next';
import { getStore } from '@/lib/store';
import { earliest } from '@/lib/dates';
import { WeekPlanner } from '@/components/WeekPlanner';

export const metadata: Metadata = { title: 'Ma semaine', description: 'Planifiez vos repas de la semaine chez Chez Sifa, jour par jour, en une seule commande.' };

export default async function SemainePage() {
  const store = getStore();
  const [catalog, settings] = await Promise.all([store.getCatalog(), store.getSettings()]);
  return (
    <>
      <div className="kuba kuba-sm" />
      <WeekPlanner catalog={catalog} first={earliest(settings.min_hours).date} phone={settings.phone} />
    </>
  );
}
