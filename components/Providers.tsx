'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { CartLine, Lang } from '@/lib/types';
import { tx } from '@/lib/format';

interface CartCtx {
  lang: Lang;
  lines: CartLine[];
  ready: boolean;
  add: (line: Omit<CartLine, 'key'>, label?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = 'chezsifa-cart-v2';

const sig = (l: Omit<CartLine, 'key' | 'qty'>) =>
  JSON.stringify([l.productId, l.size, l.opts || {}, l.side || '', [...(l.extras || [])].sort(), l.extraSide || '', l.salad || '', l.day || '']);

export function Providers({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); if (Array.isArray(v)) setLines(v); } catch { /* stockage indisponible */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* stockage indisponible */ }
  }, [lines, ready]);

  const add = useCallback((line: Omit<CartLine, 'key'>, label?: string) => {
    setLines((prev) => {
      const s = sig(line);
      const i = prev.findIndex((p) => sig(p) === s);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + line.qty };
        return next;
      }
      return [...prev, { ...line, key: Math.random().toString(36).slice(2, 10) }];
    });
    if (label) {
      setToast(label);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), 3200);
    }
  }, []);
  const setQty = useCallback((key: string, qty: number) => setLines((p) => (qty < 1 ? p.filter((l) => l.key !== key) : p.map((l) => (l.key === key ? { ...l, qty } : l)))), []);
  const remove = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const value = useMemo(() => ({ lang, lines, ready, add, setQty, remove, clear, count }), [lang, lines, ready, add, setQty, remove, clear, count]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <span>{toast}</span>
          <Link href="/panier" onClick={() => setToast(null)}>{tx(lang, 'Voir le panier', 'View cart')}</Link>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside Providers');
  return c;
}
