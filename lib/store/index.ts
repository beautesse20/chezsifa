import type { Store } from './types';
import { memoryStore } from './memory';
import { supabaseStore } from './supabase';

export const hasSupabase = () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

/** Supabase si configuré ; sinon données en mémoire (développement local uniquement). */
export function getStore(): Store {
  if (hasSupabase()) return supabaseStore;
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL) {
    throw new Error('Supabase n\'est pas configuré : ajoutez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans Vercel.');
  }
  return memoryStore;
}
