'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Commandes', k: 'orders' as const },
  { href: '/admin/production', label: 'Production du jour' },
  { href: '/admin/carte', label: 'Carte, prix & photos' },
  { href: '/admin/promos', label: 'Codes promo' },
  { href: '/admin/traiteur', label: 'Demandes traiteur', k: 'catering' as const },
  { href: '/admin/reglages', label: 'Réglages' }
];

export function AdminNav({ counts }: { counts: { orders: number; catering: number } }) {
  const path = usePathname();
  return (
    <>
      {LINKS.map((l) => (
        <Link key={l.href} href={l.href} className={path === l.href ? 'on' : ''}>
          {l.label}
          {l.k && counts[l.k] ? <span className="pill" style={{ marginLeft: 'auto', background: path === l.href ? '#fff' : 'var(--gold)', color: path === l.href ? 'var(--rust)' : 'var(--charcoal)' }}>{counts[l.k]}</span> : null}
        </Link>
      ))}
    </>
  );
}
