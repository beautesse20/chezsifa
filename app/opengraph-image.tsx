import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const alt = 'Chez Sifa – BBQ au charbon de bois et cuisine congolaise, prêt en 48 h';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Image d'aperçu affichée quand le lien est partagé (WhatsApp, Facebook, Messenger…). */
export default async function OgImage() {
  const [regular, italic] = await Promise.all([
    readFile(join(process.cwd(), 'assets/cormorant-600.woff')),
    readFile(join(process.cwd(), 'assets/cormorant-600-italic.woff'))
  ]);
  const grill = ['Poulet BBQ', 'Brochettes de bœuf', 'Côtes levées', 'Chèvre BBQ', 'Tilapia BBQ'];
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#FAF7F2', fontFamily: 'Cormorant' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 70px' }}>
          <div style={{ fontSize: 22, letterSpacing: 6, color: '#B8924A', fontFamily: "Cormorant", fontWeight: 700 }}>BBQ AU CHARBON DE BOIS · SURREY</div>
          <div style={{ fontSize: 96, color: '#1F1A17', marginTop: 18, lineHeight: 1 }}>Le goût du charbon,</div>
          <div style={{ fontSize: 96, color: '#A34F2C', fontStyle: 'italic', lineHeight: 1.1 }}>prêt en 48 h.</div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
            <div style={{ fontSize: 44, letterSpacing: 8, color: '#1F1A17', whiteSpace: 'nowrap', display: 'flex' }}>CHEZ SIFA</div>
            <div style={{ width: 2, height: 36, background: '#DDD2C4', margin: '0 26px' }} />
            <div style={{ fontSize: 24, color: '#6B6159', fontFamily: "Cormorant" }}>Commande en ligne · Traiteur</div>
          </div>
        </div>
        <div style={{ width: 400, margin: 40, borderRadius: 36, background: '#1F1A17', display: 'flex', flexDirection: 'column', padding: '44px 38px', color: '#EFE6DC' }}>
          <div style={{ fontSize: 18, letterSpacing: 5, color: '#D9B877', fontFamily: "Cormorant", fontWeight: 700 }}>AU GRILL</div>
          {grill.map((g) => (
            <div key={g} style={{ display: 'flex', fontSize: 34, marginTop: 18, borderBottom: '1px dashed rgba(239,230,220,.3)', paddingBottom: 8 }}>{g}</div>
          ))}
          <div style={{ marginTop: 'auto', fontSize: 18, color: '#B8AA9C', fontFamily: "Cormorant" }}>chezsifa.vercel.app</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: 'Cormorant', data: regular, style: 'normal', weight: 600 }, { name: 'Cormorant', data: italic, style: 'italic', weight: 600 }] }
  );
}
