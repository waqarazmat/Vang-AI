// Every business value the site shows lives here. Values in [brackets] are
// placeholders that still need the real data before launch.

function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  const host =
    process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : process.env.VERCEL_URL;
  return host ? `https://${host}` : 'https://vang.ai';
}

export const site = {
  name: 'VangAI',
  // Absolute base for share images, canonical links, sitemap and structured data. On Vercel it
  // follows the project's production domain (vang-ai.vercel.app today, vang.ai once that domain
  // is attached); NEXT_PUBLIC_SITE_URL overrides it.
  url: siteUrl(),
  city: 'Hasselt',
  country: 'Belgium',
  countryCode: 'BE',

  email: 'sales@vangai.be',
  demoPhoneNumber: '+32 465 73 52 99',
  // Belgian enterprise number (KBO/BCE).
  companyNumber: '[company number]',

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
} as const;

export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value);
