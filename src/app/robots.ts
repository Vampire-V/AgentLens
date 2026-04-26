import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agent-lens-murex.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/app',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
