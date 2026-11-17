'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CartLine } from '@/lib/types';
import { tx } from '@/lib/format';
import { useCart } from './Providers';

export const LAST_KEY = 'chezsifa-last-order';

/** Barre fixe en bas de l'écran sur mobile quand le panier n'est pas vide. */
export function MobileCartBar() {
  const { lang, count, ready } = useCart();
  const path = usePathname();
  if (!ready || count === 0 || path.startsWith('/panier') || path.startsWith('/commande') || path.startsWith('/traiteur')) return null;
  return (
    <Link href="/panier" className="m-cartbar">
      <span><b>{count}</b> {tx(lang, count > 1 ? 'articles dans votre panier' : 'article dans votre panier', count > 1 ? 'items in your cart' : 'item in your cart')}</span>
      <strong>{tx(lang, 'Commander →', 'Checkout →')}</strong>
    </Link>
  );
}

/** Propose de reprendre la dernière commande passée sur cet appareil. */
export function ReorderBanner() {
  const { lang, add, count } = useCart();
  const [last, setLast] = useState<{ lines: Omit<CartLine, 'key'>[]; date: string } | null>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(LAST_KEY) || 'null'); if (v?.lines?.length) setLast(v); } catch { /* stockage indisponible */ }
  }, []);
  if (!last || count > 0) return done ? <div className="reorder"><div className="wrap reorder-in"><span>{tx(lang, 'C\'est dans votre panier.', 'It\'s in your cart.')}</span><Link href="/panier" className="btn btn-primary btn-sm">{tx(lang, 'Choisir la date', 'Choose the date')}</Link></div></div> : null;
  const n = last.lines.reduce((s, l) => s + l.qty, 0);
  return (
    <div className="reorder">
      <div className="wrap reorder-in">
        <span><b>{tx(lang, 'Bon retour !', 'Welcome back!')}</b> {tx(lang, `Reprendre votre dernière commande (${n} article${n > 1 ? 's' : ''}) ?`, `Order the same as last time (${n} item${n > 1 ? 's' : ''})?`)}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { last.lines.forEach((l) => add(l)); setDone(true); }}>{tx(lang, 'Reprendre', 'Reorder')}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { try { localStorage.removeItem(LAST_KEY); } catch { /* */ } setLast(null); }}>{tx(lang, 'Non merci', 'No thanks')}</button>
        </div>
      </div>
    </div>
  );
}

/** Recharge la page de suivi toutes les 45 s tant que la commande n'est pas terminée. */
export function AutoRefresh({ active }: { active: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') router.refresh(); }, 45000);
    return () => clearInterval(t);
  }, [active, router]);
  return null;
}
