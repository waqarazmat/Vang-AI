import { defineRouting } from 'next-intl/routing';

export const locales = ['nl', 'fr', 'en'] as const;
export type Locale = (typeof locales)[number];

// Language tags used for <html lang>, hreflang and Open Graph.
export const htmlLang: Record<Locale, string> = { nl: 'nl-BE', fr: 'fr-BE', en: 'en' };

export const routing = defineRouting({
  locales,
  // Belgian market, based in Hasselt: Dutch is the fallback when the browser language is unknown.
  defaultLocale: 'nl',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/product': { nl: '/product', fr: '/produit', en: '/product' },
    '/pricing': { nl: '/prijzen', fr: '/tarifs', en: '/pricing' },
    '/about': { nl: '/over-ons', fr: '/a-propos', en: '/about' },
    '/contact': { nl: '/contact', fr: '/contact', en: '/contact' },
    '/privacy': { nl: '/privacy', fr: '/confidentialite', en: '/privacy' },
    '/cookies': { nl: '/cookies', fr: '/cookies', en: '/cookies' },
    '/terms': { nl: '/voorwaarden', fr: '/conditions', en: '/terms' },
    '/data-privacy': { nl: '/data-en-privacy', fr: '/donnees-et-confidentialite', en: '/data-privacy' },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
