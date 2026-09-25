import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/icons';
import { Faq, type FaqEntry } from '@/components/ui/Faq';
import { CheckIcon } from '@/components/sections/product/listIcons';
import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';

// Values from the design (VangAI Pricing.dc.html).

const INCLUDE_ICONS = [
  <>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </>,
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </>,
  <>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 16v-4M12 16V9M16 16v-6" />
  </>,
  <>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M20 20v-4h-4" />
  </>,
  <>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="13" width="4" height="6" rx="1.5" />
    <rect x="17" y="13" width="4" height="6" rx="1.5" />
    <path d="M19 19c0 1.2-1.5 2-4 2h-2" />
  </>,
];

const outline =
  'inline-flex items-center justify-center gap-[9px] rounded-[99px] border px-[26px] py-[14px] text-[15px] font-[600] whitespace-nowrap transition-[background,color,border-color] duration-[180ms] ease-[ease]';

export function PricingIntro() {
  const t = useTranslations('pricing');
  return (
    <div
      id="top"
      className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] items-end gap-x-[64px] gap-y-[28px] px-[40px] pt-[80px] pb-[48px]"
    >
      <Reveal className="min-w-0">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mx-0 mt-[24px] mb-0 max-w-[14ch] text-[66px] leading-[0.98] font-[800] tracking-[-0.042em] text-balance">
          {t('title')}
        </h1>
      </Reveal>
      <Reveal className="min-w-0" delay={0.1}>
        <p className="m-0 max-w-[56ch] text-[18px] leading-[1.7] text-pretty text-ink/82">{t('lead')}</p>
        <div className="mt-[16px] font-mono text-[11px] tracking-[0.12em] text-amber uppercase">{t('terms')}</div>
      </Reveal>
    </div>
  );
}

type PlanKey = 'chat' | 'whatsapp' | 'voice' | 'bundle';
const PLANS: { key: PlanKey; name?: string }[] = [
  { key: 'chat', name: 'VangChat' },
  { key: 'whatsapp', name: 'VangMessage' },
  { key: 'voice', name: 'VangVoice' },
  { key: 'bundle' },
];

function Plan({ plan }: { plan: (typeof PLANS)[number] }) {
  const t = useTranslations('pricing');
  const bundle = plan.key === 'bundle';
  const items = t.raw(`plans.${plan.key}.items`) as string[];
  return (
    <RevealItem
      className={`card-lift relative flex min-w-0 flex-col gap-[16px] rounded-[24px] ${
        bundle
          ? 'border-[3px] border-coral bg-ink px-[26px] py-[28px] text-cream shadow-[0_24px_50px_rgba(216,90,48,0.28),0_6px_16px_rgba(43,33,24,0.12)]'
          : 'border border-ink/18 bg-cream px-[28px] py-[30px] text-ink'
      }`}
    >
      {bundle && (
        <div className="absolute top-[-15px] left-[24px] rounded-[99px] bg-coral px-[14px] py-[7px] font-mono text-[10.5px] tracking-[0.16em] text-white uppercase">
          {t('recommended')}
        </div>
      )}
      <div className={`text-[26px] leading-[1.1] font-[800] tracking-[-0.03em] ${bundle ? 'text-cream' : 'text-ink'}`}>
        {bundle ? t('plans.bundle.name') : plan.name}
      </div>
      <div
        className={`mb-[14px] grid grid-cols-[auto_1fr] items-baseline gap-x-[8px] gap-y-[4px] border-b pb-[22px] ${
          bundle ? 'border-cream/20' : 'border-ink/15'
        }`}
      >
        <span
          className={`font-mono text-[11px] tracking-[0.1em] uppercase ${bundle ? 'text-cream/72' : 'text-ink/68'}`}
        >
          {t('from')}
        </span>
        <span
          className={`text-[52px] leading-[0.95] font-[800] tracking-[-0.045em] ${bundle ? 'text-coral-light' : 'text-coral'}`}
        >
          {t(`plans.${plan.key}.price`)}
        </span>
        <span className={`col-[2] text-[14.5px] whitespace-nowrap ${bundle ? 'text-cream/72' : 'text-ink/68'}`}>
          {t('perMonth')}
        </span>
      </div>
      <div className="flex flex-col">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-[10px] py-[7px]">
            <CheckIcon color={bundle ? '#E8763F' : '#D85A30'} />
            <span className={`text-[15px] leading-[1.5] text-pretty ${bundle ? 'text-cream/90' : 'text-ink/86'}`}>
              {item}
            </span>
          </div>
        ))}
      </div>
      {bundle && (
        <div className="border-t border-dashed border-cream/20 pt-[12px] text-[14px] leading-[1.5] font-[600] text-pretty text-cream">
          {t('plans.bundle.save')}
        </div>
      )}
      <div className="mt-auto flex pt-[8px]">
        <Link
          href="/contact"
          className={`group ${outline} box-border w-full ${
            bundle
              ? 'border-coral bg-coral text-white hover:border-cream hover:bg-cream hover:text-ink'
              : 'border-ink/35 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream'
          }`}
        >
          {t('requestQuote')} <ArrowRight />
        </Link>
      </div>
    </RevealItem>
  );
}

