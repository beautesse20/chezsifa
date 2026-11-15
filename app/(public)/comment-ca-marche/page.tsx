import type { Metadata } from 'next';
import Link from 'next/link';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';
import { tx } from '@/lib/format';

export const metadata: Metadata = { title: 'Comment ça marche', description: 'Commander chez Chez Sifa : délai de 48 h, ramassage, paiement Interac, commandes à la semaine et codes promo.' };

export default async function HowPage() {
  const [lang, settings] = await Promise.all([getLang(), getStore().getSettings()]);
  const h = settings.min_hours;
  const tel = 'tel:+1' + settings.phone.replace(/\D/g, '').slice(-10);
  const faq: [string, string, string, string][] = [
    ['Combien de temps à l\'avance faut-il commander ?', `Les commandes en ligne se font au moins ${h} h à l'avance : le calendrier ne propose que les dates possibles. Pour une commande dans les 24 h, appelez-nous au ${settings.phone}.`, 'How far ahead should I order?', `Online orders need at least ${h} h notice: the calendar only shows possible dates. For an order within 24 h, call us at ${settings.phone}.`],
    ['Livrez-vous ?', 'Non, toutes les commandes sont à récupérer. L\'adresse de ramassage vous est envoyée avec la confirmation.', 'Do you deliver?', 'No, all orders are for pickup. The pickup address is sent with the confirmation.'],
    ['Comment payer ?', `Par virement Interac à ${settings.interac_email}, après la confirmation de Chez Sifa. Indiquez votre numéro de commande dans le message du virement.`, 'How do I pay?', `By Interac e-Transfer to ${settings.interac_email}, after Chez Sifa confirms. Put your order number in the transfer message.`],
    ['Puis-je commander pour toute la semaine ?', 'Oui : dans « Ma semaine », ajoutez des repas à chaque jour, puis choisissez un seul ramassage ou un ramassage par jour. Un seul paiement pour la semaine.', 'Can I order for the whole week?', 'Yes: in “My week”, add meals to each day, then choose one pickup or one pickup per day. One payment for the week.'],
    ['Comment utiliser un code promo ?', 'Saisissez-le dans le panier et cliquez sur « Appliquer ». Certains codes sont réservés aux commandes à la semaine ou à la première commande.', 'How do I use a promo code?', 'Enter it in the cart and click “Apply”. Some codes are for weekly orders or first orders only.'],
    ['Que veulent dire Regular et Large ?', 'Ce sont les deux formats de portion. Les grillades comprennent un accompagnement au choix.', 'What do Regular and Large mean?', 'They are the two portion sizes. Grills include one side of your choice.'],
    ['Les prix comprennent-ils les taxes ?', 'Les prix affichés sont en dollars canadiens, avant taxes applicables. Le montant exact est confirmé par Chez Sifa.', 'Do prices include taxes?', 'Prices are in Canadian dollars, before applicable taxes. The exact amount is confirmed by Chez Sifa.'],
    ['Et pour un événement ?', 'Pour un mariage, une fête ou un événement d\'entreprise, passez par l\'espace traiteur et demandez un devis.', 'What about an event?', 'For a wedding, party or corporate event, use the catering section and request a quote.']
  ];
  return (
    <>
      <div className="kuba kuba-sm" />
      <section className="wrap-narrow" style={{ paddingTop: 56, paddingBottom: 30 }}>
        <span className="eyebrow">{tx(lang, 'Comment ça marche', 'How it works')}</span>
        <h1 className="h-lg">{tx(lang, 'Commander chez Sifa, simplement', 'Ordering from Sifa, simply')}</h1>
      </section>
      <section className="wrap-narrow" style={{ paddingBottom: 40 }}>
        <div className="grid g-auto-250" style={{ gap: 18 }}>
          {[
            ['1', tx(lang, 'Composez', 'Build'), tx(lang, 'Une assiette, la carte ou toute votre semaine.', 'A plate, the menu or your whole week.')],
            ['2', tx(lang, 'Choisissez votre jour', 'Pick your day'), tx(lang, `À partir de ${h} h. Plus tôt : par téléphone.`, `From ${h} h ahead. Sooner: by phone.`)],
            ['3', tx(lang, 'Confirmation & Interac', 'Confirmation & Interac'), tx(lang, 'Chez Sifa confirme, vous payez par virement.', 'Chez Sifa confirms, you pay by e-Transfer.')],
            ['4', tx(lang, 'Récupérez', 'Pick up'), tx(lang, 'Votre commande vous attend, encore chaude.', 'Your order is waiting, still warm.')]
          ].map(([n, t, d]) => (
            <div key={n} className="card pad"><span className="step-num" style={{ marginBottom: 14 }}>{n}</span><h2 style={{ fontSize: 21, margin: '12px 0 6px' }}>{t}</h2><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>
      <section className="wrap-narrow" style={{ paddingBottom: 96 }}>
        <h2 className="h-md" style={{ marginBottom: 20 }}>{tx(lang, 'Questions fréquentes', 'FAQ')}</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {faq.map(([qf, af, qe, ae]) => (
            <details key={qf} className="card" style={{ padding: '18px 22px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>{lang === 'en' ? qe : qf}</summary>
              <p className="muted" style={{ marginTop: 10 }}>{lang === 'en' ? ae : af}</p>
            </details>
          ))}
        </div>
        <div className="btn-row" style={{ marginTop: 30 }}>
          <Link href="/composer" className="btn btn-primary">{tx(lang, 'Composer mon assiette', 'Build my plate')}</Link>
          <a href={tel} className="btn btn-outline">{settings.phone}</a>
        </div>
      </section>
    </>
  );
}
