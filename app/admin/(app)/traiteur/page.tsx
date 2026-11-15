import { getStore } from '@/lib/store';
import { shortDate } from '@/lib/format';
import { CateringStatus } from '../widgets';

export default async function CateringAdminPage() {
  const list = await getStore().listCatering();
  return (
    <>
      <div><h1>Demandes traiteur</h1><p className="muted">Les demandes de devis envoyées depuis l&apos;espace traiteur.</p></div>
      <div className="box" style={{ overflow: 'hidden' }}>
        {list.length === 0 ? <p className="muted" style={{ padding: 22 }}>Aucune demande pour l&apos;instant.</p> : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead><tr><th>Reçue</th><th>Événement</th><th>Invités</th><th>Date</th><th>Contact</th><th>Détails</th><th>Statut</th></tr></thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(r.created_at).toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}</td>
                    <td style={{ fontWeight: 700 }}>{r.event_type}</td>
                    <td>{r.guests}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{r.event_date ? shortDate(r.event_date, 'fr') : 'à définir'}</td>
                    <td>{r.name}<div className="muted" style={{ fontSize: 12 }}><a href={'tel:' + r.phone}>{r.phone}</a></div>{r.email ? <div className="muted" style={{ fontSize: 12 }}><a href={'mailto:' + r.email}>{r.email}</a></div> : null}</td>
                    <td style={{ maxWidth: 320, fontSize: 13 }}>{r.details || '—'}</td>
                    <td><CateringStatus id={r.id} status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
