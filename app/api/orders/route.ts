import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { applyPromo, lineDetails, lineTitle, productMap, subtotalOf, unitPrice, validateLine } from '@/lib/pricing';
import { isAllowed, isoDateRe, timeRe, todayLocal } from '@/lib/dates';
import { money, round2, tx } from '@/lib/format';
import { notify } from '@/lib/notify';
import type { CartLine, Lang, OrderLineSnapshot } from '@/lib/types';

export const dynamic = 'force-dynamic';

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return bad('Requête invalide'); }
  const lang: Lang = body.lang === 'en' ? 'en' : 'fr';
  if (str(body.website, 50)) return bad('Requête refusée');

  const store = getStore();
  const [catalog, settings] = await Promise.all([store.getCatalog(), store.getSettings()]);
  const pm = productMap(catalog);

  const raw = Array.isArray(body.lines) ? (body.lines as CartLine[]) : [];
  if (raw.length === 0) return bad(tx(lang, 'Votre panier est vide.', 'Your cart is empty.'));
  if (raw.length > 80) return bad(tx(lang, 'Commande trop longue.', 'Order too long.'));
  const lines: CartLine[] = raw.map((l, i) => ({
    key: String(i), productId: String(l.productId), size: l.size === 'l' ? 'l' : 'r', qty: Number(l.qty),
    opts: l.opts && typeof l.opts === 'object' ? Object.fromEntries(Object.entries(l.opts).map(([k, v]) => [k, String(v)])) : undefined,
    side: l.side ? String(l.side) : undefined,
    extras: Array.isArray(l.extras) ? [...new Set(l.extras.map(String))].slice(0, 8) : undefined,
    extraSide: l.extraSide ? String(l.extraSide) : undefined,
    salad: l.salad ? String(l.salad) : undefined,
    day: l.day && isoDateRe.test(String(l.day)) ? String(l.day) : undefined
  }));
  for (const l of lines) {
    const err = validateLine(l, catalog, pm);
    if (err) return bad(err);
  }

  const name = str(body.name, 80);
  const phone = str(body.phone, 30);
  const email = str(body.email, 120);
  const notes = str(body.notes, 800);
  if (name.length < 2) return bad(tx(lang, 'Indiquez votre nom.', 'Please enter your name.'));
  if (phone.replace(/\D/g, '').length < 10) return bad(tx(lang, 'Indiquez un numéro de téléphone valide.', 'Please enter a valid phone number.'));
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad(tx(lang, 'Courriel invalide.', 'Invalid email.'));

  const weekly = lines.some((l) => l.day);
  const time = str(body.pickup_time, 5);
  if (time && !timeRe.test(time)) return bad(tx(lang, 'Heure invalide.', 'Invalid time.'));
  const tooSoon = tx(lang, `Les commandes en ligne se font au moins ${settings.min_hours} h à l'avance. Pour plus tôt, appelez le ${settings.phone}.`, `Online orders need at least ${settings.min_hours} h notice. For sooner, call ${settings.phone}.`);

  let pickupDate: string;
  let weeklyMode: 'once' | 'daily' | null = null;
  if (weekly) {
    const days = [...new Set(lines.map((l) => l.day).filter(Boolean) as string[])].sort();
    lines.forEach((l) => { if (!l.day) l.day = days[0]; });
    for (const d of days) if (!isAllowed(d, null, settings.min_hours)) return bad(tooSoon);
    weeklyMode = body.weekly_mode === 'daily' ? 'daily' : 'once';
    pickupDate = days[0];
    if (weeklyMode === 'once' && time && !isAllowed(pickupDate, time, settings.min_hours)) return bad(tooSoon);
  } else {
    pickupDate = str(body.pickup_date, 10);
    if (!isoDateRe.test(pickupDate)) return bad(tx(lang, 'Choisissez une date de ramassage.', 'Choose a pickup date.'));
    if (!isAllowed(pickupDate, time || null, settings.min_hours)) return bad(tooSoon);
  }

  const subtotal = subtotalOf(lines, catalog);
  let discount = 0;
  let promoCode: string | null = null;
  const code = str(body.promo, 30).toUpperCase();
  if (code) {
    const promo = await store.getPromo(code);
    const firstOrder = (await store.countOrdersByPhone(phone)) === 0;
    const r = applyPromo(promo, lines, catalog, { weekly, firstOrder, today: todayLocal(), lang });
    if (!r.ok) return bad(r.message);
    discount = r.discount;
    promoCode = code;
  }
  const total = round2(Math.max(0, subtotal - discount));

  // Les noms sont figés en français pour le back office ; le client voit sa langue sur la confirmation.
  const snapshot: OrderLineSnapshot[] = lines.map((l) => {
    const unit = unitPrice(l, catalog, pm);
    return { ...l, name: lineTitle(l, catalog, 'fr', pm), details: lineDetails(l, catalog, 'fr', pm), unit, total: round2(unit * l.qty), cat: pm.get(l.productId)!.cat };
  });

  const { number, token } = await store.createOrder({
    source: 'site', customer_name: name, phone, email: email || null, notes: notes || null,
    kind: weekly ? 'weekly' : 'single', pickup_date: pickupDate, pickup_time: time || null,
    weekly_mode: weeklyMode, repeat_weekly: weekly && body.repeat_weekly === true,
    lines: snapshot, subtotal, discount, promo_code: promoCode, total, lang
  });
  if (promoCode) await store.incrementPromo(promoCode);

  const text = [
    `Nouvelle commande n° ${number} (${weekly ? 'à la semaine' : 'simple'})`,
    `Client : ${name} · ${phone}${email ? ' · ' + email : ''}`,
    `Ramassage : ${pickupDate}${time ? ' vers ' + time : ''}${weekly ? ` (${weeklyMode === 'daily' ? 'chaque jour' : 'en une fois'})` : ''}`,
    '',
    ...snapshot.map((l) => `• ${l.qty} × ${l.name}${l.day && weekly ? ` [${l.day}]` : ''} : ${money(l.total)}${l.details.length ? '\n   ' + l.details.join('\n   ') : ''}`),
    '',
    `Sous-total : ${money(subtotal)}${discount ? `\nCode ${promoCode} : −${money(discount)}` : ''}`,
    `Total : ${money(total)}`,
    notes ? `\nRemarques : ${notes}` : ''
  ].join('\n');
  await notify(`Commande n° ${number} – ${name} – ${pickupDate}`, text);

  return NextResponse.json({ number, token });
}
