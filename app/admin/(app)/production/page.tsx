import Link from 'next/link';
import { getStore } from '@/lib/store';
import { addDays, isoDateRe, todayLocal } from '@/lib/dates';
import { L, longDate } from '@/lib/format';
import { productMap, PACK_SIZE } from '@/lib/pricing';
import type { OrderLineSnapshot } from '@/lib/types';
import { PrintButton } from '../widgets';
import { STATUS_LABEL } from '@/lib/status';

export default async function ProductionPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: q } = await searchParams;
  const today = todayLocal();
  const store = getStore();
  let date = q && isoDateRe.test(q) ? q : today;
  if (!q) {
    const upcoming = (await store.listOrders({ from: today })).filter((o) => o.status !== 'annulee' && o.status !== 'recuperee').map((o) => o.pickup_date).sort()[0];
    if (upcoming) date = upcoming;
  }
  const [orders, catalog] = await Promise.all([store.listOrders({ from: addDays(date, -7), to: addDays(date, 7) }), store.getCatalog({ includeInactive: true })]);
  const pm = productMap(catalog);

  // Lignes à préparer ce jour-là : commande simple ou « en une fois » le jour du ramassage ; « chaque jour » selon le jour de la ligne.
  const relevant: { o: (typeof orders)[number]; l: OrderLineSnapshot }[] = [];
  const dayOrders = new Set<string>();
  for (const o of orders) {
    if (o.status === 'annulee' || o.status === 'recuperee') continue;
    for (const l of o.lines) {
      const d = o.kind === 'weekly' && o.weekly_mode === 'daily' ? l.day || o.pickup_date : o.pickup_date;
      if (d === date) { relevant.push({ o, l }); dayOrders.add(o.id); }
    }
    if (!o.lines.length && o.pickup_date === date) dayOrders.add(o.id);
  }

  const tally = new Map<string, { label: string; qty: number; unit: string; cat: string }>();
  const bump = (key: string, label: string, qty: number, unit: string, cat: string) => {
    const t = tally.get(key) || { label, qty: 0, unit, cat };
    t.qty += qty; tally.set(key, t);
  };
  for (const { l } of relevant) {
    const p = pm.get(l.productId);
    const cat = p?.cat || l.cat;
    if (p?.sizes === 'pack') bump(l.productId, L('fr', p), l.qty * PACK_SIZE, 'pièces', cat);
    else {
      const size = p?.sizes === 'rl' ? (l.size === 'l' ? ' · Large' : ' · Regular') : p?.sizes === 'ml' ? (l.size === 'l' ? ' · 500 ml' : ' · 250 ml') : '';
      const opt = (p?.opts || []).map((g) => g.choices.find((c) => c.id === l.opts?.[g.key])?.fr).filter(Boolean).join(', ');
      bump(`${l.productId}|${l.size}|${opt}`, (p ? L('fr', p) : l.name) + size + (opt ? ` (${opt})` : ''), l.qty, '', cat);
    }
    if (l.side) { const s = catalog.includedSides.find((x) => x.id === l.side); bump('side|' + l.side, `${s?.fr || l.side} (inclus)`, l.qty, 'portions', 'sides'); }
    for (const x of l.extras || []) { const e = pm.get(x); bump('x|' + x, `${e?.fr || x} (supplément)`, l.qty, '', 'extras'); }
    if (l.extraSide) { const e = pm.get(l.extraSide); bump('xs|' + l.extraSide, `${e?.fr || l.extraSide} · Regular (supplément)`, l.qty, '', 'sides'); }
    if (l.salad) { const e = pm.get(l.salad); bump('sa|' + l.salad, `${e?.fr || l.salad} · Regular (supplément)`, l.qty, '', 'salads'); }
  }
  const groups = catalog.categories.map((c) => ({ c, rows: [...tally.values()].filter((t) => t.cat === c.id).sort((a, b) => b.qty - a.qty) })).filter((g) => g.rows.length);
  const list = orders.filter((o) => dayOrders.has(o.id));

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14 }}>
        <div><p className="muted" style={{ fontWeight: 700, fontSize: 13 }}>Feuille de production</p><h1 style={{ textTransform: 'capitalize' }}>{longDate(date, 'fr')}</h1></div>
        <div className="btn-row" style={{ alignItems: 'center' }}>
          <Link href={`/admin/production?date=${addDays(date, -1)}`} className="btn btn-outline btn-sm">← Veille</Link>
          <Link href="/admin/production" className="btn btn-outline btn-sm">Aujourd&apos;hui</Link>
          <Link href={`/admin/production?date=${addDays(date, 1)}`} className="btn btn-outline btn-sm">Lendemain →</Link>
          <form style={{ display: 'flex', gap: 6 }}><label className="sr-only" htmlFor="pdate">Date</label><input id="pdate" type="date" name="date" defaultValue={date} className="input" style={{ minHeight: 40, padding: '6px 10px', width: 160 }} /><button className="btn btn-dark btn-sm" type="submit">Voir</button></form>
          <PrintButton />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        <div className="box" style={{ flex: '1 1 380px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ background: 'var(--rust)', color: '#fff', padding: '16px 20px' }}>
            <div style={{ fontSize: 12, letterSpacing: 2, fontWeight: 800, color: '#FFE3C8' }}>À PRÉPARER</div>
            <div style={{ fontSize: 13.5, color: '#FFE9D9' }}>Calculé à partir de {list.length} commande(s), hors annulées et récupérées</div>
          </div>
          {groups.length === 0 ? <p className="muted" style={{ padding: 20 }}>Rien à préparer ce jour-là.</p> : groups.map(({ c, rows }) => (
            <div key={c.id} style={{ padding: '6px 20px 10px' }}>
              <h2 style={{ fontFamily: 'var(--sans)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--rust)', margin: '12px 0 4px' }}>{c.fr}</h2>
              {rows.map((r) => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '9px 0', borderBottom: '1px solid #F3EBE2' }}>
                  <span>{r.label}</span><strong style={{ fontFamily: 'var(--serif)', fontSize: 20 }}>{r.qty}{r.unit ? <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--muted)' }}> {r.unit}</span> : null}</strong>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="box" style={{ flex: '2 1 480px', minWidth: 0, overflow: 'hidden' }}>
          <h2 style={{ fontSize: 21, padding: '18px 20px 6px' }}>Commandes du jour</h2>
          {list.length === 0 ? <p className="muted" style={{ padding: '6px 20px 20px' }}>Aucune commande.</p> : (
            <div className="tbl-wrap">
              <table className="tbl" style={{ minWidth: 520 }}>
                <thead><tr><th>N°</th><th>Client</th><th>Heure</th><th>Statut</th></tr></thead>
                <tbody>
                  {list.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 800 }}>#{o.number}</td>
                      <td>{o.customer_name}<div className="muted" style={{ fontSize: 12 }}>{o.phone}</div>{!o.lines.length && o.notes ? <div style={{ fontSize: 12.5 }}>{o.notes}</div> : null}</td>
                      <td>{o.pickup_time || '—'}</td>
                      <td><span className={'pill st-' + o.status}>{STATUS_LABEL[o.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {list.some((o) => !o.lines.length) ? <p className="muted" style={{ padding: '0 20px 16px', fontSize: 12.5 }}>Les commandes téléphone ne sont pas détaillées dans le total : voir leur contenu ci-dessus.</p> : null}
        </div>
      </div>
      {date === today ? null : <p className="muted" style={{ fontSize: 12.5 }}>Aujourd&apos;hui : {longDate(today, 'fr')}</p>}
    </>
  );
}
