import type { Catalog, CateringRequest, Order, OrderStatus, Product, Promo, Settings } from '../types';

export type NewOrder = Omit<Order, 'id' | 'number' | 'token' | 'created_at' | 'status'> & { status?: OrderStatus };
export type NewCatering = Omit<CateringRequest, 'id' | 'created_at' | 'status'>;

export interface Store {
  mode: 'supabase' | 'memory';
  getCatalog(opts?: { includeInactive?: boolean }): Promise<Catalog>;
  updateProduct(id: string, patch: Partial<Pick<Product, 'r' | 'l' | 'active' | 'featured' | 'photo' | 'dfr' | 'den'>>): Promise<void>;
  uploadPhoto(productId: string, file: File): Promise<string>;

  getSettings(): Promise<Settings>;
  updateSettings(patch: Partial<Settings>): Promise<void>;

  listPromos(): Promise<Promo[]>;
  getPromo(code: string): Promise<Promo | null>;
  upsertPromo(p: Promo): Promise<void>;
  deletePromo(code: string): Promise<void>;
  incrementPromo(code: string): Promise<void>;

  createOrder(o: NewOrder): Promise<{ number: number; token: string }>;
  getOrderByToken(token: string): Promise<Order | null>;
  listOrders(filter?: { from?: string; to?: string }): Promise<Order[]>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;
  countOrdersByPhone(phone: string): Promise<number>;

  createCatering(r: NewCatering): Promise<void>;
  listCatering(): Promise<CateringRequest[]>;
  updateCateringStatus(id: string, status: CateringRequest['status']): Promise<void>;
}

export const normalizePhone = (p: string) => p.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
