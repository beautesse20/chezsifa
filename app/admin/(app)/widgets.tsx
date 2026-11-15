'use client';
import { useActionState, useTransition } from 'react';
import { phoneOrderAction, savePromoAction, saveSettingsAction, setCateringStatus, setOrderStatus } from '../actions';
import type { CateringRequest, OrderStatus, Settings } from '@/lib/types';
import { STATUS_LABEL } from '@/lib/status';

const NEXT: Partial<Record<OrderStatus, [OrderStatus, string]>> = {
  nouvelle: ['confirmee', 'Confirmer'], confirmee: ['payee', 'Marquer payée'], payee: ['preparation', 'Lancer la préparation'], preparation: ['prete', 'Prête ✓'], prete: ['recuperee', 'Récupérée ✓']
};

export function StatusControl({ id, status }: { id: string; status: OrderStatus }) {
  const [pending, start] = useTransition();
  const next = NEXT[status];
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {next ? <button type="button" className="btn btn-primary btn-sm" disabled={pending} onClick={() => start(() => setOrderStatus(id, next[0]))}>{next[1]}</button> : null}
      <label className="sr-only" htmlFor={'st-' + id}>Statut</label>
      <select id={'st-' + id} className="select" style={{ minHeight: 36, padding: '6px 10px', width: 'auto', fontSize: 13 }} value={status} disabled={pending}
        onChange={(e) => start(() => setOrderStatus(id, e.target.value as OrderStatus))}>
        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
  );
}

export function CateringStatus({ id, status }: { id: string; status: CateringRequest['status'] }) {
  const [pending, start] = useTransition();
  const L: Record<CateringRequest['status'], string> = { nouvelle: 'Nouvelle', contactee: 'Client contacté', devis_envoye: 'Devis envoyé', confirmee: 'Confirmée', refusee: 'Sans suite' };
  return (
    <select className="select" aria-label="Statut de la demande" style={{ minHeight: 36, padding: '6px 10px', width: 'auto', fontSize: 13 }} value={status} disabled={pending}
      onChange={(e) => start(() => setCateringStatus(id, e.target.value as CateringRequest['status']))}>
      {Object.entries(L).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
    </select>
  );
}

type Res = { error?: string; ok?: string } | null;

export function PhoneOrderForm() {
  const [state, action, pending] = useActionState(phoneOrderAction, null as Res);
  return (
    <form action={action} className="box" style={{ padding: 22, display: 'grid', gap: 12 }}>
      <h2 style={{ fontSize: 21 }}>Commande téléphone (24 h)</h2>
      <p className="muted" style={{ fontSize: 13 }}>Pour les commandes urgentes prises au téléphone : pas de règle des 48 h.</p>
      <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div className="field"><label htmlFor="pn">Nom</label><input id="pn" name="name" className="input" required /></div>
        <div className="field"><label htmlFor="pp">Téléphone</label><input id="pp" name="phone" type="tel" className="input" required /></div>
        <div className="field"><label htmlFor="pd">Date</label><input id="pd" name="date" type="date" className="input" required /></div>
        <div className="field"><label htmlFor="pt">Heure</label><input id="pt" name="time" type="time" className="input" /></div>
      </div>
      <div className="field"><label htmlFor="pw">Contenu de la commande</label><textarea id="pw" name="what" className="textarea" rows={3} required placeholder="Ex. 2 poulet BBQ Large + plantain, 1 pondu…" /></div>
      <div className="field" style={{ maxWidth: 200 }}><label htmlFor="ptot">Total ($)</label><input id="ptot" name="total" inputMode="decimal" className="input" placeholder="0" /></div>
      {state?.error ? <p className="error">{state.error}</p> : state?.ok ? <p className="ok">✓ {state.ok}</p> : null}
      <button type="submit" className="btn btn-dark" disabled={pending}>Enregistrer</button>
    </form>
  );
}

export function PromoForm({ categories }: { categories: { id: string; fr: string }[] }) {
  const [state, action, pending] = useActionState(savePromoAction, null as Res);
  return (
    <form action={action} className="box" style={{ padding: 22, display: 'grid', gap: 14 }}>
      <h2 style={{ fontSize: 22 }}>Nouveau code</h2>
      <div className="field"><label htmlFor="pc">Code</label><input id="pc" name="code" className="input" style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontWeight: 800, textTransform: 'uppercase' }} placeholder="MASEMAINE" required /></div>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="field"><label htmlFor="pty">Type</label><select id="pty" name="type" className="select"><option value="percent">Pourcentage (%)</option><option value="fixed">Montant fixe ($)</option></select></div>
        <div className="field"><label htmlFor="pv">Valeur</label><input id="pv" name="value" inputMode="decimal" className="input" placeholder="10" required /></div>
      </div>
      <div className="field"><label htmlFor="ps">S&apos;applique à</label>
        <select id="ps" name="scope" className="select" defaultValue="weekly">
          <option value="weekly">Commandes à la semaine</option>
          <option value="all">Toute la commande</option>
          <option value="first">Première commande (par numéro de téléphone)</option>
          <option value="category">Une catégorie</option>
        </select>
      </div>
      <div className="field"><label htmlFor="pcat">Catégorie (si « Une catégorie »)</label>
        <select id="pcat" name="category" className="select"><option value="">—</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.fr}</option>)}</select>
      </div>
      <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="field"><label htmlFor="pmin">Minimum ($)</label><input id="pmin" name="min_total" inputMode="decimal" className="input" placeholder="Aucun" /></div>
        <div className="field"><label htmlFor="pmax">Utilisations max</label><input id="pmax" name="max_uses" inputMode="numeric" className="input" placeholder="Illimité" /></div>
        <div className="field"><label htmlFor="pd1">Début</label><input id="pd1" name="starts_on" type="date" className="input" /></div>
        <div className="field"><label htmlFor="pd2">Fin</label><input id="pd2" name="ends_on" type="date" className="input" /></div>
      </div>
      {state?.error ? <p className="error">{state.error}</p> : state?.ok ? <p className="ok">✓ {state.ok}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending}>Créer le code</button>
    </form>
  );
}

