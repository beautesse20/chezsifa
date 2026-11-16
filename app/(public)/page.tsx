import Link from 'next/link';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';
import { earliest } from '@/lib/dates';
import { L, LD, longDate, money, tx } from '@/lib/format';
import { Photo } from '@/components/Photo';
import { ProductCard } from '@/components/ProductCard';

const UNIVERSES = [
  { cat: 'grill', href: '/carte#grill' },
  { cat: 'trad', href: '/carte#trad' },
  { cat: 'cakes', href: '/carte#cakes', fr: 'Douceurs maison', en: 'Homemade sweets' },
  { cat: 'sauces', href: '/carte#sauces' }
];

export default async function Home() {
  const lang = await getLang();
  const store = getStore();
  const [catalog, settings] = await Promise.all([store.getCatalog(), store.getSettings()]);
  const first = earliest(settings.min_hours).date;
  const featured = catalog.products.filter((p) => p.featured);
  const star = featured[0];
  const others = featured.slice(1, 4);
  const minOf = (cat: string) => Math.min(...catalog.products.filter((p) => p.cat === cat).map((p) => p.r));
  const tel = 'tel:+1' + settings.phone.replace(/\D/g, '').slice(-10);

  return (
    <>
      <section className="hero">
        <div className="hero-blob" /><div className="hero-blob b2" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-gold">{tx(lang, 'Cuisine congolaise & est-africaine · Surrey, C.-B.', 'Congolese & East African food · Surrey, BC')}</span>
            <h1 className="h-xl"><span className="rise">{tx(lang, 'Le goût du charbon,', 'Charcoal flavour,')}</span><br /><em className="rise" style={{ ['--d' as string]: '.18s' }}>{tx(lang, 'prêt en 48 h.', 'ready in 48 h.')}</em></h1>
            <p className="lead rise" style={{ ['--d' as string]: '.36s' }}>{tx(lang, 'Grillades marinées, pondu, makayabu, gâteaux et sauces maison. Composez votre commande en ligne, choisissez votre jour : on allume le feu.', 'Marinated grills, pondu, makayabu, homemade cakes and sauces. Build your order online, pick your day: we light the fire.')}</p>
            <div className="btn-row rise" style={{ ['--d' as string]: '.5s' }}>
              <Link href="/composer" className="btn btn-primary">{tx(lang, 'Composer mon assiette', 'Build my plate')}</Link>
              <Link href="/carte" className="btn btn-ghost">{tx(lang, 'Découvrir la carte', 'See the menu')}</Link>
            </div>
          </div>
          <div className="hero-visual rise" style={{ ['--d' as string]: '.3s' }}>
          <Photo src={star?.photo} alt={star ? L(lang, star) : ''} cat={star?.cat || 'grill'} label={star ? L(lang, star) : undefined} />
          <span className="hero-badge"><i />{tx(lang, 'Cuit au charbon', 'Charcoal grilled')}</span>
          <div className="ticket" aria-label={tx(lang, 'Délai de commande', 'Order timing')}>
            <div className="ticket-top">
              <b>{tx(lang, 'VOTRE PROCHAINE COMMANDE', 'YOUR NEXT ORDER')}</b>
              <p>{tx(lang, 'Commandée aujourd\'hui,', 'Ordered today,')}<br />{tx(lang, 'prête dès le ', 'ready from ')}<span>{longDate(first, lang)}</span></p>
            </div>
            <div className="ticket-cut" />
            <ol className="ticket-steps">
              <li><span className="dot" style={{ background: 'var(--rust)', color: '#fff' }}>J</span><div><strong>{tx(lang, 'Vous commandez en ligne', 'You order online')}</strong><small>{tx(lang, 'Paiement Interac après confirmation', 'Interac payment after confirmation')}</small></div></li>
              <li><span className="dot" style={{ background: 'var(--gold)' }}>+24</span><div><strong>{tx(lang, 'Marinade & préparation', 'Marinating & prep')}</strong><small>{tx(lang, 'Viandes marinées, sauces mijotées', 'Meats marinated, sauces simmered')}</small></div></li>
              <li><span className="dot" style={{ background: 'var(--charcoal)', color: '#fff' }}>+48</span><div><strong>{tx(lang, 'Sortie du charbon, c\'est prêt', 'Off the charcoal, it\'s ready')}</strong><small>{tx(lang, 'Vous récupérez votre commande', 'You pick up your order')}</small></div></li>
            </ol>
          </div>
          </div>
        </div>
      </section>


      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="wrap">
          <div data-reveal style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 36 }}>
            <div><span className="eyebrow">{tx(lang, 'Nos quatre univers', 'Our four worlds')}</span><h2 className="h-md">{tx(lang, 'Qu\'est-ce qui vous fait ', 'What are you ')}{tx(lang, 'envie', 'craving')} ?</h2></div>
            <p className="muted" style={{ maxWidth: 380 }}>{tx(lang, 'Tout se commande sur le site, en portion Regular ou Large.', 'Everything can be ordered online, in Regular or Large.')}</p>
          </div>
          <div className="grid g-auto-250">
            {UNIVERSES.map((u, ui) => {
              const c = catalog.categories.find((x) => x.id === u.cat);
              if (!c) return null;
              const photo = catalog.products.find((p) => p.cat === u.cat && p.photo)?.photo;
              return (
                <Link key={u.cat} href={u.href} className="card universe" data-reveal style={{ ['--d' as string]: `${ui * 0.1}s` }}>
                  <Photo src={photo} alt="" cat={u.cat} label={u.fr ? tx(lang, u.fr, u.en!) : L(lang, c)} />
                  <div className="body">
                    <h3>{u.fr ? tx(lang, u.fr, u.en!) : L(lang, c)}</h3>
                    <p>{LD(lang, c)}</p>
                    <span className="go">{tx(lang, 'dès ', 'from ')}{money(minOf(u.cat), lang)} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {star && (
        <section className="section" style={{ paddingTop: 50 }}>
          <div className="wrap">
            <span className="eyebrow" data-reveal>{tx(lang, 'En ce moment chez Sifa', 'Right now at Sifa\'s')}</span>
            <h2 className="h-md" data-reveal style={{ marginBottom: 32 }}>{tx(lang, 'Les incontournables', 'The must-haves')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <article data-reveal style={{ background: 'var(--peach)', flex: '2 1 520px', minWidth: 0, borderRadius: 24, overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
                <Photo src={star.photo} alt={L(lang, star)} cat={star.cat} label={L(lang, star)} style={{ flex: '1 1 260px', minHeight: 300 }} />
                <div style={{ flex: '1 1 260px', padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <span className="badge badge-gold" style={{ alignSelf: 'flex-start' }}>{tx(lang, 'COUP DE CŒUR', 'HOUSE FAVOURITE')}</span>
                  <h3 style={{ fontSize: 32 }}>{L(lang, star)}{star.side ? tx(lang, ' + 1 accompagnement', ' + 1 side') : ''}</h3>
                  <p style={{ color: 'var(--muted)' }}>{LD(lang, star)} {star.side ? tx(lang, 'Avec plantain frit, haricots, pois chiches ou riz.', 'With fried plantain, beans, chickpeas or rice.') : ''}</p>
                  <p style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--ember)' }}>{star.sizes === 'rl' ? `R ${money(star.r, lang)} · L ${money(star.l ?? star.r, lang)}` : money(star.r, lang)}</p>
                  <Link href={`/composer?plat=${star.id}`} className="btn btn-primary" style={{ marginTop: 'auto' }}>{tx(lang, 'Le composer', 'Build it')}</Link>
                </div>
              </article>
              <div style={{ flex: '1 1 300px', minWidth: 0 }} className="grid">
                {others.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section bg-sand">
        <div className="wrap">
          <h2 className="h-md center" data-reveal style={{ marginBottom: 40 }}>{tx(lang, 'Quand voulez-vous ', 'When do you want to ')}{tx(lang, 'manger', 'eat')} ?</h2>
          <div className="grid g-auto-300">
            <div className="bg-dark" data-reveal style={{ borderRadius: 24, padding: '40px 36px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 104, lineHeight: .9, fontWeight: 800, color: 'var(--green)' }}>{settings.min_hours} h</div>
              <h3 style={{ fontSize: 26, margin: '18px 0 8px' }}>{tx(lang, 'Commandez sur le site', 'Order online')}</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{tx(lang, `Choisissez votre date à partir de ${settings.min_hours} h. Chez Sifa confirme, vous payez par Interac, on prépare.`, `Pick your date from ${settings.min_hours} h ahead. Chez Sifa confirms, you pay by Interac, we cook.`)}</p>
              <div className="btn-row"><Link href="/composer" className="btn btn-primary">{tx(lang, 'Commander en ligne', 'Order online')}</Link><Link href="/semaine" className="btn btn-ghost">{tx(lang, 'Planifier ma semaine', 'Plan my week')}</Link></div>
            </div>
            <div data-reveal style={{ ['--d' as string]: '.12s', background: 'var(--white)', border: '1.5px solid var(--line-2)', borderRadius: 24, padding: '40px 36px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 104, lineHeight: .9, fontWeight: 800 }}>24 h</div>
              <h3 style={{ fontSize: 26, margin: '18px 0 8px' }}>{tx(lang, 'C\'est plus pressé ?', 'In a hurry?')}</h3>
              <p className="muted" style={{ marginBottom: 24 }}>{tx(lang, 'Pour une commande dans les 24 h, appelez Chez Sifa : on vérifie ensemble ce qui est possible.', 'For an order within 24 h, call Chez Sifa: we\'ll check together what\'s possible.')}</p>
              <a href={tel} className="btn btn-outline">{settings.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="center" data-reveal><span className="eyebrow">{tx(lang, 'Commander, c\'est simple', 'Ordering is easy')}</span><h2 className="h-md" style={{ marginBottom: 44 }}>{tx(lang, 'Trois étapes, zéro stress', 'Three steps, zero stress')}</h2></div>
          <div className="grid g-auto-250" style={{ gap: 30 }}>
            {[
              { n: '01', c: 'var(--rust)', fr: ['Composez votre panier', `Assiettes, plats du pays, douceurs et sauces dans une seule commande. Choisissez votre date (${settings.min_hours} h minimum).`], en: ['Fill your cart', `Plates, traditional dishes, cakes and sauces in one order. Pick your date (${settings.min_hours} h minimum).`] },
              { n: '02', c: '#B8862A', fr: ['Confirmation & paiement', 'Chez Sifa confirme votre commande et le montant. Vous payez par virement Interac.'], en: ['Confirmation & payment', 'Chez Sifa confirms your order and the amount. You pay by Interac e-Transfer.'] },
              { n: '03', c: 'var(--charcoal)', fr: ['C\'est prêt !', 'Votre commande vous attend le jour choisi. Ramassage uniquement.'], en: ['It\'s ready!', 'Your order is waiting on the chosen day. Pickup only.'] }
            ].map((s, si) => (
              <div key={s.n} data-reveal style={{ ['--d' as string]: `${si * 0.12}s`, borderTop: `3px solid ${s.c}`, paddingTop: 22 }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 800, color: s.c }}>{s.n}</span>
                <h3 style={{ fontSize: 23, margin: '8px 0 6px' }}>{lang === 'en' ? s.en[0] : s.fr[0]}</h3>
                <p className="muted">{lang === 'en' ? s.en[1] : s.fr[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="wrap">
          <div data-reveal style={{ background: 'var(--butter)', color: 'var(--ink)', borderRadius: 28, padding: '46px 48px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 26 }}>
            <div style={{ flex: '1 1 420px' }}>
              <span className="eyebrow">{tx(lang, 'Service traiteur', 'Catering')}</span>
              <h2 style={{ fontSize: 36, marginBottom: 10 }}>{tx(lang, 'Un mariage, une fête, un événement d\'entreprise ?', 'A wedding, a party, a corporate event?')}</h2>
              <p className="muted">{tx(lang, 'Buffets, grandes quantités, menu personnalisé : demandez un devis.', 'Buffets, large quantities, a custom menu: request a quote.')}</p>
            </div>
            <Link href="/traiteur" className="btn btn-dark">{tx(lang, 'Espace traiteur →', 'Catering →')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
