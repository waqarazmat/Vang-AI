import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Mark } from '@/components/ui/Mark';
import { CountUp } from '@/components/animations/CountUp';
import { Reveal } from '@/components/animations/Reveal';

const ROWS = [
  ['bookings', '34'],
  ['handled', '118'],
  ['saved', 'savedValue'],
  ['value', '€1,870'],
] as const;

// "From €50 a month." with the example monthly summary card (design: VangAI Home.dc.html).
export function PricingTeaser() {
  const t = useTranslations('home.pricing');
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pb-[96px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-x-[56px] gap-y-[40px]">
        <Reveal className="min-w-0">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[22px] mb-0 text-[64px] leading-[1] font-[800] tracking-[-0.042em]">{t('title')}</h2>
          <p className="mx-0 mt-[20px] mb-0 max-w-[46ch] text-[19px] leading-[1.65] text-pretty text-ink/80">
            {t('lead')}
          </p>
          <div className="mt-[12px] font-mono text-[11px] tracking-[0.12em] text-amber uppercase">{t('vat')}</div>
          <div className="mt-[26px]">
            <ButtonLink href="/pricing">{t('cta')}</ButtonLink>
          </div>
        </Reveal>
        <Reveal className="flex min-w-0 justify-center" delay={0.12}>
          <div className="w-full max-w-[400px] rounded-[22px] border border-ink/16 bg-white p-[30px] shadow-[0_18px_40px_rgba(43,33,24,0.08)]">
            <div className="flex items-center gap-[10px] border-b border-ink/12 pb-[18px]">
              <Mark size={28} />
              <div className="text-[15px] font-[700]">VangAI</div>
              <div className="ml-auto font-mono text-[10px] font-[500] tracking-[0.1em] text-coral uppercase">
                {t('summary')}
              </div>
            </div>
            <div className="mt-[18px] font-mono text-[10px] tracking-[0.14em] text-amber uppercase">{t('month')}</div>
            <div className="mt-[10px] flex flex-col">
              {ROWS.map(([label, value], i) => (
                <div
                  key={label}
                  className={`flex items-baseline justify-between gap-[14px] py-[15px] ${i < ROWS.length - 1 ? 'border-b border-ink/10' : ''}`}
                >
                  <span className="text-[15px] text-ink/75">{t(label)}</span>
                  <CountUp
                    value={value === 'savedValue' ? t('savedValue') : value}
                    className="text-[30px] font-[800] tracking-[-0.035em] text-coral"
                  />
                </div>
              ))}
            </div>
            <div className="mt-[14px] font-mono text-[10.5px] tracking-[0.1em] text-ink/62">{t('example')}</div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
