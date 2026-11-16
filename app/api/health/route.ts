import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/** Diagnostic de configuration : n'affiche jamais les valeurs des clés. */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const out: Record<string, unknown> = {
    NEXT_PUBLIC_SUPABASE_URL: url ? (/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '')) ? 'ok' : `format inattendu : commence par « ${url.slice(0, 12)} », ${url.length} caractères`) : 'MANQUANTE',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'ok' : 'MANQUANTE',
    SUPABASE_SERVICE_ROLE_KEY: service ? (service.startsWith('sb_publishable') ? 'ERREUR : c\'est la clé publishable, il faut la clé secret' : 'ok') : 'MANQUANTE',
    ADMIN_EMAILS: process.env.ADMIN_EMAILS ? 'ok' : 'MANQUANTE'
  };
  if (url && service) {
    try {
      const db = createClient(url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, ''), service.trim(), { auth: { persistSession: false } });
      for (const t of ['settings', 'categories', 'products', 'promos', 'orders', 'catering_requests']) {
        const r = await db.from(t).select('*', { count: 'exact', head: true });
        out['table ' + t] = r.error ? 'ERREUR : ' + r.error.message : `ok (${r.count ?? 0} lignes)`;
      }
    } catch (e) {
      out.connexion = 'ERREUR : ' + (e as Error).message;
    }
  }
  return new NextResponse(JSON.stringify(out, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
