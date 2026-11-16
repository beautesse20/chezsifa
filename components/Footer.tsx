import Link from 'next/link';
import type { Lang } from '@/lib/types';
import { tx } from '@/lib/format';

export function Footer({ lang, phone }: { lang: Lang; phone: string }) {
  return (
    <>
      <div className="kuba" />
      <footer className="site-footer">
        <div className="wrap foot-grid">
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 800, fontSize: 24, letterSpacing: 3, color: 'var(--ink)' }}>CHEZ SIFA</div>
            <p className="foot-quote">{tx(lang, '« Chaque repas donne l\'impression d\'être chez soi. »', '“Every meal feels like home.”')}</p>
          </div>
          <nav aria-label={tx(lang, 'Commander', 'Order')}>
            <Link href="/carte">{tx(lang, 'La carte', 'Menu')}</Link>
            <Link href="/composer">{tx(lang, 'Composer une assiette', 'Build a plate')}</Link>
            <Link href="/semaine">{tx(lang, 'Ma semaine', 'My week')}</Link>
            <Link href="/carte#cakes">{tx(lang, 'Douceurs', 'Cakes')}</Link>
            <Link href="/carte#sauces">{tx(lang, 'Marché Sifa', 'Sifa Market')}</Link>
          </nav>
          <nav aria-label="Infos">
            <Link href="/comment-ca-marche">{tx(lang, 'Comment ça marche', 'How it works')}</Link>
            <Link href="/traiteur">{tx(lang, 'Traiteur', 'Catering')}</Link>
            <Link href="/traiteur#histoire">{tx(lang, 'Notre histoire', 'Our story')}</Link>
          </nav>
          <div className="col">
            <a href={'tel:+1' + phone.replace(/\D/g, '').slice(-10)} style={{ color: 'var(--ink)', fontWeight: 700 }}>{phone}</a>
            <a href="mailto:chezsifa@gmail.com" style={{ color: 'var(--rust)' }}>chezsifa@gmail.com</a>
            <span>Surrey, {tx(lang, 'Colombie-Britannique', 'British Columbia')}</span>
            <span>{tx(lang, 'Ramassage uniquement · paiement Interac', 'Pickup only · Interac payment')}</span>
          </div>
        </div>
        <div className="wrap copy">© {new Date().getFullYear()} Chez Sifa · {tx(lang, 'Prix en dollars canadiens', 'Prices in Canadian dollars')}</div>
      </footer>
    </>
  );
}
