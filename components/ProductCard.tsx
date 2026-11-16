'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { CartLine, Product, Size } from '@/lib/types';
import { L, LD, money, tx } from '@/lib/format';
import { basePrice, MAX_PACKS, MAX_QTY, PACK_SIZE } from '@/lib/pricing';
import { useCart } from './Providers';
import { Photo } from './Photo';

export function needsComposer(p: Product) {
  return !!(p.side || (p.opts && p.opts.length));
}

export function ProductCard({ p, onAdd, onCompose }: { p: Product; onAdd?: (l: Omit<CartLine, 'key'>) => void; onCompose?: (p: Product) => void }) {
  const { lang, add } = useCart();
  const [size, setSize] = useState<Size>('r');
  const [qty, setQty] = useState(1);
  const name = L(lang, p);
  const pack = p.sizes === 'pack';
  const max = pack ? MAX_PACKS : MAX_QTY;
  const unit = basePrice(p, size, qty);
  const lLabel = lang === 'en' ? p.len : p.lfr;

  const doAdd = () => {
    const line = { productId: p.id, size, qty };
    if (onAdd) onAdd(line); else add(line, tx(lang, `${name} ajouté`, `${name} added`));
    setQty(1);
  };

  return (
    <article className="card product" data-reveal>
      <Photo src={p.photo} alt={name} cat={p.cat} />
      {p.featured ? <span className="badge badge-gold" style={{ position: 'absolute', margin: 12 }}>{tx(lang, 'Coup de cœur', 'Favourite')}</span> : null}
      <div className="body">
        <div>
          <h3>{name}{p.side ? <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}> {tx(lang, '+ 1 accompagnement', '+ 1 side')}</span> : null}</h3>
          {LD(lang, p) ? <p className="desc">{LD(lang, p)}</p> : null}
        </div>
        <div className="sizes">
          {p.sizes === 'rl' || p.sizes === 'ml' ? (
            (['r', 'l'] as Size[]).map((s) => (
              <button key={s} type="button" className={'size' + (size === s ? ' on' : '')} aria-pressed={size === s} onClick={() => setSize(s)}>
                <small>{p.sizes === 'ml' ? (s === 'l' ? '500 ml' : '250 ml') : s === 'l' ? 'Large' : 'Regular'}</small>
                <strong>{s === 'l' && lLabel ? lLabel : money(s === 'l' ? p.l ?? p.r : p.r, lang)}</strong>
              </button>
            ))
          ) : pack ? (
            <>
              <div className={'size static' + (qty * PACK_SIZE <= 50 ? ' on' : '')}><small>{tx(lang, 'lot de 5 · 5–50 pcs', 'pack of 5 · 5–50 pcs')}</small><strong>{money(p.r, lang)}</strong></div>
              <div className={'size static' + (qty * PACK_SIZE > 50 ? ' on' : '')}><small>{tx(lang, 'lot de 5 · 51–100 pcs', 'pack of 5 · 51–100 pcs')}</small><strong>{money(p.l ?? p.r, lang)}</strong></div>
            </>
          ) : (
            <div className="size static"><small>{p.cat === 'cakes' ? tx(lang, 'gâteau entier · 6–8 portions', 'whole cake · 6–8 servings') : tx(lang, 'prix', 'price')}</small><strong>{money(p.r, lang)}</strong></div>
          )}
        </div>
        {needsComposer(p) ? (
          onCompose
            ? <button type="button" className="btn btn-primary btn-block" onClick={() => onCompose(p)}>{tx(lang, 'Choisir et ajouter', 'Choose & add')}</button>
            : <Link href={`/composer?plat=${p.id}`} className="btn btn-primary btn-block">{p.side ? tx(lang, 'Choisir l\'accompagnement', 'Choose your side') : tx(lang, 'Choisir la préparation', 'Choose the style')}</Link>
        ) : (
          <div className="add-row">
            <div className="qty">
              <button type="button" aria-label={tx(lang, 'Moins', 'Less')} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <output aria-live="polite">{pack ? `${qty * PACK_SIZE}` : qty}</output>
              <button type="button" aria-label={tx(lang, 'Plus', 'More')} onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
            </div>
            <button type="button" className="btn btn-primary" onClick={doAdd}>{tx(lang, 'Ajouter', 'Add')} · {money(unit * qty, lang)}</button>
          </div>
        )}
      </div>
    </article>
  );
}
