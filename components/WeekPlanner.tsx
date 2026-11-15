'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Catalog, CartLine, Product } from '@/lib/types';
import { money, shortDate, tx, longDate } from '@/lib/format';
import { addDays, mondayOf } from '@/lib/dates';
import { lineDetails, lineTitle, productMap, unitPrice } from '@/lib/pricing';
import { useCart } from './Providers';
import { Composer } from './Composer';
import { ProductCard, needsComposer } from './ProductCard';

export function WeekPlanner({ catalog, first, phone }: { catalog: Catalog; first: string; phone: string }) {
  const { lang, lines, add, remove, ready } = useCart();
  const pm = useMemo(() => productMap(catalog), [catalog]);
  const [week, setWeek] = useState(mondayOf(first));
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<'compose' | 'items'>('compose');
  const [dish, setDish] = useState<string | undefined>();
  const days = Array.from({ length: 7 }, (_, i) => addDays(week, i));
  const dayLines = (d: string) => lines.filter((l) => l.day === d);
  const planned = [...new Set(lines.filter((l) => l.day).map((l) => l.day!))].sort();
  const loose = lines.filter((l) => !l.day);
  const lineCost = (l: CartLine) => { try { return unitPrice(l, catalog, pm) * l.qty; } catch { return 0; } };
  const total = lines.filter((l) => l.day).reduce((s, l) => s + lineCost(l), 0);
  const tel = 'tel:+1' + phone.replace(/\D/g, '').slice(-10);

  const addTo = (day: string) => (l: Omit<CartLine, 'key'>) => add({ ...l, day }, tx(lang, `Ajouté au ${shortDate(day, lang)}`, `Added to ${shortDate(day, lang)}`));
  const openDay = (d: string) => { setOpen(d); setTab('compose'); setDish(undefined); };
  const simple = catalog.products.filter((p) => !catalog.categories.find((c) => c.id === p.cat)?.composable && p.cat !== 'extras');

  return (
    <>
      <section className="wrap" style={{ paddingTop: 52, paddingBottom: 26, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
        <div style={{ maxWidth: 680 }}>
          <span className="eyebrow">{tx(lang, 'Commande à la semaine', 'Weekly order')}</span>
          <h1 className="h-lg">{tx(lang, 'Votre semaine, ', 'Your week, ')}<em style={{ fontWeight: 400, color: 'var(--rust)' }}>{tx(lang, 'déjà cuisinée.', 'already cooked.')}</em></h1>
          <p className="lead">{tx(lang, 'Planifiez vos repas jour par jour, en une seule commande et un seul paiement Interac.', 'Plan your meals day by day, in one order and one Interac payment.')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid var(--line)', borderRadius: 999, padding: 6 }}>
          <button type="button" className="mini" style={{ borderRadius: 999, width: 42 }} aria-label={tx(lang, 'Semaine précédente', 'Previous week')} disabled={week <= mondayOf(first)} onClick={() => setWeek(addDays(week, -7))}>‹</button>
          <strong style={{ padding: '0 8px', fontSize: 15 }}>{tx(lang, 'Semaine du ', 'Week of ')}{shortDate(days[0], lang)}</strong>
          <button type="button" className="mini" style={{ borderRadius: 999, width: 42 }} aria-label={tx(lang, 'Semaine suivante', 'Next week')} onClick={() => setWeek(addDays(week, 7))}>›</button>
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 26 }}>
        <div className="week">
          {days.map((d) => {
            const blocked = d < first;
            const ls = dayLines(d);
            const sum = ls.reduce((s, l) => s + lineCost(l), 0);
            return (
              <div key={d} className={'wday' + (blocked ? ' blocked' : ls.length ? ' has' : '')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
                  <h3 style={{ color: blocked ? 'var(--muted-2)' : undefined }}>{shortDate(d, lang)}</h3>
                  {sum ? <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--rust)' }}>{money(sum, lang)}</span> : null}
                </div>
                {blocked ? (
                  <>
                    <p className="muted" style={{ fontSize: 13 }}>{tx(lang, 'Moins de 48 h', 'Less than 48 h')}</p>
                    <a href={tel} style={{ marginTop: 'auto', fontWeight: 800, fontSize: 13 }}>{tx(lang, 'Appeler Chez Sifa', 'Call Chez Sifa')}</a>
                  </>
                ) : (
                  <>
                    {ready && ls.map((l) => (
                      <div key={l.key} className="meal">
                        <b>{l.qty} × {lineTitle(l, catalog, lang, pm)}</b>
                        <span className="muted">{lineDetails(l, catalog, lang, pm).slice(0, 2).join(' · ')}</span>
                        <button type="button" aria-label={tx(lang, 'Retirer', 'Remove')} onClick={() => remove(l.key)}>×</button>
                      </div>
                    ))}
                    {!ls.length ? <p className="muted" style={{ fontSize: 13 }}>{tx(lang, 'Rien de prévu', 'Nothing planned')}</p> : null}
                    <button type="button" className="add-dash" onClick={() => openDay(d)}>+ {tx(lang, 'Ajouter', 'Add')}</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="wrap" style={{ paddingBottom: 96, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
        <div className="card pad" style={{ flex: '999 1 520px', minWidth: 0 }}>
          <h2 style={{ fontSize: 23, marginBottom: 12 }}>{tx(lang, 'Comment ça se passe ?', 'How does it work?')}</h2>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }} className="muted">
            <li>{tx(lang, 'Ajoutez des assiettes ou des articles à chaque jour voulu.', 'Add plates or items to each day you want.')}</li>
            <li>{tx(lang, 'Au panier, choisissez : un seul ramassage pour toute la semaine, ou un ramassage chaque jour.', 'In the cart, choose one pickup for the whole week, or a pickup each day.')}</li>
            <li>{tx(lang, 'Cochez « Répéter chaque semaine » : Chez Sifa vous recontacte avant la semaine suivante.', 'Tick “Repeat every week”: Chez Sifa contacts you before the next week.')}</li>
            <li>{tx(lang, 'Un code promo semaine ? Saisissez-le au panier.', 'Got a weekly promo code? Enter it in the cart.')}</li>
          </ul>
          {ready && loose.length ? <p className="note" style={{ marginTop: 16 }}>{tx(lang, `Votre panier contient aussi ${loose.length} article(s) sans jour : ils seront préparés pour le premier jour planifié.`, `Your cart also has ${loose.length} item(s) without a day: they will be prepared for the first planned day.`)}</p> : null}
        </div>
        <aside className="summary" style={{ flex: '1 1 320px', position: 'static' }}>
          <div className="top">
            <span className="eyebrow eyebrow-gold" style={{ marginBottom: 0 }}>{tx(lang, 'Ma semaine', 'My week')}</span>
            <h3>{planned.length} {tx(lang, 'jour(s) planifié(s)', 'day(s) planned')}</h3>
            <ul className="sum-list">
              {planned.map((d) => <li key={d}><span>{shortDate(d, lang)}</span><span>{money(dayLines(d).reduce((s, l) => s + lineCost(l), 0), lang)}</span></li>)}
            </ul>
          </div>
          <div className="bottom">
            <div className="total-row"><span>{tx(lang, 'SOUS-TOTAL', 'SUBTOTAL')}</span><strong>{money(total, lang)}</strong></div>
            {planned.length ? <Link href="/panier" className="btn btn-primary btn-block">{tx(lang, 'Commander ma semaine', 'Order my week')}</Link> : <button type="button" className="btn btn-primary btn-block" disabled>{tx(lang, 'Commander ma semaine', 'Order my week')}</button>}
            <p className="hint">{tx(lang, 'Un seul paiement Interac · code promo au panier', 'One Interac payment · promo code in cart')}</p>
          </div>
        </aside>
      </section>

      {open && (
        <div className="drawer-bg" role="dialog" aria-modal="true" aria-label={tx(lang, 'Ajouter un repas', 'Add a meal')} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
          <div className="drawer">
            <div className="drawer-head">
              <h2>{longDate(open, lang)}</h2>
              <button type="button" className="x-btn" aria-label={tx(lang, 'Fermer', 'Close')} onClick={() => setOpen(null)}>×</button>
            </div>
            <div style={{ padding: '18px 20px 40px' }}>
              <div className="tabs" style={{ paddingTop: 0 }}>
                <button type="button" className={'tab' + (tab === 'compose' ? ' on' : '')} onClick={() => setTab('compose')}>{tx(lang, 'Composer une assiette', 'Build a plate')}</button>
                <button type="button" className={'tab' + (tab === 'items' ? ' on' : '')} onClick={() => setTab('items')}>{tx(lang, 'Accompagnements, entrées, douceurs…', 'Sides, starters, cakes…')}</button>
              </div>
              {ready && dayLines(open).length ? <p className="ok" style={{ margin: '0 0 12px' }}>✓ {dayLines(open).length} {tx(lang, 'article(s) prévu(s) ce jour', 'item(s) planned this day')}</p> : null}
              {tab === 'compose' ? (
                <Composer key={open + (dish || '')} catalog={catalog} initialDish={dish} onAdd={addTo(open)} footnote={tx(lang, 'Ajouté au jour choisi', 'Added to the chosen day')} />
              ) : (
                <div className="grid g-auto-250">
                  {simple.map((p: Product) => <ProductCard key={p.id} p={p} onAdd={addTo(open)} onCompose={needsComposer(p) ? (x) => { setDish(x.id); setTab('compose'); } : undefined} />)}
                </div>
              )}
              <button type="button" className="btn btn-dark btn-block" style={{ marginTop: 20 }} onClick={() => setOpen(null)}>{tx(lang, 'Terminé pour ce jour', 'Done for this day')}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
