import type { Order, Settings } from './types';
import { longDate, money } from './format';

/** Messages prêts à envoyer au client depuis le back office. */
export function clientMessages(o: Order, s: Settings, base = 'https://chezsifa.vercel.app') {
  const first = o.customer_name.split(' ')[0];
  const when = longDate(o.pickup_date, 'fr') + (o.pickup_time ? ` vers ${o.pickup_time}` : '');
  const link = `${base}/commande/${o.token}`;
  const confirm = `Bonjour ${first}, ici Chez Sifa. Votre commande n° ${o.number} est confirmée pour le ${when}. Total : ${money(o.total)}. Merci d'envoyer le virement Interac à ${s.interac_email} en indiquant ${o.number} dans le message. Suivi : ${link}`;
  const ready = `Bonjour ${first}, votre commande Chez Sifa n° ${o.number} est prête ! Vous pouvez passer la récupérer. À tout de suite. Chez Sifa – ${s.phone}`;
  const paid = `Bonjour ${first}, nous avons bien reçu votre paiement Interac pour la commande n° ${o.number}. Merci ! On lance la préparation pour le ${when}.`;
  const pick = o.status === 'prete' ? { label: 'Prête', text: ready } : o.status === 'payee' || o.status === 'preparation' ? { label: 'Paiement reçu', text: paid } : { label: 'Confirmation', text: confirm };
  const digits = o.phone.replace(/\D/g, '');
  const intl = digits.length === 10 ? '1' + digits : digits;
  return {
    label: pick.label,
    sms: `sms:+${intl}?&body=${encodeURIComponent(pick.text)}`,
    whatsapp: `https://wa.me/${intl}?text=${encodeURIComponent(pick.text)}`,
    mail: o.email ? `mailto:${o.email}?subject=${encodeURIComponent(`Chez Sifa – commande n° ${o.number}`)}&body=${encodeURIComponent(pick.text)}` : null
  };
}
