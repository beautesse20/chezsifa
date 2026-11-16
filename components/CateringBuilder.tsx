'use client';
import { useMemo, useState } from 'react';
import type { Catalog } from '@/lib/types';
import { L, LD, tx } from '@/lib/format';
import { useCart } from './Providers';
import { CATERING_CATS } from '@/lib/catering';

const EVENTS = [
  { fr: 'Mariage', en: 'Wedding' },
  { fr: 'Événement d\'entreprise', en: 'Corporate event' },
  { fr: 'Église & communauté', en: 'Church & community' },
  { fr: 'Anniversaire & fête de famille', en: 'Birthday & family party' },
  { fr: 'Buffet', en: 'Buffet' },
  { fr: 'Dîner privé', en: 'Private dinner' }
];


export function CateringBuilder({ catalog }: { catalog: Catalog }) {
  const { lang } = useCart();
  const cats = useMemo(() => catalog.categories.filter((c) => CATERING_CATS.includes(c.id) && catalog.products.some((p) => p.cat === c.id)), [catalog]);
  const [tab, setTab] = useState(cats[0]?.id);
  const [picked, setPicked] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [type, setType] = useState('');
  const [guests, setGuests] = useState(50);
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [hp, setHp] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [err, setErr] = useState('');

  const byId = useMemo(() => new Map(catalog.products.map((p) => [p.id, p])), [catalog]);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const current = cats.find((c) => c.id === tab);

  const send = async () => {
    setErr('');
    if (!type) return setErr(tx(lang, 'Choisissez le type d\'événement.', 'Choose the event type.'));
    setState('busy');
    const r = await fetch('/api/traiteur', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: type, guests, event_date: date, name, phone, email, details, dishes: picked, custom, lang, website: hp })
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok) setState('done'); else { setErr(j.error || tx(lang, 'Une erreur est survenue.', 'Something went wrong.')); setState('idle'); }
  };

  const dark = { background: 'var(--charcoal-2)', borderColor: 'rgba(251,246,239,.18)', color: 'var(--cream)', colorScheme: 'dark' } as React.CSSProperties;
  const lbl = { color: '#F2E6DA' };

  return (
    <div className="cater" id="menu-traiteur">
      <div className="cater-menu" data-reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
          <div>
            <span className="eyebrow">{tx(lang, 'La carte traiteur', 'Catering menu')}</span>
            <h2 style={{ fontSize: 32 }}>{tx(lang, 'Les mêmes plats, en grande quantité', 'The same dishes, in large quantities')}</h2>
          </div>
          <p style={{ color: '#B9AC9E', fontSize: 14, maxWidth: 360 }}>{tx(lang, 'Touchez un plat pour l\'ajouter à votre devis. Prix selon les quantités, sur devis.', 'Tap a dish to add it to your quote. Priced by quantity, on quote.')}</p>
        </div>
        <div className="tabs" style={{ paddingTop: 0 }} role="tablist">
          {cats.map((c) => {
            const n = picked.filter((id) => byId.get(id)?.cat === c.id).length;
            return (
              <button key={c.id} type="button" role="tab" aria-selected={tab === c.id} className={'tab tab-dark' + (tab === c.id ? ' on' : '')} onClick={() => setTab(c.id)}>
                {L(lang, c)}{n ? <span className="tab-count">{n}</span> : null}
              </button>
            );
          })}
        </div>
        {current ? <p style={{ color: '#B9AC9E', fontSize: 14, margin: '4px 0 14px' }}>{LD(lang, current)}</p> : null}
        <div className="dish-grid">
          {catalog.products.filter((p) => p.cat === tab).map((p) => {
            const on = picked.includes(p.id);
            const variants = (p.opts || []).map((g) => g.choices.map((c) => L(lang, c)).join(' / ')).join(' · ');
            return (
              <button key={p.id} type="button" className={'dish' + (on ? ' on' : '')} aria-pressed={on} onClick={() => toggle(p.id)}>
                <span className="dish-mark" aria-hidden="true">{on ? '✓' : '+'}</span>
                <span>
                  <b>{L(lang, p)}</b>
                  {variants || LD(lang, p) ? <small>{variants || LD(lang, p)}</small> : null}
                </span>
              </button>
            );
          })}
        </div>
        <div className="on-demand">
          <div className="on-demand-icon" aria-hidden="true">✦</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <label htmlFor="custom" style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: 21, color: '#fff', marginBottom: 4 }}>{tx(lang, 'Plats sur demande', 'Dishes on request')}</label>
            <p style={{ color: '#D8CCC1', fontSize: 14, marginBottom: 10 }}>{tx(lang, 'Un plat de chez vous, une recette familiale, un dessert particulier ? Décrivez-le : Chez Sifa vous dit ce qui est possible.', 'A dish from home, a family recipe, a special dessert? Describe it: Chez Sifa will tell you what is possible.')}</p>
            <textarea id="custom" className="textarea" style={dark} rows={3} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={tx(lang, 'Ex. poisson braisé entier, saka-saka au poisson fumé, mini-brochettes pour cocktail…', 'E.g. whole braised fish, saka-saka with smoked fish, cocktail mini skewers…')} />
          </div>
        </div>
      </div>

      <form id="devis" className="cater-form" onSubmit={(e) => { e.preventDefault(); send(); }} data-reveal style={{ ['--d' as string]: '.12s' }}>
        {state === 'done' ? (
          <div style={{ padding: '30px 6px', textAlign: 'center' }}>
            <div className="done-badge" aria-hidden="true">✓</div>
            <h3 style={{ fontSize: 28, color: '#fff', marginBottom: 10 }}>{tx(lang, 'Merci, demande envoyée !', 'Thank you, request sent!')}</h3>
            <p style={{ color: '#D8CCC1' }}>{tx(lang, 'Chez Sifa vous recontacte rapidement pour préparer votre devis.', 'Chez Sifa will get back to you shortly to prepare your quote.')}</p>
          </div>
        ) : (
          <>
            <span className="eyebrow">{tx(lang, 'Devis express', 'Quick quote')}</span>
            <h2 style={{ fontSize: 28, marginBottom: 4 }}>{tx(lang, 'Votre événement', 'Your event')}</h2>
            <div className="picked">
              <b style={{ fontSize: 13, color: 'var(--gold)' }}>{picked.length ? tx(lang, `${picked.length} plat(s) choisi(s)`, `${picked.length} dish(es) selected`) : tx(lang, 'Aucun plat choisi pour l\'instant', 'No dish selected yet')}</b>
              {picked.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {picked.map((id) => <button key={id} type="button" className="picked-chip" onClick={() => toggle(id)} aria-label={tx(lang, 'Retirer ', 'Remove ') + L(lang, byId.get(id))}>{L(lang, byId.get(id))} ×</button>)}
                </div>
              ) : <p style={{ color: '#9C8E82', fontSize: 13, marginTop: 4 }}>{tx(lang, 'Choisissez dans la carte à côté, ou laissez Chez Sifa vous conseiller.', 'Pick from the menu, or let Chez Sifa advise you.')}</p>}
              {custom.trim() ? <p style={{ color: '#F2E6DA', fontSize: 13, marginTop: 8 }}>✦ {tx(lang, 'Plats sur demande ajoutés', 'Dishes on request added')}</p> : null}
            </div>
            <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
              <legend className="lbl" style={lbl}>{tx(lang, 'Type d\'événement', 'Event type')} *</legend>
              <div className="chips" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                {EVENTS.map((e) => {
                  const on = type === e.fr;
                  return <button key={e.fr} type="button" className={'chip' + (on ? ' on' : '')} aria-pressed={on} style={on ? { background: 'rgba(193,80,47,.28)', color: '#fff' } : { background: 'var(--charcoal-2)', color: '#E9DFD6', borderColor: 'rgba(251,246,239,.16)' }} onClick={() => setType(e.fr)}>{lang === 'en' ? e.en : e.fr}</button>;
                })}
              </div>
            </fieldset>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div className="field"><label htmlFor="g" style={lbl}>{tx(lang, 'Invités', 'Guests')}</label><input id="g" type="number" min={5} step={5} className="input" style={dark} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></div>
              <div className="field"><label htmlFor="d" style={lbl}>{tx(lang, 'Date', 'Date')}</label><input id="d" type="date" className="input" style={dark} value={date} onChange={(e) => setDate(e.target.value)} /></div>
            </div>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div className="field"><label htmlFor="qn" style={lbl}>{tx(lang, 'Nom', 'Name')} *</label><input id="qn" className="input" style={dark} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field"><label htmlFor="qp" style={lbl}>{tx(lang, 'Téléphone', 'Phone')} *</label><input id="qp" type="tel" className="input" style={dark} autoComplete="tel" placeholder="778-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
            </div>
            <div className="field"><label htmlFor="qe" style={lbl}>{tx(lang, 'Courriel', 'Email')}</label><input id="qe" type="email" className="input" style={dark} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="field"><label htmlFor="qd" style={lbl}>{tx(lang, 'Autres détails', 'Other details')}</label><textarea id="qd" className="textarea" style={dark} rows={2} placeholder={tx(lang, 'Allergies, heure, lieu, service buffet…', 'Allergies, time, place, buffet service…')} value={details} onChange={(e) => setDetails(e.target.value)} /></div>
            <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
            {err ? <p role="alert" style={{ color: '#FFB8A0', fontWeight: 700 }}>{err}</p> : null}
            <button type="submit" className="btn btn-primary btn-block" disabled={state === 'busy'}>{state === 'busy' ? tx(lang, 'Envoi…', 'Sending…') : tx(lang, 'Envoyer ma demande de devis', 'Send my quote request')}</button>
            <p style={{ color: '#9C8E82', fontSize: 12.5, textAlign: 'center' }}>{tx(lang, 'Chauffe-plats en location · paiement Interac', 'Chafing dish rental · Interac payment')}</p>
          </>
        )}
      </form>
    </div>
  );
}
