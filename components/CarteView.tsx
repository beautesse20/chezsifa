'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Catalog } from '@/lib/types';
import { L, LD, tx } from '@/lib/format';
import { useCart } from './Providers';
import { ProductCard } from './ProductCard';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function CarteView({ catalog }: { catalog: Catalog }) {
  const { lang } = useCart();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(catalog.categories[0]?.id);
  const cats = useMemo(() => catalog.categories.filter((c) => catalog.products.some((p) => p.cat === c.id)), [catalog]);

  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setActive(vis.target.id);
    }, { rootMargin: '-160px 0px -60% 0px' });
    cats.forEach((c) => { const el = document.getElementById(c.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [cats]);

  const match = (txt: string) => !q || norm(txt).includes(norm(q));

  return (
    <>
      <section className="wrap" style={{ paddingTop: 52, paddingBottom: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20 }}>
        <div>
          <span className="eyebrow">{tx(lang, 'La carte', 'The menu')}</span>
          <h1 className="h-lg">{tx(lang, 'Tout ce qui sort de nos casseroles', 'Everything from our pots')}</h1>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid var(--line-2)', borderRadius: 999, padding: '6px 18px', minWidth: 280, flex: '0 1 340px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8C7E72" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <span className="sr-only">{tx(lang, 'Chercher un plat', 'Search a dish')}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx(lang, 'Chercher un plat…', 'Search a dish…')} style={{ border: 0, outline: 'none', background: 'transparent', flex: 1, minHeight: 40, fontSize: 15 }} />
        </label>
      </section>

      <nav className="tabs-bar" aria-label={tx(lang, 'Catégories', 'Categories')}>
        <div className="wrap tabs">
          {cats.map((c) => (
            <a key={c.id} href={'#' + c.id} className={'tab' + (active === c.id ? ' on' : '')}>{L(lang, c)}</a>
          ))}
        </div>
      </nav>

      <div className="wrap" style={{ paddingBottom: 90 }}>
        {cats.map((c) => {
          const items = catalog.products.filter((p) => p.cat === c.id && (match(p.fr) || match(p.en) || match(c.fr)));
          if (!items.length) return null;
          return (
            <section key={c.id} id={c.id} style={{ paddingTop: 44, scrollMarginTop: 150 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
                <h2 style={{ fontSize: 32 }}>{L(lang, c)}</h2>
                <p className="muted" style={{ fontSize: 14.5, maxWidth: 560 }}>{LD(lang, c)}</p>
              </div>
              <div className="grid g-auto-270">
                {items.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            </section>
          );
        })}
        {q && !catalog.products.some((p) => match(p.fr) || match(p.en)) ? <p className="muted" style={{ paddingTop: 40 }}>{tx(lang, 'Aucun plat trouvé.', 'No dish found.')}</p> : null}
      </div>
    </>
  );
}
