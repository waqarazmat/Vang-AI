import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { StepCards } from '@/components/sections/StepCards';
import { Reveal } from '@/components/animations/Reveal';

// "How it works" dark band (design: VangAI Home.dc.html).
export function HowItWorks() {
  const t = useTranslations('home.how');
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <Reveal>
          <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[24ch] text-[54px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance text-cream">
            {t('title')}
          </h2>
          <p className="mx-0 mt-[18px] mb-0 max-w-[64ch] text-[18px] leading-[1.7] text-pretty text-cream/85">
            {t('lead')}
          </p>
        </Reveal>
        <StepCards />
      </div>
    </section>
  );
}
