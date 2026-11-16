'use client';
import { useMemo, useState } from 'react';
import type { Catalog, CartLine, Size } from '@/lib/types';
import { L, money, tx } from '@/lib/format';
import { productMap, unitPrice, MAX_QTY } from '@/lib/pricing';
import { useCart } from './Providers';

interface State {
  cat: string | null; dish: string | null; size: Size; opts: Record<string, string>;
  side: string | null; extras: string[]; extraSide: string; salad: string; qty: number;
}

export function Composer({ catalog, initialDish, onAdd, footnote }: {
  catalog: Catalog; initialDish?: string; onAdd?: (l: Omit<CartLine, 'key'>) => void; footnote?: string;
}) {
  const { lang, add } = useCart();
  const pm = useMemo(() => productMap(catalog), [catalog]);
  const cats = catalog.categories.filter((c) => c.composable && catalog.products.some((p) => p.cat === c.id));
  const init = initialDish && pm.get(initialDish);
  const [s, set] = useState<State>({ cat: init ? init.cat : null, dish: init ? init.id : null, size: 'r', opts: {}, side: null, extras: [], extraSide: '', salad: '', qty: 1 });
  const up = (patch: Partial<State>) => set((o) => ({ ...o, ...patch }));

  const dish = s.dish ? pm.get(s.dish) : undefined;
  const kids = dish?.cat === 'kids';
  const extras = catalog.products.filter((p) => p.cat === 'extras');
  const sides = catalog.products.filter((p) => p.cat === 'sides');
  const salads = catalog.products.filter((p) => p.cat === 'salads');
  const minOf = (cat: string) => Math.min(...catalog.products.filter((p) => p.cat === cat).map((p) => p.r));

  const line: Omit<CartLine, 'key'> | null = dish ? {
    productId: dish.id, size: dish.sizes === 'single' ? 'r' : s.size, qty: s.qty,
    opts: dish.opts?.length ? s.opts : undefined, side: dish.side ? s.side || undefined : undefined,
    extras: !kids && s.extras.length ? [...s.extras].sort() : undefined,
    extraSide: !kids && s.extraSide ? s.extraSide : undefined, salad: !kids && s.salad ? s.salad : undefined
  } : null;
  const valid = !!dish && (dish.opts || []).every((g) => !!s.opts[g.key]) && (!dish.side || !!s.side);
  const unit = line ? unitPrice(line, catalog, pm) : 0;

  const doAdd = () => {
    if (!line || !valid) return;
    if (onAdd) onAdd(line); else add(line, tx(lang, 'Assiette ajoutée au panier', 'Plate added to cart'));
    set({ cat: s.cat, dish: null, size: 'r', opts: {}, side: null, extras: [], extraSide: '', salad: '', qty: 1 });
  };

  let n = 0;
  const next = () => ++n;

  return (
    <div className="composer">
      <div className="composer-steps">
        <Step lang={lang} num={next()} done={!!s.cat} title={tx(lang, 'Choisissez votre formule', 'Choose your formula')}>
          <div className="chips">
            {cats.map((c) => (
              <button key={c.id} type="button" className={'chip' + (s.cat === c.id ? ' on' : '')} aria-pressed={s.cat === c.id}
                onClick={() => s.cat !== c.id && up({ cat: c.id, dish: null, opts: {}, side: null })}>
                {L(lang, c)}<small>{tx(lang, 'dès ', 'from ')}{money(minOf(c.id), lang)}{c.id === 'grill' ? tx(lang, ' · accompagnement inclus', ' · side included') : ''}</small>
              </button>
            ))}
          </div>
        </Step>

        {s.cat && (
          <Step lang={lang} num={next()} done={!!dish} title={tx(lang, 'Votre plat', 'Your dish')}>
            <div className="chips chips-wide">
              {catalog.products.filter((p) => p.cat === s.cat).map((p) => (
                <button key={p.id} type="button" className={'chip' + (s.dish === p.id ? ' on' : '')} aria-pressed={s.dish === p.id}
                  onClick={() => s.dish !== p.id && up({ dish: p.id, opts: {}, side: null })}>
                  {L(lang, p)}{p.side ? tx(lang, ' + 1 accompagnement', ' + 1 side') : ''}
                  <span className="price">{p.sizes === 'single' ? money(p.r, lang) : `R ${money(p.r, lang)} · L ${money(p.l ?? p.r, lang)}`}</span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {dish && dish.sizes === 'rl' && (
          <Step lang={lang} num={next()} done title={tx(lang, 'Format', 'Size')}>
            <div className="chips chips-2">
              {(['r', 'l'] as Size[]).map((z) => (
                <button key={z} type="button" className={'chip' + (s.size === z ? ' on' : '')} aria-pressed={s.size === z} onClick={() => up({ size: z })}>
                  {z === 'l' ? 'Large' : 'Regular'}<span className="price">{money(z === 'l' ? dish.l ?? dish.r : dish.r, lang)}</span>
                </button>
              ))}
            </div>
          </Step>
        )}

        {dish && (dish.side || dish.opts?.length) ? (
          <Step lang={lang} num={next()} done={valid} title={dish.side && !dish.opts?.length ? tx(lang, 'Votre accompagnement', 'Your side') : tx(lang, 'Vos choix', 'Your choices')}>
            {(dish.opts || []).map((g) => (
              <div key={g.key}>
                <p className="opt-title">{L(lang, g)}</p>
                <div className="chips">
                  {g.choices.map((c) => (
                    <button key={c.id} type="button" className={'chip' + (s.opts[g.key] === c.id ? ' on' : '')} aria-pressed={s.opts[g.key] === c.id}
                      onClick={() => up({ opts: { ...s.opts, [g.key]: c.id } })}>{L(lang, c)}</button>
                  ))}
                </div>
              </div>
            ))}
            {dish.side && (
              <>
                <p className="opt-title">{tx(lang, 'Accompagnement inclus', 'Included side')}</p>
                <div className="chips">
                  {catalog.includedSides.map((c) => (
                    <button key={c.id} type="button" className={'chip' + (s.side === c.id ? ' on' : '')} aria-pressed={s.side === c.id} onClick={() => up({ side: c.id })}>{L(lang, c)}</button>
                  ))}
                </div>
              </>
            )}
          </Step>
        ) : null}

        {dish && !kids && (
          <Step lang={lang} num={next()} done={s.extras.length > 0 || !!s.extraSide || !!s.salad} title={tx(lang, 'Suppléments', 'Extras')} optional>
            <p className="opt-title">{tx(lang, 'Protéine en plus', 'Extra protein')}</p>
            <div className="chips">
              {extras.map((x) => {
                const on = s.extras.includes(x.id);
                return (
                  <button key={x.id} type="button" className={'chip' + (on ? ' on' : '')} aria-pressed={on}
                    onClick={() => up({ extras: on ? s.extras.filter((e) => e !== x.id) : [...s.extras, x.id] })}>
                    {L(lang, x)}<span className="price">+{money(x.r, lang)}</span>
                  </button>
                );
              })}
            </div>
            <div className="form-grid" style={{ marginTop: 6 }}>
              <div className="field">
                <label htmlFor="xside">{tx(lang, '2e accompagnement (Regular)', 'Extra side (Regular)')}</label>
                <select id="xside" className="select" value={s.extraSide} onChange={(e) => up({ extraSide: e.target.value })}>
                  <option value="">{tx(lang, 'Aucun', 'None')}</option>
                  {sides.map((x) => <option key={x.id} value={x.id}>{L(lang, x)} (+{money(x.r, lang)})</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="xsalad">{tx(lang, 'Salade (Regular)', 'Salad (Regular)')}</label>
                <select id="xsalad" className="select" value={s.salad} onChange={(e) => up({ salad: e.target.value })}>
                  <option value="">{tx(lang, 'Aucune', 'None')}</option>
                  {salads.map((x) => <option key={x.id} value={x.id}>{L(lang, x)} (+{money(x.r, lang)})</option>)}
                </select>
              </div>
            </div>
          </Step>
        )}

        {dish && (
          <Step lang={lang} num={next()} done title={tx(lang, 'Nombre d\'assiettes', 'Number of plates')}>
            <div className="qty" style={{ fontSize: 18 }}>
              <button type="button" aria-label={tx(lang, 'Moins', 'Less')} onClick={() => up({ qty: Math.max(1, s.qty - 1) })}>−</button>
              <output aria-live="polite" style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{s.qty}</output>
              <button type="button" aria-label={tx(lang, 'Plus', 'More')} onClick={() => up({ qty: Math.min(MAX_QTY, s.qty + 1) })}>+</button>
            </div>
          </Step>
        )}
      </div>

      <aside className="summary" aria-live="polite">
        <div className="top">
          <span className="eyebrow eyebrow-gold" style={{ marginBottom: 0 }}>{tx(lang, 'Votre assiette', 'Your plate')}</span>
          <h3>{dish ? L(lang, dish) : tx(lang, 'À composer', 'To build')}</h3>
          {!dish ? (
            <p style={{ color: 'var(--muted)', fontSize: 14, paddingBottom: 18 }}>{s.cat ? tx(lang, 'Choisissez votre plat.', 'Choose your dish.') : tx(lang, 'Commencez par choisir une formule.', 'Start by choosing a formula.')}</p>
          ) : (
            <ul className="sum-list">
              <li><span>{L(lang, dish)}{dish.sizes === 'rl' ? ` (${s.size === 'l' ? 'Large' : 'Regular'})` : ''}</span><span>{money(dish.sizes === 'single' ? dish.r : s.size === 'l' ? dish.l ?? dish.r : dish.r, lang)}</span></li>
              {(dish.opts || []).map((g) => { const c = g.choices.find((x) => x.id === s.opts[g.key]); return c ? <li key={g.key}><span>{L(lang, c)}</span><span /></li> : null; })}
              {dish.side && s.side ? <li><span>{L(lang, catalog.includedSides.find((x) => x.id === s.side))}</span><span style={{ color: 'var(--muted)' }}>{tx(lang, 'inclus', 'included')}</span></li> : null}
              {!kids && s.extras.map((x) => { const e = pm.get(x)!; return <li key={x}><span>+ {L(lang, e)}</span><span>{money(e.r, lang)}</span></li>; })}
              {!kids && s.extraSide ? <li><span>+ {L(lang, pm.get(s.extraSide))}</span><span>{money(pm.get(s.extraSide)!.r, lang)}</span></li> : null}
              {!kids && s.salad ? <li><span>+ {L(lang, pm.get(s.salad))}</span><span>{money(pm.get(s.salad)!.r, lang)}</span></li> : null}
              {s.qty > 1 ? <li><span>{tx(lang, 'Assiettes', 'Plates')}</span><span>× {s.qty}</span></li> : null}
            </ul>
          )}
        </div>
        <div className="bottom">
          <div className="total-row"><span>TOTAL</span><strong>{money(unit * s.qty, lang)}</strong></div>
          <button type="button" className="btn btn-primary btn-block" disabled={!valid} onClick={doAdd}>{onAdd ? tx(lang, 'Ajouter à ce jour', 'Add to this day') : tx(lang, 'Ajouter au panier', 'Add to cart')}</button>
          <p className="hint">{valid ? (footnote || tx(lang, 'Ramassage à partir de 48 h · paiement Interac', 'Pickup from 48 h · Interac payment')) : tx(lang, 'Faites un choix à chaque étape pour ajouter votre assiette.', 'Make a choice at each step to add your plate.')}</p>
        </div>
      </aside>
    </div>
  );
}

function Step({ num, done, title, optional, lang, children }: { num: number; done: boolean; title: string; optional?: boolean; lang: 'fr' | 'en'; children: React.ReactNode }) {
  return (
    <section className="card pad">
      <h2 className="step-title"><span className={'step-num' + (done ? ' done' : '')} aria-hidden="true">{done ? '✓' : num}</span>{title}{optional ? <small>{lang === 'en' ? 'optional' : 'optionnel'}</small> : null}</h2>
      {children}
    </section>
  );
}
