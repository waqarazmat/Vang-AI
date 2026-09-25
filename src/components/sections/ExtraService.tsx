import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/animations/Reveal';

// "No website yet? We build those too." dark card (design: Home and Pricing).
// Approved fix: stacks with 24px padding at 480px and below (no sideways scroll).
export function ExtraService() {
  const t = useTranslations('extraService');
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pb-[88px]">
      <Reveal className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-x-[40px] gap-y-[28px] rounded-[24px] bg-ink p-[40px] text-cream max-480:grid-cols-[minmax(0,1fr)] max-480:p-[24px]">
        <div className="min-w-0">
          <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
          <div className="mt-[14px] text-[30px] leading-[1.1] font-[800] tracking-[-0.03em] text-cream">
            {t('title')}
          </div>
          <p className="mx-0 mt-[12px] mb-0 max-w-[52ch] text-[16.5px] leading-[1.65] text-pretty text-cream/85">
            {t('text')}
          </p>
        </div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-[20px] rounded-[20px] border border-cream/16 bg-cream/8 p-[22px] max-480:grid-cols-[minmax(0,1fr)]">
          <div
            aria-hidden="true"
            className="min-w-0 overflow-hidden rounded-[12px] bg-cream shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
          >
            <div className="flex gap-[4px] bg-sand px-[9px] py-[7px]">
              <span className="h-[6px] w-[6px] rounded-[50%] bg-coral" />
              <span className="h-[6px] w-[6px] rounded-[50%] bg-[#E8A33D]" />
              <span className="h-[6px] w-[6px] rounded-[50%] bg-[#B8AE9E]" />
            </div>
            <div className="flex flex-col gap-[7px] p-[12px]">
              <div className="h-[8px] w-[40%] rounded-[99px] bg-ink opacity-70" />
              <div className="h-[36px] rounded-[8px] bg-coral opacity-85" />
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-[5px]">
                <div className="h-[22px] rounded-[6px] bg-ink opacity-14" />
                <div className="h-[22px] rounded-[6px] bg-ink opacity-14" />
                <div className="h-[22px] rounded-[6px] bg-ink opacity-14" />
              </div>
              <div className="h-[20px] w-[20px] self-end rounded-[50%] bg-coral" />
            </div>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-[12px]">
            <div className="flex flex-wrap items-baseline gap-[8px]">
              <span className="font-mono text-[11px] tracking-[0.12em] text-cream/72 uppercase">{t('from')}</span>
              <span className="text-[32px] leading-[1] font-[800] tracking-[-0.035em] text-coral-light">€500</span>
            </div>
            <ButtonLink href="/contact" variant="primaryOnDark">
              {t('cta')}
            </ButtonLink>
            <div className="text-[14px] leading-[1.5] text-cream/75">{t('note')}</div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
