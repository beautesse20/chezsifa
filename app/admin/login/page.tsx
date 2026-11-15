import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import { hasSupabase } from '@/lib/store';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Connexion back office', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await currentAdmin()) redirect('/admin');
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--charcoal)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: 'var(--cream)', borderRadius: 24, overflow: 'hidden' }}>
        <div className="kuba" />
        <div style={{ padding: '34px 32px 36px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 800, fontSize: 24, letterSpacing: 3 }}>CHEZ SIFA</div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--rust)', fontWeight: 800, marginBottom: 22 }}>BACK OFFICE</div>
          <LoginForm demo={!hasSupabase()} />
        </div>
      </div>
    </main>
  );
}
