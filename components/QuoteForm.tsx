'use client';
import { useState } from 'react';
import { useCart } from './Providers';
import { tx } from '@/lib/format';

export const EVENTS = [
  { fr: 'Mariage', en: 'Wedding' },
  { fr: 'Événement d\'entreprise', en: 'Corporate event' },
  { fr: 'Église & communauté', en: 'Church & community' },
  { fr: 'Anniversaire & fête de famille', en: 'Birthday & family party' },
  { fr: 'Buffet', en: 'Buffet' },
  { fr: 'Dîner privé', en: 'Private dinner' }
];

export function QuoteForm() {
  const { lang } = useCart();
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

  const send = async () => {
    setErr('');
    setState('busy');
    const r = await fetch('/api/traiteur', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event_type: type, guests, event_date: date, name, phone, email, details, lang, website: hp }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok) setState('done'); else { setErr(j.error || tx(lang, 'Une erreur est survenue.', 'Something went wrong.')); setState('idle'); }
  };

  if (state === 'done') {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h3 style={{ fontSize: 28, color: '#fff', marginBottom: 10 }}>{tx(lang, 'Merci, demande envoyée !', 'Thank you, request sent!')}</h3>
        <p style={{ color: '#D8CCC1' }}>{tx(lang, 'Chez Sifa vous recontacte rapidement pour préparer votre devis.', 'Chez Sifa will get back to you shortly to prepare your quote.')}</p>
      </div>
    );
  }

  const dark = { background: 'var(--charcoal-2)', borderColor: 'rgba(251,246,239,.18)', color: 'var(--cream)', colorScheme: 'dark' } as React.CSSProperties;
  return (
    <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 34 }}>
      <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
        <legend className="lbl" style={{ color: '#F2E6DA' }}>1. {tx(lang, 'Type d\'événement', 'Event type')}</legend>
        <div className="chips" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
          {EVENTS.map((e) => {
            const v = lang === 'en' ? e.en : e.fr;
            const on = type === e.fr;
            return <button key={e.fr} type="button" className={'chip' + (on ? ' on' : '')} aria-pressed={on} style={on ? { background: 'rgba(193,80,47,.25)', color: '#fff' } : { background: 'var(--charcoal-2)', color: '#E9DFD6', borderColor: 'rgba(251,246,239,.16)' }} onClick={() => setType(e.fr)}>{v}</button>;
          })}
        </div>
      </fieldset>
      <div className="form-grid">
        <div className="field"><label htmlFor="g" style={{ color: '#F2E6DA' }}>2. {tx(lang, 'Nombre d\'invités', 'Number of guests')}</label><input id="g" type="number" min={5} step={5} className="input" style={dark} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></div>
        <div className="field"><label htmlFor="d" style={{ color: '#F2E6DA' }}>3. {tx(lang, 'Date souhaitée', 'Preferred date')}</label><input id="d" type="date" className="input" style={dark} value={date} onChange={(e) => setDate(e.target.value)} /></div>
      </div>
      <div className="form-grid">
        <div className="field"><label htmlFor="qn" style={{ color: '#F2E6DA' }}>{tx(lang, 'Nom', 'Name')} *</label><input id="qn" className="input" style={dark} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div className="field"><label htmlFor="qp" style={{ color: '#F2E6DA' }}>{tx(lang, 'Téléphone', 'Phone')} *</label><input id="qp" type="tel" className="input" style={dark} autoComplete="tel" placeholder="778-123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div className="field"><label htmlFor="qe" style={{ color: '#F2E6DA' }}>{tx(lang, 'Courriel', 'Email')}</label><input id="qe" type="email" className="input" style={dark} autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      </div>
      <div className="field"><label htmlFor="qd" style={{ color: '#F2E6DA' }}>4. {tx(lang, 'Détails', 'Details')}</label><textarea id="qd" className="textarea" style={dark} rows={3} placeholder={tx(lang, 'Allergies, thème, heure, lieu, préférences de menu…', 'Allergies, theme, time, place, menu preferences…')} value={details} onChange={(e) => setDetails(e.target.value)} /></div>
      <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
      {err ? <p role="alert" style={{ color: '#FFB8A0', fontWeight: 700 }}>{err}</p> : null}
      <button type="submit" className="btn btn-primary btn-block" disabled={state === 'busy'}>{state === 'busy' ? tx(lang, 'Envoi…', 'Sending…') : tx(lang, 'Envoyer ma demande', 'Send my request')}</button>
    </form>
  );
}
