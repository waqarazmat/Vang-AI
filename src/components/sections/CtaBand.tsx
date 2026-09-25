import { ButtonLink } from '@/components/ui/ButtonLink';
import { CatchMark } from '@/components/animations/CatchMark';
import { Reveal } from '@/components/animations/Reveal';

/**
 * Closing call to action with the large cream mark (design: every page, before the footer).
 * Dark on most pages, coral on the legal pages.
 */
export function CtaBand({
  title,
  text,
  cta,
  tone = 'dark',
}: {
  title: string;
  text: string;
  cta: string;
  tone?: 'dark' | 'coral';
}) {
  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[88px] pb-[104px]">
      <div
        className={`grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-center gap-x-[40px] gap-y-[36px] rounded-[28px] px-[56px] py-[64px] ${
          tone === 'coral' ? 'bg-coral' : 'bg-ink'
        }`}
      >
        <Reveal className="flex min-w-0 flex-col items-start">
          <h2 className="m-0 max-w-[20ch] text-[48px] leading-[1.02] font-[800] tracking-[-0.04em] text-balance text-cream">
            {title}
          </h2>
          <p className="mx-0 mt-[18px] mb-[30px] max-w-[44ch] text-[18px] leading-[1.6] text-pretty text-cream">
            {text}
          </p>
          <ButtonLink href="/contact" variant={tone === 'coral' ? 'dark' : 'primaryOnDark'}>
            {cta}
          </ButtonLink>
        </Reveal>
        <div className="flex min-w-0 justify-center">
          <CatchMark size={180} dotClass={tone === 'coral' ? 'bg-cream' : 'bg-coral'} />
        </div>
      </div>
    </div>
  );
}
