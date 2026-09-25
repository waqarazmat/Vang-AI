import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

// Share image per language, drawn like the design's assets/og-image.png:
// dark ground, wordmark, headline, coral channel line, coral bottom bar and the cream mark.
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'VangAI';

const file = (...p: string[]) => readFile(path.join(process.cwd(), ...p));

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const og = await getTranslations({ locale, namespace: 'meta.og' });
  const [archivo800, archivo700, mono, mark] = await Promise.all([
    file('src/app/fonts/og/archivo-800.woff'),
    file('src/app/fonts/og/archivo-700.woff'),
    file('src/app/fonts/og/ibm-plex-mono-400.woff'),
    file('public/brand/mark-cream.png'),
  ]);
  const markSrc = `data:image/png;base64,${mark.toString('base64')}`;

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: '#2B2118' }}>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '86px 0 0 90px', width: 800 }}>
        <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: 48, color: '#FAEEDA', letterSpacing: '0px' }}>
          VangAI
        </div>
        <div
          style={{
            fontFamily: 'Archivo',
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 1.08,
            color: '#FAEEDA',
            marginTop: 84,
            letterSpacing: '0px',
          }}
        >
          {t('title')}
        </div>
        <div
          style={{
            fontFamily: 'Plex Mono',
            fontSize: 21,
            color: '#E8763F',
            marginTop: 58,
            letterSpacing: '0.5px',
          }}
        >
          {og('channels')}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
      <img src={markSrc} width={228} height={254} style={{ position: 'absolute', left: 880, top: 152 }} alt="" />
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: 1200, height: 40, background: '#D85A30' }} />
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Archivo', data: archivo800, weight: 800, style: 'normal' },
        { name: 'Archivo', data: archivo700, weight: 700, style: 'normal' },
        { name: 'Plex Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  );
}
