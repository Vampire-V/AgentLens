import type { MetadataRoute } from 'next';
import { GUIDES } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agent-lens-murex.vercel.app';

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE}/guides`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...GUIDES.map((guide) => ({
      url: `${BASE}/guides/${guide.slug}`,
      lastModified: new Date(guide.lastModified),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];

  return routes;
}
