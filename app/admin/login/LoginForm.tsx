'use client';
import { useActionState } from 'react';
import { loginAction } from '../actions';

export function LoginForm({ demo }: { demo: boolean }) {
  const [state, action, pending] = useActionState(loginAction, null as { error?: string } | null);
  return (
    <form action={action} style={{ display: 'grid', gap: 14 }}>
      {demo ? <p className="note" style={{ fontSize: 13 }}>Mode démo (sans Supabase) : seul le mot de passe compte.</p> : null}
      <div className="field"><label htmlFor="email">Courriel</label><input id="email" name="email" type="email" className="input" autoComplete="username" required={!demo} /></div>
      <div className="field"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" className="input" autoComplete="current-password" required /></div>
      {state?.error ? <p className="error" role="alert">{state.error}</p> : null}
      <button type="submit" className="btn btn-primary btn-block" disabled={pending}>{pending ? 'Connexion…' : 'Se connecter'}</button>
    </form>
  );
}
