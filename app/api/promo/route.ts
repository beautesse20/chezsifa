import { NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { applyPromo, validateLine } from '@/lib/pricing';
import { todayLocal } from '@/lib/dates';
import type { CartLine, Lang } from '@/lib/types';

export const dynamic = 'force-dynamic';

/** Vérifie un code promo pour le panier en cours (aperçu ; le serveur recalcule à la commande). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const lang: Lang = body.lang === 'en' ? 'en' : 'fr';
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase().slice(0, 30) : '';
  const lines: CartLine[] = Array.isArray(body.lines) ? body.lines.slice(0, 80) : [];
  const store = getStore();
  const catalog = await store.getCatalog();
  const valid = lines.filter((l) => !validateLine(l, catalog));
  const phone = typeof body.phone === 'string' ? body.phone : '';
  const firstOrder = phone.replace(/\D/g, '').length >= 10 ? (await store.countOrdersByPhone(phone)) === 0 : true;
  const promo = code ? await store.getPromo(code) : null;
  const r = applyPromo(promo, valid, catalog, { weekly: valid.some((l) => l.day), firstOrder, today: todayLocal(), lang });
  return NextResponse.json({ ...r, code: r.ok ? code : null, needsPhone: promo?.scope === 'first' });
}
