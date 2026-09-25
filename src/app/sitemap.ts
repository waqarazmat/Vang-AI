import type { MetadataRoute } from 'next';
import { htmlLang, locales, routing, type AppPathname } from '@/i18n/routing';
import { pageUrl } from '@/lib/seo';

// Every page in every language, each with its language alternates (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.keys(routing.pathnames) as AppPathname[];
  const lastModified = new Date();
  return pages.flatMap((href) =>
    locales.map((locale) => ({
      url: pageUrl(href, locale),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: href === '/' ? 1 : href === '/product' || href === '/pricing' ? 0.9 : 0.6,
      alternates: {
        languages: Object.fromEntries([
          ...locales.map((l) => [htmlLang[l], pageUrl(href, l)]),
          ['x-default', pageUrl(href, routing.defaultLocale)],
        ]),
      },
    })),
  );
}
