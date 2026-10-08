// Every business value the site shows lives here. Values in [brackets] are
// placeholders that still need the real data before launch.

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const host =
    process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return host ? `https://${host}` : 'https://vangai.be';
}

export const site = {
  name: 'VangAI',
  // Absolute base for share images, canonical links, sitemap and structured data. On Vercel it
  // follows the project's production domain (vang-ai.vercel.app today, vangai.be once that domain
  // is attached); NEXT_PUBLIC_SITE_URL overrides it.
  url: siteUrl(),
  city: 'Hasselt',
  country: 'Belgium',
  countryCode: 'BE',

  email: 'sales@vangai.be',
  demoPhoneNumber: '+32 465 73 52 99',
  // Belgian enterprise number (KBO/BCE), e.g. '0123.456.789'. Empty: the footer and the Privacy
  // page leave it out.
  companyNumber: '',

  booking: {
    // 'calcom' or 'calendly'. Leave `url` empty to show the design's calendar placeholder.
    provider: 'calcom' as 'calcom' | 'calendly',
    url: '',
    durationMinutes: 20,
  },

  contactForm: {
    // Where contact form messages are delivered. The API key comes from RESEND_API_KEY.
    to: 'sales@vangai.be',
    // The sending domain (vangai.be) must be verified in Resend.
    from: 'VangAI website <website@vangai.be>',
  },

  // Final demo call audio (Product page, VangVoice card).
  demoCallAudio: '/audio/voice-demo.wav',

  // Live voice agent behind "Call the assistant" (Retell web call, src/lib/assistant/voice.ts).
  // The public key is meant for the browser: Retell only accepts it from the domains allowed on
  // it in the Retell dashboard. NEXT_PUBLIC_RETELL_PUBLIC_KEY overrides it; empty keeps the
  // scripted demo.
  // GenAITech chat widget, loaded on every page (src/app/[locale]/layout.tsx). Empty `src`
  // leaves it out.
  chatWidget: {
    src: 'https://genaitech.be/widget/cw.js',
    orgId: 'bcaa0e6d-6842-46a7-aff2-dab8d3c01c66',
    primaryColor: '#372D24',
    secondaryColor: '#F3E4CC',
    radius: '14',
    // The widget's backend (passed as data-api-base). Empty: cw.js uses its built-in default.
    apiBase: 'https://api.vangai.be',
  },

  voiceAgent: {
    agentId: 'agent_4f4de5e4e836b86e1c38ad9b14',
    publicKey: process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY ?? 'public_key_b35448c85ed653e77f71f',
  },
} as const;

export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value);

/**
 * Fills {companyNumber} in a message. Without a number, the whole clause goes: ", {companyNumber}"
 * and ", company number {companyNumber}" (and its Dutch and French forms) are removed.
 */
export const withCompanyNumber = (text: string) =>
  site.companyNumber
    ? text.replaceAll('{companyNumber}', site.companyNumber)
    : text.replace(/,[^,.]*\{companyNumber\}/g, '');
