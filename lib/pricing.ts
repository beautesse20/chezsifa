import type { CartLine, Catalog, Lang, Product, Promo } from './types';
import { L, money, round2, tx } from './format';

export const PACK_SIZE = 5;
export const PACK_TIER_PIECES = 50;
export const MAX_PACKS = 20;
export const MAX_QTY = 50;

export function productMap(c: Catalog) {
  const m = new Map<string, Product>();
  c.products.forEach((p) => m.set(p.id, p));
  return m;
}

export function basePrice(p: Product, size: 'r' | 'l', qty: number) {
  if (p.sizes === 'single') return p.r;
  if (p.sizes === 'pack') return qty * PACK_SIZE > PACK_TIER_PIECES ? (p.l ?? p.r) : p.r;
  return size === 'l' ? (p.l ?? p.r) : p.r;
}

/** Prix unitaire d'une ligne (plat + suppléments). Lance une erreur si la ligne est invalide. */
export function unitPrice(line: Omit<CartLine, 'key'>, c: Catalog, pm = productMap(c)) {
  const p = pm.get(line.productId);
  if (!p) throw new Error('unknown product ' + line.productId);
  let u = basePrice(p, line.size, line.qty);
  for (const x of line.extras || []) {
    const e = pm.get(x);
    if (!e || e.cat !== 'extras') throw new Error('bad extra');
    u += e.r;
  }
  if (line.extraSide) {
    const s = pm.get(line.extraSide);
    if (!s || s.cat !== 'sides') throw new Error('bad side');
    u += s.r;
  }
  if (line.salad) {
    const s = pm.get(line.salad);
    if (!s || s.cat !== 'salads') throw new Error('bad salad');
    u += s.r;
  }
  return round2(u);
}

export function sizeLabel(p: Product, size: 'r' | 'l', lang: Lang) {
  if (p.sizes === 'ml') return size === 'l' ? '500 ml' : '250 ml';
  if (p.sizes === 'rl') return size === 'l' ? 'Large' : 'Regular';
  return '';
}

export function lineTitle(line: CartLine, c: Catalog, lang: Lang, pm = productMap(c)) {
  const p = pm.get(line.productId);
  if (!p) return '?';
  let t = L(lang, p);
  if (p.side) t += tx(lang, ' + 1 accompagnement', ' + 1 side');
  const s = sizeLabel(p, line.size, lang);
  if (s) t += ' · ' + s;
  return t;
}

export function lineDetails(line: CartLine, c: Catalog, lang: Lang, pm = productMap(c)) {
  const p = pm.get(line.productId);
  const out: string[] = [];
  if (!p) return out;
  if (p.sizes === 'pack') {
    const pieces = line.qty * PACK_SIZE;
    out.push(`${pieces} ${tx(lang, 'pièces', 'pieces')} · ${money(basePrice(p, 'r', line.qty), lang)} ${tx(lang, 'le lot de 5', 'per pack of 5')}${pieces > PACK_TIER_PIECES ? tx(lang, ' (tarif 51–100 pcs)', ' (51–100 pcs rate)') : ''}`);
  }
  for (const g of p.opts || []) {
    const ch = g.choices.find((x) => x.id === line.opts?.[g.key]);
    if (ch) out.push(`${L(lang, g)} : ${L(lang, ch)}`);
  }
  if (p.side && line.side) {
    const s = c.includedSides.find((x) => x.id === line.side);
    if (s) out.push(tx(lang, 'Accompagnement : ', 'Side: ') + L(lang, s));
  }
  for (const x of line.extras || []) {
    const e = pm.get(x);
    if (e) out.push(`+ ${L(lang, e)} (${money(e.r, lang)})`);
  }
  if (line.extraSide) { const s = pm.get(line.extraSide); if (s) out.push(`+ ${L(lang, s)} Regular (${money(s.r, lang)})`); }
  if (line.salad) { const s = pm.get(line.salad); if (s) out.push(`+ ${L(lang, s)} Regular (${money(s.r, lang)})`); }
  if (p.id === 'fufu' && line.size === 'l' && p.lfr) out.push(tx(lang, 'Prix Large 7–8 $, confirmé par Chez Sifa', 'Large price $7–8, confirmed by Chez Sifa'));
  return out;
}

