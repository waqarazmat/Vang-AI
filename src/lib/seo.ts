import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { htmlLang, locales, routing, type AppPathname, type Locale } from '@/i18n/routing';
import { site } from '@/config/site';

/** Absolute URL of a page in one language, e.g. ('/pricing', 'nl') -> https://vang.ai/nl/prijzen */
export function pageUrl(href: AppPathname, locale: Locale) {
  return site.url + getPathname({ href, locale });
}

/**
 * Title, description, canonical, hreflang alternates (nl-BE, fr-BE, en, x-default -> Dutch),
 * Open Graph and Twitter tags for one page. `key` is the page's namespace under `meta`.
 */
export async function pageMetadata(locale: Locale, href: AppPathname, key: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `meta.${key}` });
  const title = t('title');
  const description = t('description');
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = pageUrl(href, l);
  languages['x-default'] = pageUrl(href, routing.defaultLocale);

  return {
    title,
    description,
    alternates: { canonical: pageUrl(href, locale), languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url: pageUrl(href, locale),
      locale: htmlLang[locale].replace('-', '_'),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}
