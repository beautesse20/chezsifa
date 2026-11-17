import Link from 'next/link';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';
import { earliest } from '@/lib/dates';
import { L, LD, longDate, money, tx } from '@/lib/format';
import { Photo } from '@/components/Photo';
import { CatIcon } from '@/components/CatIcon';
import { ReorderBanner } from '@/components/Extras';
import { ProductCard } from '@/components/ProductCard';

const UNIVERSES = [
  { cat: 'grill', href: '/carte#grill' },
  { cat: 'trad', href: '/carte#trad' },
  { cat: 'cakes', href: '/carte#cakes', fr: 'Douceurs maison', en: 'Homemade sweets' },
  { cat: 'sauces', href: '/carte#sauces' }
];

function Flame({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c.6 3.3 3.2 4.9 4.6 7.3 1.9 3.2.9 7.6-2.4 9.6-1.2.7-2.7 1.1-4.2 1.1-3.9 0-7-2.8-7-6.6 0-2.4 1.2-4.2 2.6-5.5.2 1.8 1 3 2.3 3.6-.4-3.9 1.7-6.9 4.1-9.5z" /></svg>;
}

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
      <ReorderBanner />
      <section className="hero">
        <div className="hero-blob" /><div className="hero-blob b2" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-gold">{tx(lang, 'BBQ au charbon de bois · Surrey', 'Charcoal BBQ · Surrey, BC')}</span>
            <h1 className="h-xl"><span className="rise">{tx(lang, 'Le goût du charbon,', 'Charcoal flavour,')}</span><br /><em className="rise" style={{ ['--d' as string]: '.18s' }}>{tx(lang, 'prêt en 48 h.', 'ready in 48 h.')}</em></h1>
            <p className="lead rise" style={{ ['--d' as string]: '.36s' }}>{tx(lang, 'Viandes et poissons marinés, cuits au charbon de bois. Plats congolais, gâteaux et sauces maison. Commandez en ligne et choisissez votre date de ramassage.', 'Marinated meats and fish, cooked over charcoal. Congolese dishes, homemade cakes and sauces. Order online and choose your pickup date.')}</p>
            <div className="btn-row rise" style={{ ['--d' as string]: '.5s' }}>
              <Link href="/composer" className="btn btn-primary">{tx(lang, 'Composer mon assiette', 'Build my plate')}</Link>
              <Link href="/carte" className="btn btn-ghost">{tx(lang, 'Découvrir la carte', 'See the menu')}</Link>
            </div>
          </div>
          <div className={'hero-visual rise' + (star?.photo ? '' : ' no-photo')} style={{ ['--d' as string]: '.3s' }}>
          {star?.photo ? <Photo src={star.photo} alt={L(lang, star)} cat={star.cat} /> : (
            <div className="menu-card" aria-label={tx(lang, 'Extrait de la carte du grill', 'From the grill menu')}>
              <span className="menu-card-k">{tx(lang, 'Au grill cette semaine', 'On the grill this week')}</span>
              <ul>
                {catalog.products.filter((p) => p.cat === 'grill').slice(0, 6).map((p) => (
                  <li key={p.id}><span>{L(lang, p)}</span><i /><b>{money(p.r, lang)}</b></li>
                ))}
              </ul>
              <span className="menu-card-foot">{tx(lang, 'Avec 1 accompagnement au choix · portions Regular ou Large', 'With 1 side of your choice · Regular or Large')}</span>
              <div className="menu-card-date"><span>{tx(lang, 'Commandé aujourd\'hui, prêt dès le', 'Order today, ready from')}</span><b>{longDate(first, lang)}</b></div>
            </div>
          )}
          <span className="hero-badge"><Flame />{tx(lang, 'Cuit au charbon de bois', 'Charcoal grilled')}</span>
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
            <div><span className="eyebrow">{tx(lang, 'La carte', 'The menu')}</span><h2 className="h-md">{tx(lang, 'Nos spécialités', 'Our specialties')}</h2></div>
            <p className="muted" style={{ maxWidth: 380 }}>{tx(lang, 'Tout se commande sur le site, en portion Regular ou Large.', 'Everything can be ordered online, in Regular or Large.')}</p>
          </div>
          <div className="grid g-auto-250">
            {UNIVERSES.map((u, ui) => {
              const c = catalog.categories.find((x) => x.id === u.cat);
              if (!c) return null;
              const photo = catalog.products.find((p) => p.cat === u.cat && p.photo)?.photo;
              return (
                <Link key={u.cat} href={u.href} className="card universe" data-reveal style={{ ['--d' as string]: `${ui * 0.1}s` }}>
                  {photo ? <Photo src={photo} alt="" cat={u.cat} /> : <div className="uni-top"><span><CatIcon cat={u.cat} size={34} /></span></div>}
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
            <span className="eyebrow" data-reveal>{tx(lang, 'Sélection du moment', 'Current selection')}</span>
            <h2 className="h-md" data-reveal style={{ marginBottom: 32 }}>{tx(lang, 'Les favoris de la maison', 'House favourites')}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <article data-reveal style={{ alignSelf: 'flex-start', background: 'var(--sand)', flex: '2 1 520px', minWidth: 0, borderRadius: 24, overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}>
                {star.photo ? <Photo src={star.photo} alt={L(lang, star)} cat={star.cat} style={{ flex: '1 1 260px', minHeight: 300 }} /> : (
                  <div className="star-side">
                    <span className="product-ico" style={{ width: 64, height: 64 }}><CatIcon cat={star.cat} size={32} /></span>
                    <p className="star-side-k">{tx(lang, 'Accompagnements au choix', 'Choice of side')}</p>
                    <ul>{catalog.includedSides.slice(0, 5).map((x) => <li key={x.id}>{L(lang, x)}</li>)}</ul>
                  </div>
                )}
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

      <section className="grill-band">
        <div className="wrap">
          <div className="grill-head" data-reveal>
            <span className="eyebrow" style={{ color: 'var(--ember-light)' }}>{tx(lang, 'Notre savoir-faire', 'Our craft')}</span>
            <h2 className="h-md" style={{ color: '#fff' }}>{tx(lang, 'Le BBQ au charbon de bois, notre signature', 'Charcoal BBQ, our signature')}</h2>
          </div>
          <div className="grill-grid">
            {[
              [tx(lang, 'Marinades maison', 'House marinades'), tx(lang, 'Poulet, porc, bœuf, chèvre et poisson marinés avec nos marinades vertes et nos épices.', 'Chicken, pork, beef, goat and fish marinated with our green marinades and spices.')],
              [tx(lang, 'Cuisson au charbon de bois', 'Cooked over charcoal'), tx(lang, 'Une cuisson lente sur la braise pour une viande tendre et un vrai goût fumé.', 'Slow-cooked over embers for tender meat and a true smoky flavour.')],
              [tx(lang, 'Servi avec l\'accompagnement de votre choix', 'Served with your choice of side'), tx(lang, 'Plantain frit, haricots, pois chiches ou riz, en portion Regular ou Large.', 'Fried plantain, beans, chickpeas or rice, in Regular or Large.')]
            ].map(([t, d], i) => (
              <div key={t} className="grill-item" data-reveal style={{ ['--d' as string]: `${i * 0.1}s` }}>
                <span className="grill-icon"><Flame size={20} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 34 }} data-reveal><Link href="/carte#grill" className="btn btn-primary">{tx(lang, 'Voir les grillades', 'See the grills')}</Link></div>
        </div>
      </section>

      <section className="section bg-sand">
        <div className="wrap">
          <h2 className="h-md center" data-reveal style={{ marginBottom: 40 }}>{tx(lang, 'Délais de commande', 'Order lead times')}</h2>
          <div className="grid g-auto-300">
            <div className="bg-dark" data-reveal style={{ borderRadius: 24, padding: '40px 36px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 104, lineHeight: .9, fontWeight: 800, color: 'var(--rust)' }}>{settings.min_hours} h</div>
              <h3 style={{ fontSize: 26, margin: '18px 0 8px' }}>{tx(lang, 'Commandez sur le site', 'Order online')}</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{tx(lang, `Choisissez votre date à partir de ${settings.min_hours} h. Chez Sifa confirme, vous payez par Interac, on prépare.`, `Pick your date from ${settings.min_hours} h ahead. Chez Sifa confirms, you pay by Interac, we cook.`)}</p>
              <div className="btn-row"><Link href="/composer" className="btn btn-primary">{tx(lang, 'Commander en ligne', 'Order online')}</Link><Link href="/semaine" className="btn btn-ghost">{tx(lang, 'Planifier ma semaine', 'Plan my week')}</Link></div>
            </div>
            <div data-reveal style={{ ['--d' as string]: '.12s', background: 'var(--white)', border: '1.5px solid var(--line-2)', borderRadius: 24, padding: '40px 36px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 104, lineHeight: .9, fontWeight: 800 }}>24 h</div>
              <h3 style={{ fontSize: 26, margin: '18px 0 8px' }}>{tx(lang, 'Commande urgente', 'Urgent order')}</h3>
              <p className="muted" style={{ marginBottom: 24 }}>{tx(lang, 'Pour une commande dans les 24 h, appelez Chez Sifa : on vérifie ensemble ce qui est possible.', 'For an order within 24 h, call Chez Sifa: we\'ll check together what\'s possible.')}</p>
              <a href={tel} className="btn btn-outline">{settings.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="center" data-reveal><span className="eyebrow">{tx(lang, 'Fonctionnement', 'How it works')}</span><h2 className="h-md" style={{ marginBottom: 44 }}>{tx(lang, 'Commander en trois étapes', 'Order in three steps')}</h2></div>
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
