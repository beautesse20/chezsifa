import { getStore } from '@/lib/store';
import { SettingsForm } from '../widgets';

export default async function SettingsPage() {
  const store = getStore();
  const settings = await store.getSettings();
  return (
    <>
      <div><h1>Réglages</h1><p className="muted">Ces réglages s&apos;appliquent immédiatement sur le site.</p></div>
      <SettingsForm s={settings} />
      <p className="muted" style={{ fontSize: 13 }}>Base de données : {store.mode === 'supabase' ? 'Supabase (production)' : 'mode démo en mémoire (les données disparaissent au redémarrage)'}.</p>
    </>
  );
}
