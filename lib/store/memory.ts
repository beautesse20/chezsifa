import menu from '@/data/menu.json';
import type { Catalog, CateringRequest, Order, Product, Promo, Settings } from '../types';
import { normalizePhone, type Store } from './types';

/** Données en mémoire pour le développement local et la démo, sans Supabase. */
interface Mem {
  products: Product[];
  settings: Settings;
  promos: Promo[];
  orders: Order[];
  catering: CateringRequest[];
  seq: number;
}

const g = globalThis as unknown as { __chezsifaMem?: Mem };

function init(): Mem {
  return {
    products: (menu.products as Product[]).map((p, i) => ({ ...p, active: true, featured: !!p.featured, photo: null, sort: i })),
    settings: { min_hours: 48, interac_email: 'chezsifa@gmail.com', phone: '778-723-7919', banner_fr: '', banner_en: '' },
    promos: [
      { code: 'MASEMAINE', type: 'percent', value: 10, scope: 'weekly', uses: 0, active: true, created_at: new Date().toISOString() },
      { code: 'BIENVENUE', type: 'fixed', value: 5, scope: 'first', min_total: 40, uses: 0, active: true, created_at: new Date().toISOString() }
    ],
    orders: [],
    catering: [],
    seq: 1000
  };
}

const mem = () => (g.__chezsifaMem ??= init());

export const memoryStore: Store = {
  mode: 'memory',
  async getCatalog(opts) {
    const m = mem();
    const products = m.products.filter((p) => opts?.includeInactive || p.active !== false).map((p) => ({ ...p }));
    return { categories: [...menu.categories].sort((a, b) => a.sort - b.sort), products, includedSides: menu.includedSides } as Catalog;
  },
  async updateProduct(id, patch) {
    const p = mem().products.find((x) => x.id === id);
    if (p) Object.assign(p, patch);
  },
  async uploadPhoto(productId, file) {
    const buf = Buffer.from(await file.arrayBuffer());
    const url = `data:${file.type || 'image/jpeg'};base64,${buf.toString('base64')}`;
    await this.updateProduct(productId, { photo: url });
    return url;
  },
  async getSettings() { return { ...mem().settings }; },
  async updateSettings(patch) { Object.assign(mem().settings, patch); },
  async listPromos() { return mem().promos.map((p) => ({ ...p })); },
  async getPromo(code) { const p = mem().promos.find((x) => x.code === code.toUpperCase()); return p ? { ...p } : null; },
  async upsertPromo(p) {
    const m = mem();
    const i = m.promos.findIndex((x) => x.code === p.code);
    if (i >= 0) m.promos[i] = { ...m.promos[i], ...p }; else m.promos.unshift({ ...p, created_at: new Date().toISOString() });
  },
  async deletePromo(code) { const m = mem(); m.promos = m.promos.filter((x) => x.code !== code); },
  async incrementPromo(code) { const p = mem().promos.find((x) => x.code === code); if (p) p.uses += 1; },
  async createOrder(o) {
    const m = mem();
    m.seq += 1;
    const order: Order = { ...o, id: crypto.randomUUID(), token: crypto.randomUUID(), number: m.seq, created_at: new Date().toISOString(), status: o.status || 'nouvelle' };
    m.orders.unshift(order);
    return { number: order.number, token: order.token };
  },
  async getOrderByToken(token) { return mem().orders.find((o) => o.token === token) || null; },
  async listOrders(f) {
    return mem().orders.filter((o) => (!f?.from || o.pickup_date >= f.from) && (!f?.to || o.pickup_date <= f.to));
  },
  async updateOrderStatus(id, status) { const o = mem().orders.find((x) => x.id === id); if (o) o.status = status; },
  async countOrdersByPhone(phone) {
    const n = normalizePhone(phone);
    return mem().orders.filter((o) => normalizePhone(o.phone) === n && o.status !== 'annulee').length;
  },
  async createCatering(r) {
    mem().catering.unshift({ ...r, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: 'nouvelle' });
  },
  async listCatering() { return [...mem().catering]; },
  async updateCateringStatus(id, status) { const r = mem().catering.find((x) => x.id === id); if (r) r.status = status; }
};
