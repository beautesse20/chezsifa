'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './Providers';
import { tx } from '@/lib/format';

export function LangButton() {
  const { lang } = useCart();
  const router = useRouter();
  return (
    <button
      type="button" className="lang-btn"
      aria-label={lang === 'en' ? 'Passer en français' : 'Switch to English'}
      onClick={() => { document.cookie = `lang=${lang === 'en' ? 'fr' : 'en'};path=/;max-age=31536000;samesite=lax`; router.refresh(); }}
    >{lang === 'en' ? 'FR' : 'EN'}</button>
  );
}

export function Header({ phone }: { phone: string }) {
  const { lang, count, ready } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const cartRef = useRef<HTMLAnchorElement>(null);
  const prev = useRef(count);
  useEffect(() => {
    if (ready && count > prev.current && cartRef.current) {
      const el = cartRef.current;
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    }
    prev.current = count;
  }, [count, ready]);
  const traiteur = path.startsWith('/traiteur');
  const links = traiteur
    ? [
        { href: '/traiteur#histoire', fr: 'Notre histoire', en: 'Our story' },
        { href: '/traiteur#concept', fr: 'Le concept', en: 'The concept' },
        { href: '/traiteur#menu-traiteur', fr: 'La carte traiteur', en: 'Catering menu' },
        { href: '/traiteur#devis', fr: 'Devis', en: 'Quote' },
        { href: '/traiteur#contact', fr: 'Contact', en: 'Contact' }
      ]
    : [
        { href: '/carte', fr: 'La carte', en: 'Menu' },
        { href: '/composer', fr: 'Composer une assiette', en: 'Build a plate' },
        { href: '/semaine', fr: 'Ma semaine', en: 'My week' },
        { href: '/comment-ca-marche', fr: 'Comment ça marche', en: 'How it works' }
      ];
  const tel = 'tel:+1' + phone.replace(/\D/g, '').slice(-10);
  return (
    <>
      {!traiteur && (
        <div className="infobar">
          <div className="wrap">
            <span>{tx(lang, 'Commandes en ligne : prêtes en 48 h', 'Online orders: ready in 48 h')}</span>
            <span>{tx(lang, 'Besoin en 24 h ? Appelez-nous au ', 'Need it within 24 h? Call us at ')}<a href={tel}>{phone}</a></span>
          </div>
        </div>
      )}
      <header className="site-header">
        <div className="wrap">
          <Link href={traiteur ? '/traiteur' : '/'} className="brand" onClick={() => setOpen(false)}>
            <b>CHEZ SIFA</b>
            <small>{traiteur ? tx(lang, 'TRAITEUR', 'CATERING') : tx(lang, 'GRILLADES AU CHARBON', 'CHARCOAL GRILL')}</small>
          </Link>
          <nav className="nav" aria-label={tx(lang, 'Navigation principale', 'Main navigation')}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={path === l.href ? 'on' : ''}>{lang === 'en' ? l.en : l.fr}</Link>
            ))}
          </nav>
          <div className="head-actions">
            <div className="space-switch desk">
              <Link href="/" className={traiteur ? '' : 'on'}>{tx(lang, 'Particuliers', 'Order')}</Link>
              <Link href="/traiteur" className={traiteur ? 'on' : ''}>{tx(lang, 'Traiteur', 'Catering')}</Link>
            </div>
            <LangButton />
            {!traiteur && (
              <Link href="/panier" ref={cartRef} className="cart-btn" aria-label={tx(lang, `Panier, ${count} article(s)`, `Cart, ${count} item(s)`)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
                <span className="label">{tx(lang, 'Panier', 'Cart')}</span>
                <span className={'cart-count' + (count === 0 ? ' zero' : '')}>{ready ? count : 0}</span>
              </Link>
            )}
            <button type="button" className="burger" aria-label={tx(lang, 'Menu', 'Menu')} aria-expanded={open} onClick={() => setOpen(!open)}>
              <span /><span /><span />
            </button>
          </div>
        </div>
        <nav className={'mobile-nav' + (open ? ' open' : '')} aria-label="Menu mobile">
          {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{lang === 'en' ? l.en : l.fr}</Link>)}
          <Link href={traiteur ? '/' : '/traiteur'} onClick={() => setOpen(false)}>{traiteur ? tx(lang, '→ Commander pour moi (particuliers)', '→ Order for myself') : tx(lang, '→ Espace traiteur', '→ Catering')}</Link>
        </nav>
      </header>
    </>
  );
}
