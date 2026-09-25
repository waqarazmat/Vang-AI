import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CtaBand } from '@/components/sections/CtaBand';
import { site } from '@/config/site';

export type LegalKey = 'privacy' | 'cookies' | 'terms' | 'dataPrivacy';
type Section = { title: string; text?: string; before?: string; after?: string };

/**
 * Shared template of the four legal pages (design: VangAI Privacy / Cookies / Terms /
 * Data and Privacy). Sections with an email address carry the text before and after it.
 */
export function LegalPage({ page }: { page: LegalKey }) {
  const t = useTranslations(`legal.${page}`);
  const legal = useTranslations('legal');
  const sections = t.raw('sections') as Section[];
  return (
    <main>
      <div id="top" className="mx-auto max-w-[1200px] px-[40px] pt-[80px] pb-[56px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        {/* Approved fix: scales below about 540px so no word runs off a phone. */}
        <h1 className="mx-0 mt-[24px] mb-0 max-w-[20ch] text-[min(62px,11.5vw)] leading-[0.99] font-[800] tracking-[-0.04em] text-balance">
          {t('title')}
        </h1>
        <p className="mx-0 mt-[22px] mb-0 max-w-[54ch] text-[20px] leading-[1.6] text-pretty text-ink/78">
          {t('lead')}
        </p>
        <div className="mt-[26px] inline-flex items-center gap-[10px] rounded-[99px] border border-dashed border-coral px-[16px] py-[8px] font-mono text-[11px] tracking-[0.12em] text-coral-deep uppercase">
          {legal('draft')}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-[40px] pb-[24px]">
        {sections.map((s) => (
          <div
            key={s.title}
            className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-x-[56px] gap-y-[12px] border-t border-ink/16 py-[34px]"
          >
            <h2 className="m-0 max-w-[20ch] text-[26px] leading-[1.15] font-[800] tracking-[-0.028em] text-balance">
              {s.title}
            </h2>
            <div className="flex min-w-0 flex-col gap-[12px]">
              <p className="m-0 max-w-[64ch] text-[17px] leading-[1.7] text-pretty text-ink/82">
                {s.before !== undefined ? (
                  <>
                    {`${s.before} `}
                    <a href={`mailto:${site.email}`} className="font-[600] text-coral-deep">
                      {site.email}
                    </a>
                    {s.after}
                  </>
                ) : (
                  s.text?.replaceAll('{companyNumber}', site.companyNumber)
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
      <CtaBand title={legal('cta.title')} text={legal('cta.text')} cta={legal('cta.button')} tone="coral" />
    </main>
  );
}
