/* eslint-disable @next/next/no-img-element */
const TINT: Record<string, string> = {
  grill: '#FCE7DA', trad: '#E7F0E3', veg: '#E3F1E6', sides: '#FBF0D4', starters: '#FBE6D8', pasta: '#F6EBDD',
  salads: '#E5F2E3', kids: '#EEF0FA', extras: '#FCE7DA', cakes: '#F8E3E6', sauces: '#FBE3D9'
};

export function Photo({ src, alt, cat, style, label }: { src?: string | null; alt: string; cat: string; style?: React.CSSProperties; label?: string }) {
  return (
    <div className="ph" style={{ backgroundColor: TINT[cat] || '#F5EEE5', ...style }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="ph-icon"><img src="/img/flame.png" alt="" />{label ? <em className="ph-label">{label}</em> : null}</span>}
    </div>
  );
}
