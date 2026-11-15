export type Lang = 'fr' | 'en';
export type Size = 'r' | 'l';
export type SizeMode = 'rl' | 'single' | 'pack' | 'ml';

export interface Choice { id: string; fr: string; en: string }
export interface OptionGroup { key: string; fr: string; en: string; choices: Choice[] }

export interface Category {
  id: string; fr: string; en: string; dfr?: string; den?: string;
  composable: boolean; sort: number;
}

export interface Product {
  id: string; cat: string; fr: string; en: string; dfr?: string; den?: string;
  sizes: SizeMode; r: number; l?: number | null; lfr?: string; len?: string;
  side?: boolean; opts?: OptionGroup[];
  featured?: boolean; active?: boolean; photo?: string | null; sort?: number;
}

export interface Catalog {
  categories: Category[];
  products: Product[];
  includedSides: Choice[];
}

/** Une ligne de panier. `day` (AAAA-MM-JJ) n'existe que pour la commande à la semaine. */
export interface CartLine {
  key: string;
  productId: string;
  size: Size;
  qty: number;
  opts?: Record<string, string>;
  side?: string;
  extras?: string[];
  extraSide?: string;
  salad?: string;
  day?: string;
}

export type PromoType = 'percent' | 'fixed';
export type PromoScope = 'all' | 'weekly' | 'category' | 'first';

export interface Promo {
  code: string; type: PromoType; value: number; scope: PromoScope;
  category?: string | null; min_total?: number | null; max_uses?: number | null;
  uses: number; starts_on?: string | null; ends_on?: string | null; active: boolean;
  created_at?: string;
}

export type OrderStatus = 'nouvelle' | 'confirmee' | 'payee' | 'preparation' | 'prete' | 'recuperee' | 'annulee';
export const ORDER_STATUSES: OrderStatus[] = ['nouvelle', 'confirmee', 'payee', 'preparation', 'prete', 'recuperee', 'annulee'];

export interface OrderLineSnapshot extends CartLine {
  name: string; details: string[]; unit: number; total: number; cat: string;
}

export interface Order {
  id: string; number: number; token: string; created_at: string;
  status: OrderStatus; source: 'site' | 'telephone';
  customer_name: string; phone: string; email?: string | null; notes?: string | null;
  kind: 'single' | 'weekly'; pickup_date: string; pickup_time?: string | null;
  weekly_mode?: 'once' | 'daily' | null; repeat_weekly?: boolean;
  lines: OrderLineSnapshot[]; subtotal: number; discount: number; promo_code?: string | null; total: number;
  lang: Lang;
}

export interface CateringRequest {
  id: string; created_at: string; event_type: string; guests: number; event_date?: string | null;
  name: string; phone: string; email?: string | null; details?: string | null; status: 'nouvelle' | 'contactee' | 'devis_envoye' | 'confirmee' | 'refusee';
}

export interface Settings {
  min_hours: number;
  interac_email: string;
  phone: string;
  banner_fr?: string;
  banner_en?: string;
}
