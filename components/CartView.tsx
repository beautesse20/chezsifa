'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { Catalog } from '@/lib/types';
import { longDate, money, round2, shortDate, tx } from '@/lib/format';
import { lineDetails, lineTitle, productMap, unitPrice, MAX_PACKS, MAX_QTY, PACK_SIZE } from '@/lib/pricing';
import { useCart } from './Providers';
import { LAST_KEY } from './Extras';

const MONTHS_AHEAD = 2;

function Calendar({ value, onChange, today, first, lang }: { value: string; onChange: (d: string) => void; today: string; first: string; lang: 'fr' | 'en' }) {
  const [month, setMonth] = useState(first.slice(0, 7));
  const [y, m] = month.split('-').map(Number);
  const firstDay = `${month}-01`;
  const startDow = (new Date(firstDay + 'T12:00:00Z').getUTCDay() + 6) % 7;
  const daysIn = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const maxMonth = (() => { const d = new Date(Date.UTC(Number(today.slice(0, 4)), Number(today.slice(5, 7)) - 1 + MONTHS_AHEAD, 1)); return d.toISOString().slice(0, 7); })();
  const shift = (n: number) => { const d = new Date(Date.UTC(y, m - 1 + n, 1)); setMonth(d.toISOString().slice(0, 7)); };
  const title = new Date(firstDay + 'T12:00:00Z').toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const dows = lang === 'en' ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'] : ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <div>
      <div className="cal-head">
        <button type="button" aria-label={tx(lang, 'Mois précédent', 'Previous month')} disabled={month <= today.slice(0, 7)} onClick={() => shift(-1)}>‹</button>
        <strong style={{ fontFamily: 'var(--serif)', fontSize: 19, textTransform: 'capitalize' }}>{title}</strong>
        <button type="button" aria-label={tx(lang, 'Mois suivant', 'Next month')} disabled={month >= maxMonth} onClick={() => shift(1)}>›</button>
      </div>
      <div className="cal" role="grid">
        {dows.map((d, i) => <span key={i} className="dow">{d}</span>)}
        {Array.from({ length: startDow }, (_, i) => <span key={'b' + i} />)}
        {Array.from({ length: daysIn }, (_, i) => {
          const d = `${month}-${String(i + 1).padStart(2, '0')}`;
          if (d < today) return <span key={d} className="day past">{i + 1}</span>;
          if (d < first) return <span key={d} className="day call" title={tx(lang, 'Moins de 48 h : par téléphone', 'Less than 48 h: by phone')}>{i + 1}</span>;
          return <button key={d} type="button" className={'day' + (value === d ? ' on' : '')} aria-pressed={value === d} aria-label={longDate(d, lang)} onClick={() => onChange(d)}>{i + 1}</button>;
        })}
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--rust)' }} />{tx(lang, 'Votre date', 'Your date')}</span>
        <span><i className="day call" style={{ height: 14 }} />{tx(lang, 'Moins de 48 h : par téléphone', 'Less than 48 h: by phone')}</span>
      </div>
    </div>
  );
}

