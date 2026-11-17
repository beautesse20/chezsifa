import type { MetadataRoute } from 'next';

const BASE = 'https://chezsifa.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/carte', '/composer', '/semaine', '/traiteur', '/comment-ca-marche'].map((p) => ({
    url: BASE + p, changeFrequency: 'weekly', priority: p === '' ? 1 : p === '/traiteur' ? 0.9 : 0.7
  }));
}
