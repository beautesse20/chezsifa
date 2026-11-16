import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStore } from '@/lib/store';
import { getLang } from '@/lib/server';
import { lineDetails, lineTitle, productMap } from '@/lib/pricing';
import { longDate, money, shortDate, tx } from '@/lib/format';
import type { OrderStatus } from '@/lib/types';

export const metadata: Metadata = { title: 'Votre commande', robots: { index: false } };

const STEPS: { s: OrderStatus[]; fr: string; en: string }[] = [
  { s: ['nouvelle'], fr: 'Commande reçue', en: 'Order received' },
  { s: ['confirmee'], fr: 'Confirmée par Chez Sifa', en: 'Confirmed by Chez Sifa' },
  { s: ['payee'], fr: 'Paiement Interac reçu', en: 'Interac payment received' },
  { s: ['preparation'], fr: 'En préparation', en: 'Being prepared' },
  { s: ['prete', 'recuperee'], fr: 'Prête', en: 'Ready' }
];

export default async function OrderPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const store = getStore();
  const [order, lang, settings, catalog] = await Promise.all([store.getOrderByToken(token), getLang(), store.getSettings(), store.getCatalog({ includeInactive: true })]);
  if (!order) notFound();
  const pm = productMap(catalog);
  const idx = order.status === 'annulee' ? -1 : STEPS.findIndex((s) => s.s.includes(order.status));
  const first = order.customer_name.split(' ')[0];
  const tel = 'tel:+1' + settings.phone.replace(/\D/g, '').slice(-10);
  const d = order.pickup_date.replace(/-/g, '');
  const next = new Date(order.pickup_date + 'T12:00:00Z'); next.setUTCDate(next.getUTCDate() + 1);
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Ramassage Chez Sifa – commande ${order.number}`)}&dates=${d}/${next.toISOString().slice(0, 10).replace(/-/g, '')}&details=${encodeURIComponent(`Commande n° ${order.number}. Total : ${money(order.total)}`)}`;
  const name = (l: (typeof order.lines)[number]) => (pm.has(l.productId) ? lineTitle(l, catalog, lang, pm) : l.name);
  const details = (l: (typeof order.lines)[number]) => (pm.has(l.productId) ? lineDetails(l, catalog, lang, pm) : l.details);

  return (
    <>
      <div className="kuba kuba-sm" />
      <section className="wrap-narrow center" style={{ paddingTop: 60, paddingBottom: 30 }}>
        <div style={{ width: 78, height: 78, borderRadius: '50%', background: order.status === 'annulee' ? 'var(--muted)' : 'var(--green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
        </div>
        <span className="eyebrow">{tx(lang, `Commande n° ${order.number}`, `Order #${order.number}`)}</span>
        <h1 className="h-lg">{order.status === 'annulee' ? tx(lang, 'Commande annulée', 'Order cancelled') : tx(lang, `Merci ${first}, on s'en occupe !`, `Thank you ${first}, we're on it!`)}</h1>
        <p className="lead">{tx(lang, 'Chez Sifa vérifie votre commande et vous confirme le montant exact par texto ou courriel. Gardez cette page : elle se met à jour.', 'Chez Sifa checks your order and confirms the exact amount by text or email. Keep this page: it updates.')}</p>
      </section>

      {order.status !== 'annulee' && (
        <section className="wrap-narrow" style={{ paddingBottom: 30 }}>
          <div className="card pad">
            <ol className="track" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {STEPS.map((s, i) => (
                <li key={i} className={'st' + (i < idx || order.status === 'recuperee' || (i === idx && i === 0) ? ' done' : i === idx ? ' now' : '')}>
                  <i aria-hidden="true">{i < idx || (i === idx && i === 0) || order.status === 'recuperee' ? '✓' : i + 1}</i>
                  {lang === 'en' ? s.en : s.fr}
                  {i === 4 ? <span style={{ fontWeight: 500, fontSize: 12.5 }}>{shortDate(order.pickup_date, lang)}</span> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section className="wrap-narrow" style={{ display: 'flex', flexWrap: 'wrap', gap: 22, alignItems: 'flex-start', paddingBottom: 96 }}>
        <div className="bg-dark" style={{ flex: '1 1 400px', minWidth: 0, borderRadius: 22, padding: 30 }}>
          <span className="eyebrow eyebrow-gold">{tx(lang, 'Après confirmation', 'After confirmation')}</span>
          <h2 style={{ fontSize: 28, marginBottom: 18 }}>{tx(lang, 'Payer par virement Interac', 'Pay by Interac e-Transfer')}</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 14 }}>
            {[
              tx(lang, 'Attendez le message de confirmation avec le montant exact.', 'Wait for the confirmation message with the exact amount.'),
              <>{tx(lang, 'Envoyez le virement à ', 'Send the transfer to ')}<strong style={{ color: 'var(--ember)' }}>{settings.interac_email}</strong></>,
              <>{tx(lang, 'Indiquez ', 'Write ')}<strong style={{ color: 'var(--ember)' }}>{order.number}</strong>{tx(lang, ' dans le message du virement.', ' in the transfer message.')}</>
            ].map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 12 }}><span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--rust)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span><span>{t}</span></li>
            ))}
          </ol>
          <p style={{ marginTop: 20, background: 'var(--white)', borderRadius: 14, padding: '14px 16px', fontSize: 14, color: 'var(--muted)' }}>{tx(lang, 'La préparation commence dès la réception du paiement.', 'Preparation starts once payment is received.')}</p>
        </div>

        <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card pad">
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>{tx(lang, 'Récapitulatif', 'Summary')}</h2>
            {order.lines.map((l, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #EFE5DA' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14.5 }}><span>{l.qty} × {name(l)}{order.kind === 'weekly' && l.day ? <span className="muted"> · {shortDate(l.day, lang)}</span> : null}</span><span>{money(l.total, lang)}</span></div>
                {details(l).length ? <div className="muted" style={{ fontSize: 12.5 }}>{details(l).join(' · ')}</div> : null}
              </div>
            ))}
            {order.discount ? <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: 'var(--green)', fontWeight: 700 }}><span>{tx(lang, 'Code ', 'Code ')}{order.promo_code}</span><span>−{money(order.discount, lang)}</span></div> : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12 }}><strong>{tx(lang, 'Total estimé', 'Estimated total')}</strong><strong style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--rust)' }}>{money(order.total, lang)}</strong></div>
          </div>
          <div style={{ background: 'var(--sand)', borderRadius: 22, padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <div style={{ flex: '1 1 200px' }}>
              <strong>{order.kind === 'weekly' && order.weekly_mode === 'daily' ? tx(lang, 'Ramassage chaque jour planifié', 'Pickup each planned day') : tx(lang, 'Ramassage ', 'Pickup ') + longDate(order.pickup_date, lang)}{order.pickup_time ? tx(lang, `, vers ${order.pickup_time}`, `, around ${order.pickup_time}`) : ''}</strong>
              <div className="muted" style={{ fontSize: 13.5 }}>{tx(lang, 'Adresse envoyée avec la confirmation', 'Address sent with the confirmation')}</div>
            </div>
            <a href={gcal} target="_blank" rel="noopener" className="btn btn-outline btn-sm">{tx(lang, 'Ajouter au calendrier', 'Add to calendar')}</a>
          </div>
          <p className="muted center" style={{ fontSize: 14 }}>{tx(lang, 'Une modification ? Appelez le ', 'Need a change? Call ')}<a href={tel} style={{ fontWeight: 800 }}>{settings.phone}</a> · <Link href="/carte">{tx(lang, 'Retour à la carte', 'Back to menu')}</Link></p>
        </div>
      </section>
    </>
  );
}
