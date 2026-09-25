import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/icons';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('meta.notFound');
  return { title: t('title'), description: t('description'), robots: { index: false, follow: true } };
}

// 404 in the site's own visual language (the design has no 404 page).
export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main>
      <div className="mx-auto max-w-[1200px] px-[40px] pt-[80px] pb-[104px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mx-0 mt-[24px] mb-0 max-w-[20ch] text-[min(62px,11.5vw)] leading-[0.99] font-[800] tracking-[-0.04em] text-balance">
          {t('title')}
        </h1>
        <p className="mx-0 mt-[22px] mb-0 max-w-[54ch] text-[20px] leading-[1.6] text-pretty text-ink/78">
          {t('lead')}
        </p>
        <div className="mt-[32px] flex flex-wrap gap-[12px]">
          <ButtonLink href="/">{t('home')}</ButtonLink>
          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-[9px] rounded-[99px] border border-ink/35 bg-transparent px-[26px] py-[14px] text-[15px] font-[600] whitespace-nowrap text-ink transition-[background,color,border-color] duration-[180ms] ease-[ease] hover:border-ink hover:bg-ink hover:text-cream"
          >
            {t('bookCall')} <ArrowRight />
          </Link>
        </div>
      </div>
    </main>
  );
}
