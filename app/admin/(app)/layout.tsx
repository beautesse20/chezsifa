import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { currentAdmin } from '@/lib/auth';
import { getStore } from '@/lib/store';
import { logoutAction } from '../actions';
import { AdminNav } from './AdminNav';

export const metadata: Metadata = { title: 'Back office', robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const who = await currentAdmin();
  if (!who) redirect('/admin/login');
  const store = getStore();
  const [orders, catering] = await Promise.all([store.listOrders(), store.listCatering()]);
  const counts = { orders: orders.filter((o) => o.status === 'nouvelle').length, catering: catering.filter((c) => c.status === 'nouvelle').length };
  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="brand-admin" style={{ padding: '0 12px 22px' }}>
          <div style={{ fontFamily: 'var(--serif)', fontWeight: 800, fontSize: 20, letterSpacing: 2.5, color: '#fff' }}>CHEZ SIFA</div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'var(--gold)', fontWeight: 800 }}>BACK OFFICE{store.mode === 'memory' ? ' · DÉMO' : ''}</div>
        </div>
        <AdminNav counts={counts} />
        <div className="who" style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid rgba(255,255,255,.1)', fontSize: 13, color: '#B9AC9E' }}>
          {who}
          <form action={logoutAction}><button type="submit" className="link-btn" style={{ color: 'var(--ember)', marginTop: 4 }}>Se déconnecter</button></form>
          <a href="/" target="_blank" style={{ color: '#B9AC9E', display: 'block', marginTop: 8 }}>Voir le site ↗</a>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
