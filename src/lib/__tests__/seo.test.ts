import { describe, it, expect, vi, afterEach } from 'vitest';
import { SITE_URL, buildOgImageUrl, buildPageMetadata } from '../seo';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('SITE_URL', () => {
  it('no_env__SITE_URL__returns_default_vercel_url', () => {
    expect(SITE_URL).toContain('agent-lens');
  });
});

describe('buildOgImageUrl', () => {
  it('default_type__buildOgImageUrl__returns_base_og_url', () => {
    const url = buildOgImageUrl({ type: 'default' });
    expect(url).toBe(`${SITE_URL}/api/og`);
  });

  it('guide_type__buildOgImageUrl__includes_type_title_framework_params', () => {
    const url = buildOgImageUrl({
      type: 'guide',
      title: 'How to Visualize CrewAI',
      framework: 'CrewAI',
    });
    const parsed = new URL(url);
    expect(parsed.searchParams.get('type')).toBe('guide');
    expect(parsed.searchParams.get('title')).toBe('How to Visualize CrewAI');
    expect(parsed.searchParams.get('framework')).toBe('CrewAI');
  });

  it('guide_type_with_special_chars__buildOgImageUrl__encodes_params_correctly', () => {
    const url = buildOgImageUrl({
      type: 'guide',
      title: 'How to Visualize LangGraph & More',
      framework: 'LangGraph',
    });
    expect(() => new URL(url)).not.toThrow();
    const parsed = new URL(url);
    expect(parsed.searchParams.get('title')).toBe('How to Visualize LangGraph & More');
  });
});

describe('buildPageMetadata', () => {
  const baseOpts = {
    title: 'AgentLens',
    description: 'Visualize AI agents',
    path: '/',
    ogImageUrl: 'https://example.com/api/og',
    ogImageAlt: 'AgentLens preview',
  };

  it('default_opts__buildPageMetadata__returns_canonical_alternates', () => {
    const result = buildPageMetadata(baseOpts);
    expect(result.alternates?.canonical).toBe('/');
  });

  it('default_opts__buildPageMetadata__sets_website_og_type', () => {
    const result = buildPageMetadata(baseOpts);
    const og = result.openGraph as Record<string, unknown>;
    expect(og['type']).toBe('website');
  });

  it('article_ogType__buildPageMetadata__sets_article_og_type', () => {
    const result = buildPageMetadata({ ...baseOpts, ogType: 'article' });
    const og = result.openGraph as Record<string, unknown>;
    expect(og['type']).toBe('article');
  });

  it('default_opts__buildPageMetadata__includes_siteName_and_locale', () => {
    const result = buildPageMetadata(baseOpts);
    expect(result.openGraph?.siteName).toBe('AgentLens');
    expect(result.openGraph?.locale).toBe('en_US');
  });

  it('default_opts__buildPageMetadata__sets_twitter_summary_large_image', () => {
    const result = buildPageMetadata(baseOpts);
    const tw = result.twitter as Record<string, unknown>;
    expect(tw['card']).toBe('summary_large_image');
  });

  it('default_opts__buildPageMetadata__passes_title_and_description_to_og_and_twitter', () => {
    const result = buildPageMetadata(baseOpts);
    expect(result.openGraph?.title).toBe('AgentLens');
    expect(result.openGraph?.description).toBe('Visualize AI agents');
    expect(result.twitter?.title).toBe('AgentLens');
    expect(result.twitter?.description).toBe('Visualize AI agents');
  });

  it('guide_path__buildPageMetadata__sets_canonical_to_guide_path', () => {
    const result = buildPageMetadata({
      ...baseOpts,
      path: '/guides/visualize-crewai',
    });
    expect(result.alternates?.canonical).toBe('/guides/visualize-crewai');
  });

  it('article_with_dates__buildPageMetadata__spreads_article_fields_into_og', () => {
    const result = buildPageMetadata({
      ...baseOpts,
      ogType: 'article',
      article: { publishedTime: '2026-04-27', modifiedTime: '2026-04-27' },
    });
    const og = result.openGraph as Record<string, unknown>;
    expect(og['publishedTime']).toBe('2026-04-27');
    expect(og['modifiedTime']).toBe('2026-04-27');
  });

  it('no_article__buildPageMetadata__og_has_no_extra_keys', () => {
    const result = buildPageMetadata(baseOpts);
    const og = result.openGraph as Record<string, unknown>;
    expect(og['publishedTime']).toBeUndefined();
    expect(og['modifiedTime']).toBeUndefined();
  });
});
