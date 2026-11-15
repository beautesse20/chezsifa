/* eslint-disable @next/next/no-img-element */
const TINT: Record<string, string> = {
  grill: '#3A2C25', trad: '#2F3B2A', veg: '#3E5A3A', sides: '#6B4A22', starters: '#6B2E1A', pasta: '#5B3A29',
  salads: '#3E5A3A', kids: '#4A4038', extras: '#3A2C25', cakes: '#5A2A33', sauces: '#6B2E1A'
};

export function Photo({ src, alt, cat, style }: { src?: string | null; alt: string; cat: string; style?: React.CSSProperties }) {
  return (
    <div className="ph" style={{ backgroundColor: TINT[cat] || '#3A2C25', ...style }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="ph-icon"><img src="/img/flame.png" alt="" /></span>}
    </div>
  );
}
