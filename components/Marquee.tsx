/** Bandeau défilant de noms de plats (le contenu est doublé pour boucler sans saut). */
export function Marquee({ items, light }: { items: string[]; light?: boolean }) {
  const row = items.map((t, i) => <span key={i}>{t}</span>);
  return (
    <div className={'marquee' + (light ? ' light' : '')} aria-hidden="true">
      <div className="marquee-track">{row}{items.map((t, i) => <span key={'b' + i}>{t}</span>)}</div>
    </div>
  );
}
