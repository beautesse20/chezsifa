import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import menu from '@/data/menu.json';
import type { Catalog, Category, CateringRequest, Order, Product, Promo, Settings } from '../types';
import { normalizePhone, type Store } from './types';

let client: SupabaseClient | null = null;
function db() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return client;
}

function check<T>(r: { data: T; error: { message: string } | null }): T {
  if (r.error) throw new Error(r.error.message);
  return r.data;
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string, cat: row.cat as string, fr: row.fr as string, en: row.en as string,
    dfr: (row.dfr as string) || undefined, den: (row.den as string) || undefined,
    sizes: row.sizes as Product['sizes'], r: Number(row.r), l: num(row.l),
    lfr: (row.lfr as string) || undefined, len: (row.len as string) || undefined,
    side: !!row.side, opts: (row.opts as Product['opts']) || undefined,
    featured: !!row.featured, active: row.active !== false, photo: (row.photo as string) || null, sort: Number(row.sort || 0)
  };
}

function toPromo(row: Record<string, unknown>): Promo {
  return {
    code: row.code as string, type: row.type as Promo['type'], value: Number(row.value), scope: row.scope as Promo['scope'],
    category: (row.category as string) || null, min_total: num(row.min_total), max_uses: num(row.max_uses),
    uses: Number(row.uses || 0), starts_on: (row.starts_on as string) || null, ends_on: (row.ends_on as string) || null,
    active: !!row.active, created_at: row.created_at as string
  };
}

function toOrder(row: Record<string, unknown>): Order {
  return { ...(row as unknown as Order), subtotal: Number(row.subtotal), discount: Number(row.discount), total: Number(row.total) };
}

export const supabaseStore: Store = {
  mode: 'supabase',
  async getCatalog(opts) {
    const [cats, prods] = await Promise.all([
      db().from('categories').select('*').order('sort'),
      (opts?.includeInactive ? db().from('products').select('*') : db().from('products').select('*').eq('active', true)).order('sort')
    ]);
    return {
      categories: check(cats) as Category[],
      products: (check(prods) as Record<string, unknown>[]).map(toProduct),
      includedSides: menu.includedSides
    } as Catalog;
  },
  async updateProduct(id, patch) { check(await db().from('products').update(patch).eq('id', id)); },
  async uploadPhoto(productId, file) {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    const path = `${productId}-${Date.now()}.${ext}`;
    const up = await db().storage.from('photos').upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true });
    if (up.error) throw new Error(up.error.message);
    const url = db().storage.from('photos').getPublicUrl(path).data.publicUrl;
    await this.updateProduct(productId, { photo: url });
    return url;
  },
  async getSettings() {
    const row = check(await db().from('settings').select('*').eq('id', 1).maybeSingle()) as Record<string, unknown> | null;
    return {
      min_hours: Number(row?.min_hours ?? 48), interac_email: (row?.interac_email as string) || 'chezsifa@gmail.com',
      phone: (row?.phone as string) || '778-723-7919', banner_fr: (row?.banner_fr as string) || '', banner_en: (row?.banner_en as string) || ''
    } as Settings;
  },
  async updateSettings(patch) { check(await db().from('settings').upsert({ id: 1, ...patch })); },
  async listPromos() { return (check(await db().from('promos').select('*').order('created_at', { ascending: false })) as Record<string, unknown>[]).map(toPromo); },
  async getPromo(code) {
    const row = check(await db().from('promos').select('*').eq('code', code.toUpperCase()).maybeSingle()) as Record<string, unknown> | null;
    return row ? toPromo(row) : null;
  },
  async upsertPromo(p) {
    const { created_at, ...rest } = p;
    void created_at;
    check(await db().from('promos').upsert(rest));
  },
  async deletePromo(code) { check(await db().from('promos').delete().eq('code', code)); },
  async incrementPromo(code) { check(await db().rpc('increment_promo', { p_code: code })); },
  async createOrder(o) {
    const row = check(await db().from('orders').insert({ ...o, phone_norm: normalizePhone(o.phone) }).select('number, token').single()) as { number: number; token: string };
    return row;
  },
  async getOrderByToken(token) {
    if (!/^[0-9a-f-]{36}$/i.test(token)) return null;
    const row = check(await db().from('orders').select('*').eq('token', token).maybeSingle()) as Record<string, unknown> | null;
    return row ? toOrder(row) : null;
  },
  async listOrders(f) {
    let q = db().from('orders').select('*').order('pickup_date', { ascending: true }).order('number', { ascending: false }).limit(500);
    if (f?.from) q = q.gte('pickup_date', f.from);
    if (f?.to) q = q.lte('pickup_date', f.to);
    return (check(await q) as Record<string, unknown>[]).map(toOrder);
  },
  async updateOrderStatus(id, status) { check(await db().from('orders').update({ status }).eq('id', id)); },
  async countOrdersByPhone(phone) {
    const r = await db().from('orders').select('id', { count: 'exact', head: true }).eq('phone_norm', normalizePhone(phone)).neq('status', 'annulee');
    if (r.error) throw new Error(r.error.message);
    return r.count || 0;
  },
  async createCatering(r) { check(await db().from('catering_requests').insert(r)); },
  async listCatering() { return check(await db().from('catering_requests').select('*').order('created_at', { ascending: false }).limit(300)) as CateringRequest[]; },
  async updateCateringStatus(id, status) { check(await db().from('catering_requests').update({ status }).eq('id', id)); }
};
