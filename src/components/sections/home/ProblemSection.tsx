import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GarageScene } from './GarageScene';

// "The problem" (design: VangAI Home.dc.html, white band after the hero).
export function ProblemSection() {
  const t = useTranslations('home.problem');
  return (
    <section className="border-y border-ink/10 bg-white">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[96px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="mx-0 mt-[18px] mb-0 max-w-[24ch] text-[54px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
          {t('title')}
        </h2>
        <p className="mx-0 mt-[18px] mb-0 max-w-[62ch] text-[18px] leading-[1.7] text-pretty text-ink/80">
          {t('lead')}
        </p>
        <div className="mt-[40px]">
          <GarageScene />
        </div>
      </div>
      <div className="mx-auto mt-[120px] mb-[8px] flex max-w-[760px] flex-col items-center gap-[16px] text-center">
        <div className="h-[4px] w-[48px] rounded-[99px] bg-coral" />
        <p className="m-0 text-[44px] leading-[1.08] font-[800] tracking-[-0.035em] text-balance text-ink">
          {/* One text node before the span: a separate space node shifts the line by 1/64px. */}
          {`${t('goodNews')} `}
          <span className="text-coral">{t('goodNewsHighlight')}</span>.
        </p>
        <p className="m-0 max-w-[48ch] text-[19px] leading-[1.6] text-pretty text-ink/78">{t('goodNewsLead')}</p>
      </div>
    </section>
  );
}
