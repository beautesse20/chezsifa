import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { hasSupabase } from './store';

const DEMO_COOKIE = 'cs_demo_admin';

export async function supabaseAuthClient() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* appelé depuis un Server Component */ }
      }
    }
  });
}

const adminEmails = () => (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const demoSecret = () => process.env.ADMIN_DEMO_PASSWORD || 'demo';
const demoToken = () => createHmac('sha256', demoSecret()).update('chezsifa-demo-admin').digest('hex');

/** Renvoie le courriel de l'admin connecté, ou null. */
export async function currentAdmin(): Promise<string | null> {
  if (hasSupabase()) {
    const sb = await supabaseAuthClient();
    const { data } = await sb.auth.getUser();
    const email = data.user?.email?.toLowerCase();
    if (!email) return null;
    const allowed = adminEmails();
    return allowed.length === 0 || allowed.includes(email) ? email : null;
  }
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) return null;
  const v = (await cookies()).get(DEMO_COOKIE)?.value || '';
  const t = demoToken();
  return v.length === t.length && timingSafeEqual(Buffer.from(v), Buffer.from(t)) ? 'demo@chezsifa' : null;
}

export async function signIn(email: string, password: string): Promise<string | null> {
  if (hasSupabase()) {
    if (adminEmails().length && !adminEmails().includes(email.toLowerCase())) return 'Ce compte n\'a pas accès au back office.';
    const sb = await supabaseAuthClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    return error ? 'Courriel ou mot de passe incorrect.' : null;
  }
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) return 'Supabase n\'est pas configuré.';
  if (password !== demoSecret()) return 'Mot de passe incorrect (mode démo).';
  (await cookies()).set(DEMO_COOKIE, demoToken(), { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 12 });
  return null;
}

export async function signOut() {
  if (hasSupabase()) {
    const sb = await supabaseAuthClient();
    await sb.auth.signOut();
  }
  (await cookies()).delete(DEMO_COOKIE);
}
