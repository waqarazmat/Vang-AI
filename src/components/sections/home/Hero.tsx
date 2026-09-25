import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { site } from '@/config/site';
import { HeroDemos } from './HeroDemos';

// Home hero (design: VangAI Home.dc.html, #top). Entrance motion is CSS (hero-rise) so the
// headline paints on first render without waiting for JavaScript.
export function Hero() {
  const t = useTranslations('home.hero');
  const delay = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

  return (
    <div
      id="top"
      className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-center gap-x-[56px] gap-y-[48px] px-[40px] pt-[72px] pb-[96px]"
    >
      <div className="min-w-0">
        <div className="hero-rise font-mono text-[11px] tracking-[0.18em] text-coral-text uppercase" style={delay(0)}>
          {t('eyebrow')}
        </div>
        {/* One piece: splitting words into boxes breaks kerning at the word gaps. */}
        <h1
          className="hero-rise mx-0 mt-[22px] mb-0 max-w-[14ch] text-[min(76px,19.5vw)] leading-[0.94] font-[800] tracking-[-0.042em] text-balance"
          style={delay(80)}
        >
          {t('title')}
        </h1>
        <p
          className="hero-rise mx-0 mt-[24px] mb-0 max-w-[50ch] text-[20px] leading-[1.6] text-pretty text-ink/80"
          style={delay(200)}
        >
          {t('lead')}
        </p>
        <div className="hero-rise mt-[32px] flex flex-col items-start gap-[16px]" style={delay(280)}>
          <ButtonLink href="/contact" size="lg">
            {t('bookCall')}
          </ButtonLink>
          <a
            href={`tel:${site.demoPhoneNumber}`}
            className="border-b border-amber/40 pb-[2px] text-[16px] font-[700] text-amber transition-colors duration-[180ms] ease-[ease] hover:text-coral"
          >
            {t('callDemo', { number: site.demoPhoneNumber })}
          </a>
          <div className="mt-[4px] font-mono text-[11px] tracking-[0.12em] text-ink/65 uppercase">{t('trust')}</div>
        </div>
      </div>
      <HeroDemos />
    </div>
  );
}