export function SettingsForm({ s }: { s: Settings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, null as Res);
  return (
    <form action={action} className="box" style={{ padding: 26, display: 'grid', gap: 16, maxWidth: 640 }}>
      <div className="field"><label htmlFor="mh">Délai minimum des commandes en ligne (heures)</label><input id="mh" name="min_hours" inputMode="numeric" className="input" defaultValue={s.min_hours} /></div>
      <div className="field"><label htmlFor="ie">Courriel Interac affiché au client</label><input id="ie" name="interac_email" type="email" className="input" defaultValue={s.interac_email} /></div>
      <div className="field"><label htmlFor="ph">Téléphone affiché (commandes urgentes)</label><input id="ph" name="phone" className="input" defaultValue={s.phone} /></div>
      <div className="field"><label htmlFor="bf">Bandeau d&apos;annonce (français, facultatif)</label><input id="bf" name="banner_fr" className="input" defaultValue={s.banner_fr} placeholder="Ex. Fermé du 24 au 26 décembre" /></div>
      <div className="field"><label htmlFor="be">Bandeau d&apos;annonce (anglais, facultatif)</label><input id="be" name="banner_en" className="input" defaultValue={s.banner_en} placeholder="Ex. Closed Dec 24–26" /></div>
      {state?.error ? <p className="error">{state.error}</p> : state?.ok ? <p className="ok">✓ {state.ok}</p> : null}
      <button type="submit" className="btn btn-primary" disabled={pending} style={{ justifySelf: 'start' }}>Enregistrer</button>
    </form>
  );
}

export function PrintButton() {
  return <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>Imprimer la feuille</button>;
}
