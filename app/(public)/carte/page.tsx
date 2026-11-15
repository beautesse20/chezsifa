import type { Metadata } from 'next';
import { getStore } from '@/lib/store';
import { CarteView } from '@/components/CarteView';

export const metadata: Metadata = { title: 'La carte', description: 'Grillades au charbon, plats du pays, accompagnements, entrées, gâteaux et sauces maison : toute la carte de Chez Sifa avec les prix.' };

export default async function CartePage() {
  const catalog = await getStore().getCatalog();
  return <CarteView catalog={catalog} />;
}