export function Plans() {
  const t = useTranslations('pricing');
  const includes = t.raw('includes') as string[];
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[16px] pb-[72px]">
      <div className="mb-[40px] flex flex-col gap-[16px] rounded-[22px] border border-ink/12 bg-paper px-[26px] pt-[22px] pb-[24px]">
        <div className="font-mono text-[11px] tracking-[0.14em] text-amber uppercase">{t('includesTitle')}</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-x-[22px] gap-y-[16px]">
          {includes.map((item, i) => (
            <div key={item} className="flex min-w-0 items-center gap-[12px]">
              <span className="inline-flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[12px] bg-coral/12">
                <svg
                  viewBox="0 0 24 24"
                  width="19"
                  height="19"
                  fill="none"
                  stroke="#D85A30"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {INCLUDE_ICONS[i]}
                </svg>
              </span>
              <span className="text-[15px] leading-[1.35] font-[600] text-pretty text-ink">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <RevealGroup className="grid grid-cols-[repeat(4,minmax(0,1fr))] items-stretch gap-[20px] max-1100:grid-cols-[repeat(2,minmax(0,1fr))] max-1100:gap-y-[32px] max-640:grid-cols-[minmax(0,1fr)]">
        {PLANS.map((plan) => (
          <Plan key={plan.key} plan={plan} />
        ))}
      </RevealGroup>
      <div className="mt-[20px] flex flex-wrap items-center gap-x-[20px] gap-y-[12px] rounded-[18px] border border-dashed border-coral/55 bg-paper px-[24px] py-[18px]">
        <span className="flex-none rounded-[99px] bg-coral px-[12px] py-[6px] font-mono text-[10.5px] tracking-[0.14em] text-white uppercase">
          {t('addon.badge')}
        </span>
        <span className="flex-none text-[17px] font-[800] tracking-[-0.02em]">{t('addon.title')}</span>
        <span className="min-w-0 flex-[1_1_320px] text-[15.5px] leading-[1.55] text-pretty text-ink/82">
          {t('addon.text')}
        </span>
      </div>
    </div>
  );
}

export function SupportBand() {
  const t = useTranslations('pricing.support');
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-x-[64px] gap-y-[24px] px-[40px] py-[72px]">
        <Reveal className="min-w-0">
          <Eyebrow onDark>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[16ch] text-[38px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance text-cream">
            {t('title')}
          </h2>
        </Reveal>
        <p className="m-0 min-w-0 text-[18px] leading-[1.7] text-pretty text-cream/86">{t('text')}</p>
      </div>
    </section>
  );
}

export function SetupOptions() {
  const t = useTranslations('pricing.setup');
  const options = [
    { key: 'option1', recommended: true },
    { key: 'option2', recommended: false },
  ] as const;
  const p = useTranslations('pricing');
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[80px] pb-[72px]">
      <Reveal>
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
          {t('title')}
        </h2>
        <p className="mx-0 mt-[18px] mb-0 max-w-[60ch] text-[18px] leading-[1.7] text-pretty text-ink/80">
          {t('lead')}
        </p>
      </Reveal>
      <RevealGroup className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-stretch gap-[20px]">
        {options.map(({ key, recommended }) => (
          <RevealItem
            key={key}
            className={`card-lift flex min-w-0 flex-col gap-[14px] rounded-[24px] p-[30px] ${
              recommended ? 'border-[2px] border-coral bg-paper' : 'border border-ink/18 bg-cream'
            }`}
          >
            <div className="flex flex-wrap items-center gap-[10px]">
              <span className="font-mono text-[10.5px] tracking-[0.12em] text-amber uppercase">
                {t(`${key}.label`)}
              </span>
              {recommended && (
                <span className="rounded-[99px] bg-coral px-[11px] py-[5px] font-mono text-[10px] tracking-[0.14em] text-white uppercase">
                  {p('recommended')}
                </span>
              )}
            </div>
            <div className="text-[26px] leading-[1.12] font-[800] tracking-[-0.032em] text-balance">
              {t(`${key}.title`)}
            </div>
            <div className="border-b border-ink/15 pb-[14px] text-[24px] font-[800] tracking-[-0.03em] text-coral">
              {t('onQuote')}
            </div>
            <p className="m-0 text-[16.5px] leading-[1.65] text-pretty text-ink/82">{t(`${key}.text`)}</p>
            <div className="mt-auto pt-[6px]">
              {recommended ? (
                <ButtonLink href="/contact">{p('requestQuote')}</ButtonLink>
              ) : (
                <Link
                  href="/contact"
                  className={`group ${outline} border-ink/35 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-cream`}
                >
                  {p('requestQuote')} <ArrowRight />
                </Link>
              )}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}

export function PricingFaq() {
  const t = useTranslations('pricing.faq');
  return (
    <section className="border-y border-ink/12 bg-sand">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <Reveal>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
            {t('title')}
          </h2>
        </Reveal>
        <Reveal className="mt-[30px] max-w-[880px]" delay={0.1}>
          <Faq entries={t.raw('items') as FaqEntry[]} variant="light" />
        </Reveal>
      </div>
    </section>
  );
}
