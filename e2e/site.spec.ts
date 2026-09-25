import { expect, test } from '@playwright/test';

const PAGES = {
  nl: [
    '/nl',
    '/nl/product',
    '/nl/prijzen',
    '/nl/over-ons',
    '/nl/contact',
    '/nl/privacy',
    '/nl/cookies',
    '/nl/voorwaarden',
    '/nl/data-en-privacy',
  ],
  fr: [
    '/fr',
    '/fr/produit',
    '/fr/tarifs',
    '/fr/a-propos',
    '/fr/contact',
    '/fr/confidentialite',
    '/fr/cookies',
    '/fr/conditions',
    '/fr/donnees-et-confidentialite',
  ],
  en: [
    '/en',
    '/en/product',
    '/en/pricing',
    '/en/about',
    '/en/contact',
    '/en/privacy',
    '/en/cookies',
    '/en/terms',
    '/en/data-privacy',
  ],
} as const;
const LANG = { nl: 'nl-BE', fr: 'fr-BE', en: 'en' } as const;

for (const [locale, paths] of Object.entries(PAGES) as [keyof typeof PAGES, readonly string[]][]) {
  for (const path of paths) {
    test(`${path} renders with language, title, canonical and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', LANG[locale]);
      await expect(page).toHaveTitle(/VangAI/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://vang.ai${path}`);
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveCount(1);
      // Prefetches of pages outside the test are not errors of this page.
      expect(errors.filter((e) => !/Failed to load resource/.test(e))).toEqual([]);
    });
  }
}

test('/ redirects to the browser language, Dutch as the fallback', async ({ browser }) => {
  for (const [accept, expected] of [
    ['fr-BE,fr;q=0.9', '/fr'],
    ['en-US,en;q=0.9', '/en'],
    ['de-DE', '/nl'],
  ] as const) {
    const ctx = await browser.newContext({
      locale: accept.split(',')[0],
      extraHTTPHeaders: { 'accept-language': accept },
    });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page).toHaveURL(new RegExp(`${expected}$`));
    await ctx.close();
  }
});

test('unknown pages return the translated 404', async ({ page }) => {
  const res = await page.goto('/fr/cette-page-nexiste-pas');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Nous n’avons pas trouvé cette page.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('language switch keeps the current page', async ({ page }) => {
  await page.goto('/en/pricing');
  await page.getByRole('group', { name: 'Language' }).first().getByRole('link', { name: 'NL' }).click();
  await expect(page).toHaveURL(/\/nl\/prijzen$/);
  await expect(page.locator('h1')).toHaveText('Eenvoudige maandprijzen');
});

test('sitemap lists every page in every language with alternates', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const paths of Object.values(PAGES)) for (const p of paths) expect(xml).toContain(`https://vang.ai${p}<`);
  expect(xml).toContain('hreflang="x-default"');
});
