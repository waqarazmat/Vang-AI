import { site } from '@/config/site';

// Structured data (schema.org) rendered into the page for search engines.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // `<` is escaped so page text can never close the script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function organizationLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/icon.png`,
    image: `${site.url}/icon.png`,
    description,
    areaServed: { '@type': 'Country', name: 'Belgium' },
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.countryCode },
    availableLanguage: ['nl', 'fr', 'en'],
  };
}

export function faqLd(entries: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((e) => ({
      '@type': 'Question',
      name: e.q,
      acceptedAnswer: { '@type': 'Answer', text: e.a },
    })),
  };
}
