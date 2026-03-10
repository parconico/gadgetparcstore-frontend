import type { MetadataRoute } from 'next';
import { getProducts, getCollections } from '@/lib/shopify';

const BASE_URL = 'https://gadgetparcstore.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts({ first: 250 }),
    getCollections(),
  ]);

  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/policies/shipping`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/policies/refund`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/policies/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/policies/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.2,
    },
  ];

  const collectionUrls: MetadataRoute.Sitemap = collections.map(
    (c: { handle: string; updatedAt?: string }) => ({
      url: `${BASE_URL}/categories/${c.handle}`,
      lastModified: c.updatedAt ?? now,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }),
  );

  const productUrls: MetadataRoute.Sitemap = products.map(
    (p: { handle: string; updatedAt?: string }) => ({
      url: `${BASE_URL}/products/${p.handle}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }),
  );

  return [...staticPages, ...collectionUrls, ...productUrls];
}
