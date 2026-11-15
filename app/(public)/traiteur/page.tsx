/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { getLang } from '@/lib/server';
import { getStore } from '@/lib/store';
import { tx } from '@/lib/format';
import { QuoteForm } from '@/components/QuoteForm';

export const metadata: Metadata = {
  title: 'Traiteur',
  description: 'Chez Sifa, service traiteur : grillades au charbon et cuisine congolaise et est-africaine pour mariages, entreprises, églises et événements en Colombie-Britannique.'
};

const ICON = { stroke: 'var(--charcoal)', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

export default async function TraiteurPage() {
  const [lang, settings] = await Promise.all([getLang(), getStore().getSettings()]);
  const tel = 'tel:+1' + settings.phone.replace(/\D/g, '').slice(-10);
  const concept = [
    [tx(lang, 'Grillades au charbon', 'Charcoal grilling'), tx(lang, 'Viandes marinées, cuites au charbon de bois pour une saveur fumée authentique.', 'Marinated meats, cooked over charcoal for an authentic smoky flavour.'), <path key="i" d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 3" />],
    [tx(lang, 'Recettes BBQ', 'BBQ recipes'), tx(lang, 'Des recettes BBQ généreuses, préparées avec soin, comme à la maison.', 'Bold BBQ recipes, prepared with care, just like at home.'), <path key="i" d="M4 11h16M6 11l1 8h10l1-8M9 7c0-2 1-3 1-4M13 7c0-2 1-3 1-4" />],
    [tx(lang, '100 % à emporter', '100% takeout'), tx(lang, 'Commandez, on vous prépare tout frais, prêt à récupérer.', 'Order ahead and we prepare everything fresh, ready for pickup.'), <><path key="a" d="M6 7h12l-1 13H7L6 7z" /><path key="b" d="M9 7a3 3 0 0 1 6 0" /></>],
    [tx(lang, 'Service traiteur', 'Catering service'), tx(lang, 'Entreprises, restaurants partenaires, événements privés et communautaires.', 'Businesses, partner restaurants, private and community events.'), <><rect key="a" x="3" y="5" width="18" height="16" rx="2" /><path key="b" d="M3 10h18M8 3v4M16 3v4" /></>]
  ] as const;
  const events = [
    [tx(lang, 'Mariages', 'Weddings'), tx(lang, 'Service traiteur complet pour le plus beau jour de votre vie.', 'Full-service catering for your big day.')],
    [tx(lang, 'Événements corporatifs', 'Corporate events'), tx(lang, 'Repas d\'équipe, lunchs de réunion, célébrations d\'entreprise.', 'Office lunches, meetings and company celebrations.')],
    [tx(lang, 'Églises & communautés', 'Churches & communities'), tx(lang, 'Repas en grande quantité pour rassemblements et moments de fraternité.', 'Large-batch meals for gatherings and fellowship.')],
    [tx(lang, 'Anniversaires & fêtes de famille', 'Birthdays & family parties'), tx(lang, 'Des plats maison pour souligner vos moments marquants.', 'Home-style dishes for milestone moments.')],
    [tx(lang, 'Service de buffet', 'Buffet service'), tx(lang, 'De généreux buffets, peu importe la taille du groupe.', 'Generous spreads for any size of crowd.')],
    [tx(lang, 'Dîners privés', 'Private dinners'), tx(lang, 'Une expérience culinaire intime, préparée chez vous.', 'Intimate, chef-prepared dining at home.')]
  ];
  const why = [
    ['var(--rust)', tx(lang, 'Une signature qu\'on reconnaît', 'A signature you\'ll recognize'), tx(lang, 'La grillade au charbon, cuisinée comme une spécialité assumée, pas une option parmi d\'autres.', 'Charcoal grilling, cooked as a proud specialty, not just another option.')],
    ['var(--gold)', tx(lang, 'Une authenticité vécue', 'A lived authenticity'), tx(lang, 'Des recettes et un savoir-faire familial transmis depuis la République démocratique du Congo.', 'Recipes and family know-how passed down from the Democratic Republic of Congo.')],
    ['var(--charcoal)', tx(lang, 'Une expérience traiteur éprouvée', 'Proven catering experience'), tx(lang, 'Des années à nourrir des communautés, des célébrations et des rassemblements.', 'Years spent feeding communities, celebrations and gatherings.')],
    ['var(--green)', tx(lang, 'Rare en Colombie-Britannique', 'Rare in British Columbia'), tx(lang, 'Une cuisine congolaise et est-africaine authentique, encore difficile à trouver ici.', 'Authentic Congolese and East African cuisine, still hard to find here.')]
  ];
  const serve = lang === 'en'
    ? ['African communities', 'Local families', 'Churches', 'Businesses', 'Wedding planners', 'Cultural & community events']
    : ['Communautés africaines', 'Familles locales', 'Églises', 'Entreprises', 'Planificateurs de mariage', 'Événements culturels & communautaires'];

  return (
    <>
      <section className="hero">
        <div className="glow1" /><div className="glow2" />
        <div className="wrap center" style={{ position: 'relative', paddingTop: 96, paddingBottom: 104 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--rust)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 10px 24px rgba(0,0,0,.35)' }}><img src="/img/flame.png" alt="" width={38} height={38} /></div>
          <span className="eyebrow eyebrow-gold">{tx(lang, 'Vente à emporter & traiteur · Colombie-Britannique', 'Takeout & catering · British Columbia')}</span>
          <h1 style={{ fontSize: 'clamp(52px, 8vw, 84px)', fontWeight: 800, letterSpacing: 2, color: '#fff' }}>CHEZ SIFA</h1>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24, color: 'var(--ember)', marginTop: 16 }}>{tx(lang, 'Grillades au feu de charbon', 'Charcoal fire grilling')}</p>
          <p className="lead" style={{ color: '#D8CCC1', margin: '18px auto 34px' }}>{tx(lang, 'Des plats authentiques, cuits au charbon de bois et préparés avec le même soin qu\'à la maison, pour votre prochain événement.', 'Authentic dishes, cooked over charcoal and prepared with the same care as at home, for your next event.')}</p>
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <a href="#devis" className="btn btn-primary">{tx(lang, 'Demander un devis traiteur', 'Request a catering quote')}</a>
            <Link href="/" className="btn btn-ghost">{tx(lang, 'Commander pour moi', 'Order for myself')}</Link>
          </div>
        </div>
      </section>
      <div className="kuba" />

      <section id="histoire" className="section" style={{ scrollMarginTop: 80 }}>
        <div className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 54, alignItems: 'center' }}>
          <div style={{ flex: '3 1 480px', minWidth: 0 }}>
            <span className="eyebrow">{tx(lang, 'Notre histoire', 'Our story')}</span>
            <h2 className="h-md" style={{ marginBottom: 22 }}>{tx(lang, 'Une hospitalité transmise, un don pour la table', 'A hospitality passed down, a gift for the table')}</h2>
            <p style={{ marginBottom: 16, fontSize: 16 }}>{tx(lang, 'Tout commence en République démocratique du Congo, dans une maison toujours ouverte. Mon père, médecin, soignait par la médecine, mais son premier geste envers une personne en difficulté était souvent simple : partager un repas avec elle.', 'It all began in the Democratic Republic of Congo, in a home that was always open. My father, a doctor, healed through medicine, but his first gesture toward someone in need was often simple: sharing a meal with them.')}</p>
            <p style={{ marginBottom: 16, fontSize: 16 }}>{tx(lang, 'Arrivée à Montréal, puis entourée de jeunes loin de leur famille, j\'ai poursuivi cette tradition sans m\'en rendre compte. Mon appartement est devenu un lieu de rassemblement : repas partagés, histoires écoutées, moments de réconfort.', 'After arriving in Montreal, and later surrounded by young people far from their families, I carried on that tradition without even realizing it. My apartment became a gathering place: shared meals, stories heard, moments of comfort.')}</p>
            <p style={{ fontSize: 16 }}>{tx(lang, 'En m\'installant en Colombie-Britannique, j\'ai voulu porter cette hospitalité plus loin. Chez Sifa est né de ce désir : faire de chaque repas un moment qui donne l\'impression d\'être chez soi.', 'When I settled in British Columbia, I wanted to carry that hospitality further. Chez Sifa was born from that desire: to turn every meal into a moment that feels like home.')}</p>
          </div>
          <figure style={{ flex: '2 1 340px', minWidth: 0, margin: 0, background: 'var(--rust)', color: '#fff', borderRadius: 24, padding: '44px 38px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div className="kuba" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 12 }} />
            <blockquote style={{ margin: '10px 0 24px', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 25, lineHeight: 1.4 }}>{tx(lang, '« Chaque plat raconte une histoire. Chaque repas donne l\'impression d\'être chez soi. »', '“Every dish tells a story. Every meal feels like home.”')}</blockquote>
            <div style={{ width: 46, height: 2, background: 'var(--gold)', margin: '0 auto 14px' }} />
            <figcaption style={{ fontWeight: 800, fontSize: 13.5, color: '#FFE3C8' }}>{tx(lang, 'Fondatrice, Chez Sifa', 'Founder, Chez Sifa')}</figcaption>
          </figure>
        </div>
      </section>

      <section id="concept" className="section bg-sand" style={{ scrollMarginTop: 80 }}>
        <div className="wrap">
          <div className="center" style={{ marginBottom: 40 }}><span className="eyebrow">{tx(lang, 'Le concept', 'The concept')}</span><h2 className="h-md">{tx(lang, 'Une spécialité forte, préparée pour vous', 'A bold specialty, made for you')}</h2></div>
          <div className="grid g-auto-250">
            {concept.map(([t, d, icon]) => (
              <div key={t} className="card pad">
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--rust)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="26" height="26" viewBox="0 0 24 24" {...ICON} aria-hidden="true">{icon}</svg></div>
                <h3 style={{ fontSize: 21, margin: '18px 0 6px' }}>{t}</h3>
                <p className="muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="evenements" className="section bg-dark" style={{ position: 'relative', overflow: 'hidden', scrollMarginTop: 80 }}>
        <div className="wrap" style={{ position: 'relative' }}>
          <div className="center" style={{ marginBottom: 40 }}>
            <span className="eyebrow">{tx(lang, 'Service traiteur', 'Catering service')}</span>
            <h2 className="h-md">{tx(lang, 'Pour vos événements, en toute simplicité', 'For your events, made simple')}</h2>
            <p className="lead">{tx(lang, 'Mariages, entreprises, églises et rassemblements communautaires : Chez Sifa prépare des plats en grande quantité, avec un menu personnalisable selon votre occasion.', 'Weddings, businesses, churches and community gatherings: Chez Sifa prepares dishes in large quantities, with a menu customizable to your occasion.')}</p>
          </div>
          <div className="grid g-auto-250" style={{ gap: 14 }}>
            {events.map(([t, d]) => (
              <div key={t} style={{ background: 'var(--charcoal-2)', borderRadius: 18, padding: 24 }}><h3 style={{ fontSize: 20, marginBottom: 6 }}>{t}</h3><p style={{ color: '#D8CCC1', fontSize: 14 }}>{d}</p></div>
            ))}
          </div>

          <div id="devis" style={{ marginTop: 56, borderRadius: 26, display: 'flex', flexWrap: 'wrap', overflow: 'hidden', scrollMarginTop: 90 }}>
            <div style={{ flex: '1 1 320px', padding: '40px 36px', background: 'var(--rust)' }}>
              <span className="eyebrow" style={{ color: '#FFE3C8' }}>{tx(lang, 'Devis express', 'Quick quote')}</span>
              <h2 style={{ fontSize: 34, marginBottom: 14 }}>{tx(lang, 'Parlez-nous de votre événement', 'Tell us about your event')}</h2>
              <p style={{ color: '#FFE9D9', marginBottom: 22 }}>{tx(lang, 'Demandez-nous nos formules traiteur personnalisées pour votre prochain événement.', 'Ask about our custom catering packages for your next event.')}</p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10, fontSize: 15 }}>
                <li>✓ {tx(lang, 'Menu adapté à votre occasion', 'Menu tailored to your occasion')}</li>
                <li>✓ {tx(lang, 'Chauffe-plats en location', 'Chafing dish rental')}</li>
                <li>✓ {tx(lang, 'Paiement par virement Interac', 'Payment by Interac e-Transfer')}</li>
              </ul>
            </div>
            <div style={{ flex: '2 1 460px', minWidth: 0, background: 'var(--charcoal)', border: '1px solid rgba(217,164,65,.25)', borderLeft: 0 }}><QuoteForm /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="center" style={{ marginBottom: 40 }}><span className="eyebrow">{tx(lang, 'Pourquoi Chez Sifa', 'Why Chez Sifa')}</span><h2 className="h-md">{tx(lang, 'Une authenticité qu\'on ne trouve pas ailleurs', 'An authenticity you won\'t find elsewhere')}</h2></div>
          <div className="grid g-auto-250" style={{ gap: 26 }}>
            {why.map(([c, t, d]) => <div key={t} style={{ borderTop: `3px solid ${c}`, paddingTop: 18 }}><h3 style={{ fontSize: 20, marginBottom: 6 }}>{t}</h3><p className="muted">{d}</p></div>)}
          </div>
          <div className="center" style={{ marginTop: 56 }}>
            <span className="eyebrow">{tx(lang, 'Qui nous servons', 'Who we serve')}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
              {serve.map((s) => <span key={s} style={{ border: '1.5px solid var(--line-2)', background: '#fff', borderRadius: 999, padding: '9px 18px', fontSize: 13.5, fontWeight: 700, color: 'var(--muted)' }}>{s}</span>)}
            </div>
          </div>
          <div className="center" style={{ marginTop: 50 }}>
            <span className="eyebrow">{tx(lang, 'Ils nous ont fait confiance', 'Trusted by')}</span>
            <img src="/img/afaf.png" alt="Association Femmes Africaines Francophones (AFAF)" style={{ height: 64, width: 'auto', margin: '0 auto', background: 'var(--rust)', borderRadius: 12, padding: '10px 16px' }} />
          </div>
        </div>
      </section>

      <section id="contact" className="section bg-dark center" style={{ scrollMarginTop: 80 }}>
        <div className="wrap-narrow">
          <span className="eyebrow">Contact</span>
          <h2 className="h-md">{tx(lang, 'Envie de goûter Chez Sifa ?', 'Craving a taste of Chez Sifa?')}</h2>
          <p className="lead" style={{ margin: '14px auto 26px' }}>{tx(lang, 'Écrivez-nous pour réserver un service traiteur, ou simplement dire bonjour.', 'Write to us to book catering, or just say hello.')}</p>
          <a href="mailto:chezsifa@gmail.com" style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: 24, color: 'var(--ember)' }}>chezsifa@gmail.com</a>
          <a href={tel} style={{ display: 'block', marginTop: 6, fontFamily: 'var(--serif)', fontSize: 20, color: '#fff' }}>{settings.phone}</a>
          <p style={{ marginTop: 8, color: '#9C8E82', fontSize: 14 }}>{tx(lang, 'Colombie-Britannique, Canada', 'British Columbia, Canada')}</p>
        </div>
      </section>
    </>
  );
}
