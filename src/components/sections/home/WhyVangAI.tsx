import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal, RevealGroup, RevealItem } from '@/components/animations/Reveal';

const ICONS = {
  belgium: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.6" />
    </>
  ),
  languages: (
    <>
      <path d="M4 5h9v7H8l-4 3z" />
      <path d="M13 9h7v7l-3-2h-4z" />
    </>
  ),
  fast: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9.5 2.5h5" />
    </>
  ),
  terms: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M14.5 3v4.5H19M9 13l2 2 4-4" />
    </>
  ),
} as const;

// "Why businesses choose VangAI" (design: VangAI Home.dc.html).
export function WhyVangAI() {
  const t = useTranslations('home.why');
  return (
    <section className="border-y border-ink/12 bg-paper">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[72px]">
        <Reveal>
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 max-w-[24ch] text-[36px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
            {t('title')}
          </h2>
        </Reveal>
        <RevealGroup className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-[14px]">
          {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((key) => (
            <RevealItem
              key={key}
              className="card-lift flex min-w-0 flex-col gap-[14px] rounded-[20px] border border-ink/12 bg-cream p-[24px]"
            >
              <div className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[14px] bg-coral">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[key]}
                </svg>
              </div>
              <div>
                <div className="text-[19px] leading-[1.2] font-[800] tracking-[-0.022em]">{t(`${key}.title`)}</div>
                <div className="mt-[6px] text-[15.5px] leading-[1.55] text-pretty text-ink/80">{t(`${key}.text`)}</div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
