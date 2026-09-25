import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/icons';
import { StepCards } from '@/components/sections/StepCards';
import { site } from '@/config/site';

// Values from the design (VangAI About.dc.html).

export function AboutIntro() {
  const t = useTranslations('about');
  return (
    <>
      <div id="top" className="mx-auto max-w-[1200px] px-[40px] pt-[80px] pb-[56px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        {/* Approved fix: scales below 378px so no word runs off a small phone. */}
        <h1 className="mx-0 mt-[24px] mb-0 max-w-[20ch] text-[min(62px,16.4vw)] leading-[0.99] font-[800] tracking-[-0.04em] text-balance">
          {t('title')}
        </h1>
        <p className="mx-0 mt-[22px] mb-0 max-w-[54ch] text-[20px] leading-[1.6] text-pretty text-ink/78">
          {t('lead')}
        </p>
      </div>
      <div className="mx-auto max-w-[1200px] px-[40px] pb-[88px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[20px]">
          <div className="min-w-0 rounded-[26px] bg-ink p-[40px] text-cream">
            <Eyebrow onDark>{t('mission.eyebrow')}</Eyebrow>
            <p className="mx-0 mt-[18px] mb-0 text-[25px] leading-[1.35] font-[700] tracking-[-0.022em] text-pretty text-cream">
              {t('mission.text')}
            </p>
          </div>
          <div className="min-w-0 rounded-[26px] border border-ink/12 bg-paper p-[40px]">
            <div className="font-mono text-[11px] tracking-[0.18em] text-amber uppercase">{t('vision.eyebrow')}</div>
            <p className="mx-0 mt-[18px] mb-0 text-[25px] leading-[1.35] font-[700] tracking-[-0.022em] text-pretty">
              {t('vision.text')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Values() {
  const t = useTranslations('about.values');
  const items = t.raw('items') as { title: string; text: string }[];
  return (
    <section className="border-y border-ink/12 bg-sand">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
          {t('title')}
        </h2>
        <div className="mt-[34px] grid grid-cols-[repeat(auto-fit,minmax(min(210px,100%),1fr))] gap-[14px]">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="flex min-w-0 flex-col gap-[10px] rounded-[20px] border border-ink/12 bg-cream p-[24px]"
            >
              <div className="font-mono text-[11px] text-coral-text">0{i + 1}</div>
              <div className="text-[19px] leading-[1.2] font-[800] tracking-[-0.022em] text-balance">{item.title}</div>
              <div className="text-[15.5px] leading-[1.55] text-pretty text-ink/80">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowWeWork() {
  const t = useTranslations('about.how');
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
        <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance text-cream">
          {t('title')}
        </h2>
        <StepCards />
      </div>
    </section>
  );
}

export function AboutContact() {
  const t = useTranslations('about.contact');
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[88px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-x-[56px] gap-y-[24px] border-y border-ink/18 py-[48px]">
        <div className="min-w-0">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[16ch] text-[44px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
            {t('title')}
          </h2>
        </div>
        <div className="flex min-w-0 flex-col items-start gap-[20px]">
          <p className="m-0 max-w-[50ch] text-[18px] leading-[1.65] text-pretty text-ink/82">{t('text')}</p>
          <div className="flex flex-wrap gap-[12px]">
            <ButtonLink href="/contact">{t('bookCall')}</ButtonLink>
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center justify-center gap-[9px] rounded-[99px] border border-ink/35 bg-transparent px-[26px] py-[14px] text-[15px] font-[600] whitespace-nowrap text-ink transition-[background,color,border-color] duration-[180ms] ease-[ease] hover:border-ink hover:bg-ink/5 hover:text-ink"
            >
              {site.email} <ArrowRight />
            </a>
          </div>
          <div className="font-mono text-[11px] tracking-[0.12em] text-amber uppercase">{t('based')}</div>
        </div>
      </div>
    </div>
  );
}
