import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/panier', '/commande'] }],
    sitemap: 'https://chezsifa.vercel.app/sitemap.xml'
  };
}
