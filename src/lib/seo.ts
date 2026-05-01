import type { Metadata } from 'next';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://agent-lens-murex.vercel.app';

export function buildOgImageUrl(
  params:
    | { type: 'default' }
    | { type: 'guide'; title: string; framework: string }
): string {
  if (params.type === 'default') {
    return `${SITE_URL}/api/og`;
  }
  const url = new URL(`${SITE_URL}/api/og`);
  url.searchParams.set('type', 'guide');
  url.searchParams.set('title', params.title);
  url.searchParams.set('framework', params.framework);
  return url.toString();
}

export function buildPageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  ogImageUrl: string;
  ogImageAlt: string;
  ogType?: 'website' | 'article';
  article?: { publishedTime?: string; modifiedTime?: string };
}): Pick<Metadata, 'openGraph' | 'twitter' | 'alternates'> {
  const { title, description, path, ogImageUrl, ogImageAlt, ogType = 'website', article } = opts;
  return {
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: ogType,
      siteName: 'AgentLens',
      locale: 'en_US',
      title,
      description,
      url: path,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: ogImageAlt }],
      ...(article ?? {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImageUrl, alt: ogImageAlt }],
    },
  };
}
