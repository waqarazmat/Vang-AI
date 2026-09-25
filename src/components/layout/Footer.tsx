import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Mark } from '@/components/ui/Mark';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { ArrowRight, ChatIcon, PhoneIcon, WhatsAppIcon } from '@/components/ui/icons';
import { site } from '@/config/site';
import { LanguageSwitch } from './LanguageSwitch';

const cards = [
  { hash: 'voice', name: 'VangVoice', key: 'voice', Icon: PhoneIcon },
  { hash: 'whatsapp', name: 'VangMessage', key: 'message', Icon: WhatsAppIcon },
  { hash: 'chat', name: 'VangChat', key: 'chat', Icon: ChatIcon },
] as const;

// Site footer, identical on every page of the design.
export function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const muted = 'text-cream/62 hover:text-cream';

  return (
    <div className="mx-auto max-w-[1200px] px-[40px] pt-[8px] pb-[40px]">
      <footer className="overflow-hidden rounded-[24px] bg-ink text-cream">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-[1px] border-b border-cream/12 bg-cream/12">
          {cards.map(({ hash, name, key, Icon }) => (
            <Link
              key={key}
              href={{ pathname: '/product', hash }}
              className="group flex min-w-0 flex-col gap-[10px] bg-ink p-[32px] text-cream transition-[background] duration-[250ms] ease-[ease] hover:bg-[#352A20] hover:text-cream"
            >
              <div className="flex items-center gap-[12px]">
                <span className="inline-flex h-[40px] w-[40px] flex-none items-center justify-center rounded-[12px] bg-coral/18 text-coral-light">
                  <Icon />
                </span>
                <span className="text-[24px] leading-[1.1] font-[800] tracking-[-0.03em] text-cream">{name}</span>
              </div>
              <span className="text-[15px] leading-[1.5] text-pretty text-[#CDBBA2]">{t(`${key}Tagline`)}</span>
              <span className="mt-[4px] inline-flex items-center gap-[8px] text-[14.5px] font-[700] text-coral-light transition-transform duration-[250ms] ease-[ease] group-hover:translate-x-[4px]">
                {t('seeProduct')} <ArrowRight />
              </span>
            </Link>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[0.02em] left-[24px] flex items-baseline font-sans text-[clamp(96px,17vw,210px)] leading-[0.78] font-[800] tracking-[-0.05em] whitespace-nowrap text-[#33281F] select-none"
          >
            VangAI
            <span className="ml-[0.05em] inline-block h-[0.15em] w-[0.15em] flex-none rounded-[50%] bg-coral opacity-55" />
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-x-[32px] gap-y-[20px] px-[32px] py-[30px]">
            <Link
              href="/"
              aria-label={nav('home')}
              className="flex items-center gap-[11px] text-cream hover:text-cream"
            >
              <Mark size={34} />
              <div className="text-[21px] font-[800] tracking-[-0.03em]">VangAI</div>
            </Link>
            <div className="flex flex-wrap items-center gap-x-[28px] gap-y-[10px]">
              <Link href="/pricing" className="text-[16px] font-[500] text-cream/88 hover:text-coral-light">
                {nav('pricing')}
              </Link>
              <Link href="/about" className="text-[16px] font-[500] text-cream/88 hover:text-coral-light">
                {nav('about')}
              </Link>
              <Link href="/contact" className="text-[16px] font-[500] text-cream/88 hover:text-coral-light">
                {t('contact')}
              </Link>
              <a href={`mailto:${site.email}`} className="text-[16px] font-[600] text-coral-light hover:text-cream">
                {site.email}
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-[12px]">
              <LanguageSwitch dark />
              <ButtonLink href="/contact" variant="primaryOnDark">
                {nav('bookCall')}
              </ButtonLink>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center justify-between gap-x-[20px] gap-y-[12px] border-t border-cream/12 px-[32px] pt-[16px] pb-[20px] font-mono text-[10.5px] tracking-[0.1em] text-cream/62 uppercase">
            <span>{t('copyright', { companyNumber: site.companyNumber })}</span>
            <div className="flex flex-wrap items-center gap-[18px]">
              <Link href="/privacy" className={muted}>
                {t('privacy')}
              </Link>
              <Link href="/cookies" className={muted}>
                {t('cookies')}
              </Link>
              <Link href="/terms" className={muted}>
                {t('terms')}
              </Link>
              <Link href="/data-privacy" className={muted}>
                {t('dataPrivacy')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
