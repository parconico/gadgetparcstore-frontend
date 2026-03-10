import type { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';

const BASE_URL = 'https://gadgetparcstore.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }),
    getCollections(),
  ]);

  const productUrls: MetadataRoute.Sitemap = products.map(
    (p: { handle: string; updatedAt?: string }) => ({
      url: `${BASE_URL}/products/${p.handle}`,
      lastModified: p.updatedAt ?? new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }),
  );

  const collectionUrls: MetadataRoute.Sitemap = collections.map(
    (c: { handle: string; updatedAt?: string }) => ({
      url: `${BASE_URL}/categories/${c.handle}`,
      lastModified: c.updatedAt ?? new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }),
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date().toISOString(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/policies/shipping`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE_URL}/policies/refund`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE_URL}/policies/privacy`, changeFrequency: 'monthly', priority: 0.2 },
    { url: `${BASE_URL}/policies/terms`, changeFrequency: 'monthly', priority: 0.2 },
  ];

  return [...staticPages, ...collectionUrls, ...productUrls];
}
