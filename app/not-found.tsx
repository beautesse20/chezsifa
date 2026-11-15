import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center' }}>
      <h1 className="h-lg">Page introuvable</h1>
      <p className="muted">Cette page n&apos;existe pas ou plus.</p>
      <Link href="/" className="btn btn-primary">Retour à l&apos;accueil</Link>
    </main>
  );
}
