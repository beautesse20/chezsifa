'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { currentAdmin, signIn, signOut } from '@/lib/auth';
import { getStore } from '@/lib/store';
import { isoDateRe, timeRe } from '@/lib/dates';
import { round2 } from '@/lib/format';
import { ORDER_STATUSES, type CateringRequest, type OrderStatus, type Promo } from '@/lib/types';

async function guard() {
  const who = await currentAdmin();
  if (!who) redirect('/admin/login');
  return who;
}
const s = (f: FormData, k: string, max = 200) => String(f.get(k) ?? '').trim().slice(0, max);
const n = (f: FormData, k: string) => { const v = s(f, k).replace(',', '.').replace(/[^\d.]/g, ''); return v === '' ? null : Number(v); };

export async function loginAction(_: unknown, f: FormData) {
  const err = await signIn(s(f, 'email', 120), String(f.get('password') || ''));
  if (err) return { error: err };
  redirect('/admin');
}

export async function logoutAction() {
  await signOut();
  redirect('/admin/login');
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  await guard();
  if (!ORDER_STATUSES.includes(status)) return;
  await getStore().updateOrderStatus(id, status);
  revalidatePath('/admin', 'layout');
}

export async function phoneOrderAction(_: unknown, f: FormData) {
  await guard();
  const name = s(f, 'name', 80), phone = s(f, 'phone', 30), date = s(f, 'date', 10), time = s(f, 'time', 5), what = s(f, 'what', 1500);
  const total = n(f, 'total') ?? 0;
  if (name.length < 2 || phone.replace(/\D/g, '').length < 10 || !isoDateRe.test(date) || !what) return { error: 'Nom, téléphone, date et contenu sont obligatoires.' };
  if (time && !timeRe.test(time)) return { error: 'Heure invalide.' };
  const { number } = await getStore().createOrder({
    source: 'telephone', status: 'confirmee', customer_name: name, phone, email: null, notes: what,
    kind: 'single', pickup_date: date, pickup_time: time || null, weekly_mode: null, repeat_weekly: false,
    lines: [], subtotal: round2(total), discount: 0, promo_code: null, total: round2(total), lang: 'fr'
  });
  revalidatePath('/admin', 'layout');
  return { ok: `Commande téléphone n° ${number} enregistrée.` };
}

export async function updateProductAction(f: FormData) {
  await guard();
  const id = s(f, 'id', 40);
  const r = n(f, 'r'); const l = n(f, 'l');
  const patch: Record<string, unknown> = { active: f.get('active') === 'on', featured: f.get('featured') === 'on' };
  if (r !== null && r > 0) patch.r = round2(r);
  if (f.has('l')) patch.l = l !== null && l > 0 ? round2(l) : null;
  if (f.has('dfr')) patch.dfr = s(f, 'dfr', 300) || null;
  await getStore().updateProduct(id, patch);
  revalidatePath('/', 'layout');
}

export async function uploadPhotoAction(f: FormData) {
  await guard();
  const id = s(f, 'id', 40);
  const file = f.get('photo');
  if (!(file instanceof File) || file.size === 0) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) return;
  await getStore().uploadPhoto(id, file);
  revalidatePath('/', 'layout');
}

export async function removePhotoAction(f: FormData) {
  await guard();
  await getStore().updateProduct(s(f, 'id', 40), { photo: null });
  revalidatePath('/', 'layout');
}

export async function savePromoAction(_: unknown, f: FormData) {
  await guard();
  const code = s(f, 'code', 30).toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const type = s(f, 'type') === 'fixed' ? 'fixed' : 'percent';
  const value = n(f, 'value');
  const scope = (['all', 'weekly', 'category', 'first'].includes(s(f, 'scope')) ? s(f, 'scope') : 'all') as Promo['scope'];
  if (code.length < 3) return { error: 'Le code doit faire au moins 3 caractères (lettres et chiffres).' };
  if (!value || value <= 0 || (type === 'percent' && value > 100)) return { error: 'Valeur invalide.' };
  const starts = s(f, 'starts_on', 10), ends = s(f, 'ends_on', 10);
  const existing = await getStore().getPromo(code);
  await getStore().upsertPromo({
    code, type, value, scope, category: scope === 'category' ? s(f, 'category', 40) || null : null,
    min_total: n(f, 'min_total'), max_uses: n(f, 'max_uses'), uses: existing?.uses ?? 0,
    starts_on: isoDateRe.test(starts) ? starts : null, ends_on: isoDateRe.test(ends) ? ends : null, active: true
  });
  revalidatePath('/admin/promos');
  return { ok: `Code ${code} enregistré.` };
}

export async function togglePromoAction(f: FormData) {
  await guard();
  const p = await getStore().getPromo(s(f, 'code', 30));
  if (p) await getStore().upsertPromo({ ...p, active: !p.active });
  revalidatePath('/admin/promos');
}

export async function deletePromoAction(f: FormData) {
  await guard();
  await getStore().deletePromo(s(f, 'code', 30));
  revalidatePath('/admin/promos');
}

export async function setCateringStatus(id: string, status: CateringRequest['status']) {
  await guard();
  await getStore().updateCateringStatus(id, status);
  revalidatePath('/admin', 'layout');
}

export async function saveSettingsAction(_: unknown, f: FormData) {
  await guard();
  const h = n(f, 'min_hours');
  if (!h || h < 0 || h > 336) return { error: 'Délai invalide.' };
  await getStore().updateSettings({
    min_hours: Math.round(h), interac_email: s(f, 'interac_email', 120), phone: s(f, 'phone', 30),
    banner_fr: s(f, 'banner_fr', 200), banner_en: s(f, 'banner_en', 200)
  });
  revalidatePath('/', 'layout');
  return { ok: 'Réglages enregistrés.' };
}