export function CartView({ catalog, today, first, phone, minHours }: { catalog: Catalog; today: string; first: string; phone: string; minHours: number }) {
  const { lang, lines, ready, setQty, remove, clear } = useCart();
  const router = useRouter();
  const pm = useMemo(() => productMap(catalog), [catalog]);
  const valid = lines.filter((l) => pm.has(l.productId));
  const weekly = valid.some((l) => l.day);
  const days = [...new Set(valid.filter((l) => l.day).map((l) => l.day!))].sort();
  const stale = days.filter((d) => d < first);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'once' | 'daily'>('once');
  const [repeat, setRepeat] = useState(false);
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [hp, setHp] = useState('');
  const [agree, setAgree] = useState(false);
  const [code, setCode] = useState('');
  const [promo, setPromo] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [promoErr, setPromoErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const cost = (l: (typeof valid)[number]) => { try { return unitPrice(l, catalog, pm) * l.qty; } catch { return 0; } };
  const subtotal = round2(valid.reduce((s, l) => s + cost(l), 0));
  const discount = promo ? Math.min(promo.discount, subtotal) : 0;
  const total = round2(subtotal - discount);
  const telHref = 'tel:+1' + phone.replace(/\D/g, '').slice(-10);
  const pickupDate = weekly ? days[0] || '' : date;

  const checkPromo = async (c = code) => {
    setPromoErr('');
    if (!c.trim()) { setPromo(null); return; }
    const r = await fetch('/api/promo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c, lines: valid, phone: tel, lang }) }).then((x) => x.json()).catch(() => null);
    if (r?.ok) setPromo({ code: r.code, discount: r.discount, message: r.message });
    else { setPromo(null); setPromoErr(r?.message || tx(lang, 'Code invalide', 'Invalid code')); }
  };

  const submit = async () => {
    setErr('');
    if (!weekly && !date) return setErr(tx(lang, 'Choisissez une date de ramassage.', 'Choose a pickup date.'));
    if (stale.length) return setErr(tx(lang, 'Certains jours sont à moins de 48 h : retirez-les ou appelez-nous.', 'Some days are less than 48 h away: remove them or call us.'));
    if (name.trim().length < 2) return setErr(tx(lang, 'Indiquez votre nom.', 'Please enter your name.'));
    if (tel.replace(/\D/g, '').length < 10) return setErr(tx(lang, 'Indiquez un numéro de téléphone valide.', 'Please enter a valid phone number.'));
    if (!agree) return setErr(tx(lang, 'Cochez la case de confirmation.', 'Please tick the confirmation box.'));
    setBusy(true);
    try {
      const r = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: valid, name, phone: tel, email, notes, pickup_date: date, pickup_time: time, weekly_mode: mode, repeat_weekly: repeat, promo: promo?.code || '', lang, website: hp })
      });
      const j = await r.json();
      if (!r.ok) { setErr(j.error || tx(lang, 'Une erreur est survenue.', 'Something went wrong.')); setBusy(false); return; }
      try { localStorage.setItem(LAST_KEY, JSON.stringify({ date: new Date().toISOString(), lines: valid.map(({ key, day, ...rest }) => { void key; void day; return rest; }) })); } catch { /* */ }
      clear();
      router.push(`/commande/${j.token}`);
    } catch {
      setErr(tx(lang, 'Connexion impossible. Réessayez.', 'Connection failed. Please try again.'));
      setBusy(false);
    }
  };

  if (!ready) return <div className="wrap section" />;
  if (!valid.length) {
    return (
      <section className="wrap section center">
        <h1 className="h-lg">{tx(lang, 'Votre panier est vide', 'Your cart is empty')}</h1>
        <p className="lead">{tx(lang, 'Composez une assiette, planifiez votre semaine ou parcourez la carte.', 'Build a plate, plan your week or browse the menu.')}</p>
        <div className="btn-row" style={{ justifyContent: 'center', marginTop: 26 }}>
          <Link href="/composer" className="btn btn-primary">{tx(lang, 'Composer une assiette', 'Build a plate')}</Link>
          <Link href="/semaine" className="btn btn-outline">{tx(lang, 'Ma semaine', 'My week')}</Link>
          <Link href="/carte" className="btn btn-outline">{tx(lang, 'La carte', 'Menu')}</Link>
        </div>
      </section>
    );
  }

  const LineRow = ({ l }: { l: (typeof valid)[number] }) => {
    const p = pm.get(l.productId)!;
    const pack = p.sizes === 'pack';
    return (
      <div className="cart-line">
        <div className="top"><strong style={{ fontSize: 15 }}>{lineTitle(l, catalog, lang, pm)}</strong><strong>{money(cost(l), lang)}</strong></div>
        <ul>{lineDetails(l, catalog, lang, pm).map((d, i) => <li key={i}>{d}</li>)}</ul>
        <div className="ctrl">
          <div className="qty">
            <button type="button" aria-label={tx(lang, 'Moins', 'Less')} onClick={() => { setQty(l.key, l.qty - 1); setPromo(null); }}>−</button>
            <output>{pack ? `${l.qty * PACK_SIZE} pcs` : l.qty}</output>
            <button type="button" aria-label={tx(lang, 'Plus', 'More')} onClick={() => { setQty(l.key, Math.min(pack ? MAX_PACKS : MAX_QTY, l.qty + 1)); setPromo(null); }}>+</button>
          </div>
          <button type="button" className="link-btn" onClick={() => { remove(l.key); setPromo(null); }}>{tx(lang, 'Retirer', 'Remove')}</button>
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="wrap" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <span className="eyebrow">{weekly ? tx(lang, 'Commande à la semaine', 'Weekly order') : tx(lang, 'Panier', 'Cart')}</span>
        <h1 className="h-lg">{tx(lang, 'Votre commande', 'Your order')}</h1>
      </section>
      <section className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 26, alignItems: 'flex-start', paddingBottom: 96 }}>
        <div style={{ flex: '999 1 600px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card pad">
            {weekly ? (
              <>
                <h2 style={{ fontSize: 24, marginBottom: 6 }}>{tx(lang, 'Comment récupérez-vous votre semaine ?', 'How will you pick up your week?')}</h2>
                <p className="muted" style={{ marginBottom: 16 }}>{tx(lang, `Jours planifiés : ${days.map((d) => shortDate(d, lang)).join(', ')}`, `Planned days: ${days.map((d) => shortDate(d, lang)).join(', ')}`)}</p>
                <div className="chips chips-wide">
                  <button type="button" className={'chip' + (mode === 'once' ? ' on' : '')} aria-pressed={mode === 'once'} onClick={() => setMode('once')}>{tx(lang, 'Un seul ramassage', 'One pickup')}<small>{days[0] ? longDate(days[0], lang) : ''} · {tx(lang, 'tous les plats, à réchauffer', 'all dishes, to reheat')}</small></button>
                  <button type="button" className={'chip' + (mode === 'daily' ? ' on' : '')} aria-pressed={mode === 'daily'} onClick={() => setMode('daily')}>{tx(lang, 'Chaque jour', 'Every day')}<small>{tx(lang, 'Un ramassage par jour planifié', 'One pickup per planned day')}</small></button>
                </div>
                <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 16, background: 'var(--sand)', borderRadius: 14, padding: '14px 16px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} style={{ width: 20, height: 20, marginTop: 2 }} />
                  <span><strong>{tx(lang, 'Répéter chaque semaine', 'Repeat every week')}</strong><br /><span className="muted" style={{ fontSize: 13.5 }}>{tx(lang, 'Chez Sifa vous recontacte avant chaque semaine pour confirmer ou modifier.', 'Chez Sifa contacts you before each week to confirm or change it.')}</span></span>
                </label>
                {stale.length ? <p className="error" style={{ marginTop: 12 }}>{tx(lang, 'Certains jours sont maintenant à moins de 48 h. Retirez-les dans « Ma semaine » ou appelez-nous.', 'Some days are now less than 48 h away. Remove them in “My week” or call us.')}</p> : null}
              </>
            ) : (
              <>
                <h2 style={{ fontSize: 24, marginBottom: 6 }}>{tx(lang, 'Quand récupérez-vous votre commande ?', 'When will you pick up your order?')}</h2>
                <p className="muted" style={{ marginBottom: 18 }}>{tx(lang, `Les dates disponibles commencent ${minHours} h après votre commande.`, `Available dates start ${minHours} h after you order.`)}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  <div style={{ flex: '1 1 320px', minWidth: 0 }}><Calendar value={date} onChange={setDate} today={today} first={first} lang={lang} /></div>
                  <div style={{ flex: '1 1 230px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="field"><label htmlFor="time">{tx(lang, 'Heure souhaitée (facultatif)', 'Preferred time (optional)')}</label><input id="time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></div>
                    <div className="note">{tx(lang, 'Ramassage uniquement, pas de livraison. L\'adresse vous est envoyée avec la confirmation.', 'Pickup only, no delivery. The address is sent with the confirmation.')}</div>
                    <div className="note note-dark"><span>{tx(lang, 'Besoin pour demain ? Appelez le ', 'Need it tomorrow? Call ')}<a href={telHref} style={{ whiteSpace: 'nowrap' }}>{phone}</a></span></div>
                  </div>
                </div>
              </>
            )}
            {weekly && mode === 'once' ? <div className="field" style={{ marginTop: 16, maxWidth: 260 }}><label htmlFor="time">{tx(lang, 'Heure souhaitée (facultatif)', 'Preferred time (optional)')}</label><input id="time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} /></div> : null}
          </div>

          <div className="card pad">
            <h2 style={{ fontSize: 24, marginBottom: 16 }}>{tx(lang, 'Vos coordonnées', 'Your details')}</h2>
            <div className="form-grid">
              <div className="field"><label htmlFor="n">{tx(lang, 'Nom complet', 'Full name')} *</label><input id="n" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className="field"><label htmlFor="t">{tx(lang, 'Téléphone', 'Phone')} *</label><input id="t" type="tel" className="input" autoComplete="tel" placeholder="604-555-0142" value={tel} onChange={(e) => setTel(e.target.value)} /></div>
              <div className="field"><label htmlFor="e">{tx(lang, 'Courriel', 'Email')}</label><input id="e" type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="field"><label htmlFor="r">{tx(lang, 'Remarques', 'Notes')}</label><input id="r" className="input" placeholder={tx(lang, 'Allergies, niveau de piment…', 'Allergies, spice level…')} value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            </div>
            <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
            <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 18, fontSize: 14, cursor: 'pointer' }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: 20, height: 20, marginTop: 1 }} />
              <span className="muted">{tx(lang, 'Je comprends que Chez Sifa confirme ma commande et le montant exact, puis que je paie par virement Interac avant la préparation.', 'I understand that Chez Sifa confirms my order and the exact amount, then I pay by Interac e-Transfer before it is prepared.')}</span>
            </label>
          </div>
        </div>

        <aside className="card" style={{ flex: '1 1 340px', maxWidth: 440, overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 6px' }}>
            <h2 style={{ fontSize: 22 }}>{tx(lang, 'Panier', 'Cart')} · {valid.reduce((s, l) => s + l.qty, 0)}</h2>
            {weekly ? days.map((d) => (
              <div key={d} className="day-group"><h4>{longDate(d, lang)}</h4>{valid.filter((l) => l.day === d).map((l) => <LineRow key={l.key} l={l} />)}</div>
            )) : null}
            {weekly && valid.some((l) => !l.day) ? <div className="day-group"><h4>{tx(lang, 'Avec le premier jour', 'With the first day')}</h4>{valid.filter((l) => !l.day).map((l) => <LineRow key={l.key} l={l} />)}</div> : null}
            {!weekly ? valid.map((l) => <LineRow key={l.key} l={l} />) : null}
          </div>
          <div style={{ padding: '6px 24px 20px' }}>
            <label htmlFor="promo" className="lbl">{tx(lang, 'Code promo', 'Promo code')}</label>
            <div className="promo-row">
              <input id="promo" className={'input' + (promo ? ' good' : '')} value={code} onChange={(e) => { setCode(e.target.value.toUpperCase()); setPromo(null); setPromoErr(''); }} onKeyDown={(e) => { if (e.key === 'Enter') checkPromo(); }} />
              <button type="button" className="btn btn-dark btn-sm" onClick={() => checkPromo()}>{tx(lang, 'Appliquer', 'Apply')}</button>
            </div>
            {promo ? <p className="ok" style={{ marginTop: 8 }}>✓ {promo.message}</p> : promoErr ? <p className="error" style={{ marginTop: 8 }}>{promoErr}</p> : null}
          </div>
          <div style={{ padding: '22px 24px 26px', background: 'var(--cream)', borderTop: '1px solid var(--line)' }}>
            {pickupDate ? <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 14, color: 'var(--muted)', marginBottom: 6 }}><span>{tx(lang, 'Ramassage', 'Pickup')}</span><span style={{ textAlign: 'right' }}>{weekly && mode === 'daily' ? tx(lang, 'chaque jour planifié', 'each planned day') : longDate(pickupDate, lang)}{time ? (lang === 'en' ? ` · around ${time}` : ` · vers ${time.replace(':', ' h ')}`) : ''}</span></div> : null}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)', marginBottom: 6 }}><span>{tx(lang, 'Sous-total', 'Subtotal')}</span><span>{money(subtotal, lang)}</span></div>
            {promo ? <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--green)', marginBottom: 6 }}><span>{tx(lang, 'Code ', 'Code ')}{promo.code}</span><span>−{money(discount, lang)}</span></div> : null}
            <div className="total-row" style={{ marginTop: 10 }}><span>{tx(lang, 'TOTAL ESTIMÉ', 'ESTIMATED TOTAL')}</span><strong>{money(total, lang)}</strong></div>
            {err ? <p role="alert" style={{ color: 'var(--rust-dark)', fontWeight: 700, fontSize: 14, marginBottom: 12 }}>{err}</p> : null}
            <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={submit}>{busy ? tx(lang, 'Envoi…', 'Sending…') : tx(lang, 'Envoyer ma commande', 'Send my order')}</button>
            <p className="hint" style={{ marginTop: 12, fontSize: 12.5, color: 'var(--muted)', textAlign: 'center' }}>{tx(lang, 'Avant taxes applicables. Vous recevez la confirmation et les infos de paiement Interac.', 'Before applicable taxes. You will receive the confirmation and Interac payment details.')}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
