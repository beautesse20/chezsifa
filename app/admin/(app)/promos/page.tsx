import { getStore } from '@/lib/store';
import { money } from '@/lib/format';
import { todayLocal } from '@/lib/dates';
import { deletePromoAction, togglePromoAction } from '../../actions';
import { PromoForm } from '../widgets';

const SCOPE: Record<string, string> = { all: 'Toute la commande', weekly: 'Commandes à la semaine', first: 'Première commande', category: 'Catégorie' };

export default async function PromosPage() {
  const store = getStore();
  const [promos, catalog] = await Promise.all([store.listPromos(), store.getCatalog({ includeInactive: true })]);
  const today = todayLocal();
  const status = (p: (typeof promos)[number]) => {
    if (!p.active) return ['Désactivé', 'st-annulee'];
    if (p.max_uses != null && p.uses >= p.max_uses) return ['Épuisé', 'st-annulee'];
    if (p.ends_on && today > p.ends_on) return ['Expiré', 'st-annulee'];
    if (p.starts_on && today < p.starts_on) return ['Programmé', 'st-confirmee'];
    return ['Actif', 'st-payee'];
  };
  return (
    <>
      <div><h1>Codes promo</h1><p className="muted">Le client saisit le code dans son panier. Le serveur vérifie toutes les conditions au moment de la commande.</p></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        <div className="box" style={{ flex: '999 1 600px', minWidth: 0, overflow: 'hidden' }}>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Code</th><th>Réduction</th><th>S&apos;applique à</th><th>Conditions</th><th>Utilisé</th><th>Statut</th><th /></tr></thead>
              <tbody>
                {promos.length === 0 ? <tr><td colSpan={7} className="muted">Aucun code pour l&apos;instant.</td></tr> : promos.map((p) => {
                  const [label, cls] = status(p);
                  return (
                    <tr key={p.code}>
                      <td><span className="code">{p.code}</span></td>
                      <td style={{ fontWeight: 800 }}>{p.type === 'percent' ? `−${p.value} %` : `−${money(p.value)}`}</td>
                      <td>{SCOPE[p.scope]}{p.scope === 'category' && p.category ? ` : ${catalog.categories.find((c) => c.id === p.category)?.fr || p.category}` : ''}</td>
                      <td style={{ fontSize: 13 }}>{[p.min_total ? `dès ${money(p.min_total)}` : '', p.starts_on ? `du ${p.starts_on}` : '', p.ends_on ? `au ${p.ends_on}` : ''].filter(Boolean).join(' · ') || '—'}</td>
                      <td>{p.uses}{p.max_uses != null ? ` / ${p.max_uses}` : ''}</td>
                      <td><span className={'pill ' + cls}>{label}</span></td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <form action={togglePromoAction} style={{ display: 'inline' }}><input type="hidden" name="code" value={p.code} /><button type="submit" className="link-btn">{p.active ? 'Désactiver' : 'Activer'}</button></form>
                        {' · '}
                        <form action={deletePromoAction} style={{ display: 'inline' }}><input type="hidden" name="code" value={p.code} /><button type="submit" className="link-btn" style={{ color: 'var(--muted)' }}>Supprimer</button></form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ flex: '1 1 320px', minWidth: 0 }}><PromoForm categories={catalog.categories.map((c) => ({ id: c.id, fr: c.fr }))} /></div>
      </div>
      <p className="muted" style={{ fontSize: 13 }}>Pour modifier un code, recréez-le avec le même nom : il est mis à jour (le compteur d&apos;utilisations est conservé).</p>
    </>
  );
}