/** Contrôle complet d'une ligne venant du navigateur. Retourne un message d'erreur ou null. */
export function validateLine(line: CartLine, c: Catalog, pm = productMap(c)): string | null {
  const p = pm.get(line.productId);
  if (!p || p.active === false) return 'Produit indisponible : ' + line.productId;
  if (!Number.isInteger(line.qty) || line.qty < 1) return 'Quantité invalide';
  if (p.sizes === 'pack' ? line.qty > MAX_PACKS : line.qty > MAX_QTY) return 'Quantité trop élevée';
  if (line.size !== 'r' && line.size !== 'l') return 'Format invalide';
  if ((p.sizes === 'single' || p.sizes === 'pack') && line.size !== 'r') return 'Format invalide';
  for (const g of p.opts || []) {
    if (!g.choices.some((x) => x.id === line.opts?.[g.key])) return 'Choix manquant : ' + g.fr;
  }
  if (p.side) {
    if (!c.includedSides.some((x) => x.id === line.side)) return 'Accompagnement manquant';
  } else if (line.side) return 'Accompagnement non prévu';
  try { unitPrice(line, c, pm); } catch { return 'Supplément invalide'; }
  return null;
}

export interface Totals { subtotal: number; discount: number; total: number; promoMessage?: string; promoOk?: boolean }

export function subtotalOf(lines: CartLine[], c: Catalog) {
  const pm = productMap(c);
  return round2(lines.reduce((s, l) => s + unitPrice(l, c, pm) * l.qty, 0));
}

/** Calcule la remise d'un code promo. `firstOrder` est fourni par le serveur. */
export function applyPromo(
  promo: Promo | null, lines: CartLine[], c: Catalog,
  ctx: { weekly: boolean; firstOrder: boolean; today: string; lang: Lang }
): { discount: number; ok: boolean; message: string } {
  const { lang } = ctx;
  if (!promo) return { discount: 0, ok: false, message: tx(lang, 'Code inconnu', 'Unknown code') };
  if (!promo.active) return { discount: 0, ok: false, message: tx(lang, 'Ce code n\'est plus actif', 'This code is no longer active') };
  if (promo.starts_on && ctx.today < promo.starts_on) return { discount: 0, ok: false, message: tx(lang, 'Ce code n\'est pas encore valable', 'This code is not valid yet') };
  if (promo.ends_on && ctx.today > promo.ends_on) return { discount: 0, ok: false, message: tx(lang, 'Ce code a expiré', 'This code has expired') };
  if (promo.max_uses != null && promo.uses >= promo.max_uses) return { discount: 0, ok: false, message: tx(lang, 'Ce code a atteint sa limite', 'This code has reached its limit') };
  const pm = productMap(c);
  const sub = subtotalOf(lines, c);
  if (promo.min_total && sub < promo.min_total) return { discount: 0, ok: false, message: tx(lang, `Minimum de commande : ${money(promo.min_total, lang)}`, `Minimum order: ${money(promo.min_total, lang)}`) };
  let base = sub;
  if (promo.scope === 'weekly' && !ctx.weekly) return { discount: 0, ok: false, message: tx(lang, 'Code réservé aux commandes à la semaine', 'Code for weekly orders only') };
  if (promo.scope === 'first' && !ctx.firstOrder) return { discount: 0, ok: false, message: tx(lang, 'Code réservé à la première commande', 'Code for first orders only') };
  if (promo.scope === 'category') {
    base = round2(lines.filter((l) => pm.get(l.productId)?.cat === promo.category).reduce((s, l) => s + unitPrice(l, c, pm) * l.qty, 0));
    if (base <= 0) return { discount: 0, ok: false, message: tx(lang, 'Aucun article concerné par ce code', 'No item in your order qualifies') };
  }
  const discount = promo.type === 'percent' ? round2((base * promo.value) / 100) : round2(Math.min(promo.value, base));
  const label = promo.type === 'percent' ? `−${promo.value} %` : `−${money(promo.value, lang)}`;
  return { discount, ok: true, message: tx(lang, `Code appliqué : ${label}`, `Code applied: ${label}`) };
}
