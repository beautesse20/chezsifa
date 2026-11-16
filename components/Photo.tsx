/* eslint-disable @next/next/no-img-element */
const TINT: Record<string, string> = {
  grill: '#F1E7DC', trad: '#EAEDE5', veg: '#E9EEE6', sides: '#F4EDE0', starters: '#F2E8DE', pasta: '#F3EDE4',
  salads: '#E9EEE6', kids: '#EEEDE9', extras: '#F1E7DC', cakes: '#F3EAE6', sauces: '#F2E7DE'
};

export function Photo({ src, alt, cat, style, label }: { src?: string | null; alt: string; cat: string; style?: React.CSSProperties; label?: string }) {
  return (
    <div className="ph" style={{ backgroundColor: TINT[cat] || '#F5EEE5', ...style }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="ph-icon"><img src="/img/flame.png" alt="" />{label ? <em className="ph-label">{label}</em> : null}</span>}
    </div>
  );
}
