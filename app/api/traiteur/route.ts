import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { isoDateRe } from '@/lib/dates';
import { notify } from '@/lib/notify';

export const dynamic = 'force-dynamic';
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (str(b.website, 50)) return NextResponse.json({ error: 'Requête refusée' }, { status: 400 });
  const en = b.lang === 'en';
  const event_type = str(b.event_type, 60);
  const name = str(b.name, 80);
  const phone = str(b.phone, 30);
  const email = str(b.email, 120);
  const extra = str(b.details, 1500);
  const custom = str(b.custom, 1500);
  const catalog = await getStore().getCatalog();
  const names = new Map(catalog.products.map((p) => [p.id, p.fr]));
  const dishes = Array.isArray(b.dishes) ? [...new Set((b.dishes as unknown[]).map(String))].filter((id) => names.has(id)).slice(0, 60).map((id) => names.get(id)!) : [];
  const details = [
    dishes.length ? `Plats choisis : ${dishes.join(', ')}` : '',
    custom ? `Plats sur demande : ${custom}` : '',
    extra ? `Détails : ${extra}` : ''
  ].filter(Boolean).join('\n');
  const guests = Math.max(1, Math.min(2000, Number(b.guests) || 0));
  const event_date = isoDateRe.test(str(b.event_date, 10)) ? str(b.event_date, 10) : null;
  if (!event_type || name.length < 2 || phone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: en ? 'Please fill in the event type, your name and phone.' : 'Indiquez le type d\'événement, votre nom et votre téléphone.' }, { status: 400 });
  }
  await getStore().createCatering({ event_type, guests, event_date, name, phone, email: email || null, details: details || null });
  await notify(`Demande traiteur – ${event_type} – ${guests} invités`, `Type : ${event_type}\nInvités : ${guests}\nDate : ${event_date || 'à déterminer'}\nNom : ${name}\nTéléphone : ${phone}\nCourriel : ${email || '-'}\n\n${details || ''}`);
  return NextResponse.json({ ok: true });
}
