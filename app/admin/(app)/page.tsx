import Link from 'next/link';
import { getStore } from '@/lib/store';
import { addDays, mondayOf, todayLocal } from '@/lib/dates';
import { money, round2, shortDate } from '@/lib/format';
import type { Order } from '@/lib/types';
import { PhoneOrderForm, StatusControl } from './widgets';
import { STATUS_LABEL } from '@/lib/status';
import { clientMessages } from '@/lib/messages';

const VIEWS: Record<string, { label: string; f: (o: Order, today: string) => boolean }> = {
  'a-venir': { label: 'À venir', f: (o, t) => o.pickup_date >= t && o.status !== 'annulee' && o.status !== 'recuperee' },
  'a-confirmer': { label: 'À confirmer', f: (o) => o.status === 'nouvelle' },
  interac: { label: 'Interac attendu', f: (o) => o.status === 'confirmee' },
  semaine: { label: 'À la semaine', f: (o) => o.kind === 'weekly' && o.status !== 'annulee' },
  toutes: { label: 'Toutes', f: () => true }
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  const { vue = 'a-venir' } = await searchParams;
  const view = VIEWS[vue] ? vue : 'a-venir';
  const today = todayLocal();
  const [all, settings] = await Promise.all([getStore().listOrders(), getStore().getSettings()]);
  const list = all.filter((o) => VIEWS[view].f(o, today));
  const monday = mondayOf(today);
  const paidWeek = all.filter((o) => ['payee', 'preparation', 'prete', 'recuperee'].includes(o.status) && o.pickup_date >= monday && o.pickup_date <= addDays(monday, 6));
  const tomorrow = addDays(today, 1);
  const dueSoon = all.filter((o) => (o.pickup_date === today || o.pickup_date === tomorrow) && !['annulee', 'recuperee'].includes(o.status)).length;
  const dateLabel = new Date(today + 'T12:00:00Z').toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
        <div><p className="muted" style={{ fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }}>{dateLabel}</p><h1>Commandes</h1></div>
        <Link href="/admin/production" className="btn btn-dark btn-sm">Feuille de production →</Link>
      </div>

      <div className="kpis">
        <Link href="/admin?vue=a-confirmer" className="kpi" style={{ color: 'inherit' }}><b>À confirmer</b><strong style={{ color: 'var(--rust)' }}>{all.filter((o) => o.status === 'nouvelle').length}</strong><small>nouvelles commandes du site</small></Link>
        <Link href="/admin?vue=interac" className="kpi" style={{ color: 'inherit' }}><b>Interac attendu</b><strong>{all.filter((o) => o.status === 'confirmee').length}</strong><small>confirmées, non payées</small></Link>
        <div className="kpi"><b>Aujourd&apos;hui & demain</b><strong>{dueSoon}</strong><small>commandes à remettre</small></div>
        <div className="kpi" style={{ background: 'var(--charcoal)', borderColor: 'var(--charcoal)', color: '#fff' }}><b style={{ color: 'var(--gold)' }}>Cette semaine (payé)</b><strong style={{ color: 'var(--ember)' }}>{money(round2(paidWeek.reduce((s, o) => s + o.total, 0)))}</strong><small style={{ color: '#B9AC9E' }}>{paidWeek.length} commande(s)</small></div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        <div className="box" style={{ flex: '999 1 640px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '16px 18px' }}>
            {Object.entries(VIEWS).map(([k, v]) => <Link key={k} href={`/admin?vue=${k}`} className={'tab' + (view === k ? ' on' : '')} style={{ padding: '8px 14px', fontSize: 13 }}>{v.label}</Link>)}
          </div>
          {list.length === 0 ? <p className="muted" style={{ padding: '10px 20px 26px' }}>Aucune commande dans cette vue.</p> : (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>N°</th><th>Client</th><th>Ramassage</th><th>Contenu</th><th style={{ textAlign: 'right' }}>Total</th><th>Statut</th><th>Action</th></tr></thead>
                <tbody>
                  {list.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 800 }}>#{o.number}{o.source === 'telephone' ? <div className="muted" style={{ fontSize: 11.5 }}>téléphone</div> : null}{o.kind === 'weekly' ? <div style={{ fontSize: 11.5, color: 'var(--rust)', fontWeight: 800 }}>semaine{o.repeat_weekly ? ' · à répéter' : ''}</div> : null}</td>
                      <td>{o.customer_name}<div className="muted" style={{ fontSize: 12 }}><a href={'tel:' + o.phone}>{o.phone}</a></div>{o.email ? <div className="muted" style={{ fontSize: 12 }}>{o.email}</div> : null}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{shortDate(o.pickup_date, 'fr')}{o.pickup_time ? ` · ${o.pickup_time}` : ''}{o.kind === 'weekly' ? <div className="muted" style={{ fontSize: 12 }}>{o.weekly_mode === 'daily' ? 'chaque jour' : 'en une fois'}</div> : null}</td>
                      <td style={{ minWidth: 260, maxWidth: 380 }}>
                        <details className="order">
                          <summary>{o.lines.length ? o.lines.slice(0, 2).map((l) => `${l.qty} × ${l.name}`).join(', ') + (o.lines.length > 2 ? ` +${o.lines.length - 2}` : '') : (o.notes || '').slice(0, 80)} <span style={{ color: 'var(--rust)', fontWeight: 700 }}>▾</span></summary>
                          <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 13 }}>
                            {o.lines.map((l, i) => <li key={i}>{l.qty} × {l.name}{o.kind === 'weekly' && l.day ? ` [${shortDate(l.day, 'fr')}]` : ''} — {money(l.total)}{l.details.length ? <div className="muted">{l.details.join(' · ')}</div> : null}</li>)}
                          </ul>
                          {o.notes ? <p className="note" style={{ marginTop: 8, fontSize: 13 }}>{o.notes}</p> : null}
                          {o.promo_code ? <p className="ok" style={{ marginTop: 6 }}>Code {o.promo_code} : −{money(o.discount)}</p> : null}
                          <p className="muted" style={{ fontSize: 12, marginTop: 6 }}>Lien client : /commande/{o.token}</p>
                        </details>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800 }}>{money(o.total)}</td>
                      <td><span className={'pill st-' + o.status}>{STATUS_LABEL[o.status]}</span></td>
                      <td>
                        <StatusControl id={o.id} status={o.status} />
                        {o.status !== 'annulee' && o.status !== 'recuperee' ? (() => { const m = clientMessages(o, settings); return (
                          <div className="msg-links" aria-label={'Message au client : ' + m.label}>
                            <span>{m.label} :</span>
                            <a href={m.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
                            <a href={m.sms}>Texto</a>
                            {m.mail ? <a href={m.mail}>Courriel</a> : null}
                          </div>); })() : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 0 }}><PhoneOrderForm /></div>
      </div>
    </>
  );
}
