// Every business value the site shows lives here. Values in [brackets] are
// placeholders that still need the real data before launch.

export const site = {
  name: 'VangAI',
  url: 'https://vang.ai',
  city: 'Hasselt',
  country: 'Belgium',
  countryCode: 'BE',

  email: '[email address]',
  demoPhoneNumber: '[demo number]',
  companyNumber: '[company number]',

  booking: {
    // 'calcom' or 'calendly'. Leave `url` empty to show the design's calendar placeholder.
    provider: 'calcom' as 'calcom' | 'calendly',
    url: '',
    durationMinutes: 20,
  },

  contactForm: {
    // Where contact form messages are delivered. The API key comes from RESEND_API_KEY.
    to: '[email address]',
    from: 'VangAI website <website@vang.ai>',
  },

  // Final demo call audio (Product page, VangVoice card).
  demoCallAudio: '/audio/voice-demo.wav',
} as const;

export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value);
