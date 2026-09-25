import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowRight } from '@/components/ui/icons';
import { Faq } from '@/components/ui/Faq';
import { PauseOffscreen } from '@/components/animations/PauseOffscreen';
import { WhyBoxes } from './WhyBoxes';
import { CheckIcon } from './listIcons';

// Values from the design (VangAI Product.dc.html).

export function CheckList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-[2px]">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-[12px] py-[8px]">
          <CheckIcon />
          <span className="text-[16.5px] leading-[1.55] text-pretty text-ink/86">{item}</span>
        </div>
      ))}
    </div>
  );
}

const CARD_ICONS = {
  voice: (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden="true"
      fill="none"
      stroke="#D85A30"
      strokeWidth="1.9"
      strokeLinecap="round"
    >
      <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
      <path d="M17 2.4c1.7.6 3 1.9 3.6 3.6M15.4 5.4c1 .4 1.7 1.1 2.1 2.1" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="#25D366">
      <path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 1.9a7.8 7.8 0 1 1-4 14.5l-.4-.2-2.8.7.8-2.7-.2-.4A7.8 7.8 0 0 1 12 4.1z" />
      <path d="M9.3 7.6c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 2.9.6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5l-.6-1.5z" />
    </svg>
  ),
  chat: (
    <svg
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden="true"
      fill="none"
      stroke="#854F0B"
      strokeWidth="1.9"
      strokeLinecap="round"
    >
      <rect x="2.5" y="4" width="19" height="15" rx="2.6" />
      <path d="M2.5 8.6h19M5.6 6.3h.01M8.1 6.3h.01" />
      <path d="M7 12.4h7M7 15.4h4.5" />
    </svg>
  ),
} as const;

const CARDS = [
  { key: 'voice', name: 'VangVoice', cls: 'pc-v' },
  { key: 'whatsapp', name: 'VangMessage', cls: 'pc-m' },
  { key: 'chat', name: 'VangChat', cls: 'pc-c' },
] as const;

function CardArt({ kind }: { kind: 'voice' | 'whatsapp' | 'chat' }) {
  const o = (n: number) => ({ '--o': n }) as React.CSSProperties;
  if (kind === 'voice')
    return (
      <div className="pc-wave">
        {Array.from({ length: 16 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
    );
  if (kind === 'whatsapp')
    return (
      <div className="pc-bub">
        <i style={o(0)} />
        <i style={o(1)} />
        <i style={o(2)} />
      </div>
    );
  return (
    <div className="pc-win">
      <div className="pc-bar">
        <span />
        <span />
        <span />
      </div>
      <div className="pc-lines">
        <i style={o(0)} />
        <i style={o(1)} />
        <i style={o(2)} />
      </div>
      <div className="pc-dots">
        <b />
        <b />
        <b />
      </div>
    </div>
  );
}

// Page intro and the three channel cards.
export function ProductOverview() {
  const t = useTranslations('product');
  return (
    <>
      <div id="top" className="mx-auto max-w-[1200px] px-[40px] pt-[80px] pb-[36px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mx-0 mt-[24px] mb-0 max-w-[20ch] text-[62px] leading-[0.99] font-[800] tracking-[-0.04em] text-balance">
          {t('title')}
        </h1>
        <p className="mx-0 mt-[22px] mb-0 max-w-[54ch] text-[20px] leading-[1.6] text-pretty text-ink/78">
          {t('lead')}
        </p>
      </div>
      <div className="mx-auto max-w-[1200px] px-[40px] pt-[8px] pb-[48px]">
        <PauseOffscreen className="pc-grid">
          {CARDS.map(({ key, name, cls }) => (
            <Link
              key={key}
              href={{ pathname: '/product', hash: key }}
              className={`pc-col ${cls} border-ink/16 bg-cream`}
            >
              <div className="flex items-center justify-between gap-[10px]">
                <span className="font-mono text-[10px] tracking-[0.14em] text-ink/55 uppercase">{t('seeProduct')}</span>
              </div>
              <div className="pc-art">
                <CardArt kind={key} />
              </div>
              <div>
                <div className="flex items-center gap-[12px]">
                  <div className="flex h-[48px] w-[48px] flex-none items-center justify-center rounded-[14px] border border-ink/12 bg-white">
                    {CARD_ICONS[key]}
                  </div>
                  <div className="text-[30px] leading-[1] font-[800] tracking-[-0.035em]">{name}</div>
                </div>
                <div className="mt-[8px] text-[16px] leading-[1.5] text-pretty opacity-[0.85]">{t(`cards.${key}`)}</div>
              </div>
            </Link>
          ))}
        </PauseOffscreen>
      </div>
    </>
  );
}

type Channel = 'voice' | 'whatsapp' | 'chat';
const NAMES: Record<Channel, string> = { voice: 'VangVoice', whatsapp: 'VangMessage', chat: 'VangChat' };

// One product (VangVoice / VangMessage / VangChat): intro, side card + live demo, lists, price.
export function ProductSection({
  channel,
  side,
  demo,
  bordered = false,
}: {
  channel: Channel;
  side: React.ReactNode;
  demo: React.ReactNode;
  bordered?: boolean;
}) {
  const t = useTranslations(`product.${channel}`);
  const p = useTranslations('product');
  return (
    <div id={channel} className={`scroll-mt-[80px] ${bordered ? 'border-t border-ink/14' : ''}`}>
      <div className="vp-prod mx-auto max-w-[1200px] items-center px-[40px] pt-[72px] pb-[40px]">
        <div className="min-w-0">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mx-0 mt-[18px] mb-0 text-[min(58px,11.5vw)] leading-[1] font-[800] tracking-[-0.04em] text-balance">
            {NAMES[channel]}
          </h2>
          <p className="mx-0 mt-[18px] mb-0 max-w-[40ch] text-[20px] leading-[1.55] text-pretty text-ink/80">
            {t('lead')}
          </p>
          <div className="mt-[22px]">
            <CheckList items={t.raw('bullets') as string[]} />
          </div>
        </div>
        <div className="vp-phone flex min-w-0 flex-col items-center gap-[12px]">
          <div className="vp-demo flex items-center justify-center gap-[18px]">
            {side}
            <div className="flex flex-none flex-col items-center gap-[12px]">
              <div className="text-center font-mono text-[10.5px] tracking-[0.16em] text-amber uppercase">
                {t('demoLabel')}
              </div>
              {demo}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] px-[40px] pt-[40px] pb-[24px]">
        <WhyBoxes
          doesTitle={t('doesTitle')}
          does={t.raw('does') as string[]}
          whyTitle={t('whyTitle')}
          why={t.raw('why') as string[]}
        />
      </div>
      <div className="mx-auto max-w-[1200px] px-[40px] pt-[8px] pb-[88px]">
        <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[14px] border-t border-ink/18 pt-[24px]">
          <span className="font-mono text-[11px] tracking-[0.1em] text-ink/62 uppercase">{p('from')}</span>
          <span className="text-[36px] font-[800] tracking-[-0.035em] text-coral">{t('price')}</span>
          <span className="text-[15.5px] text-ink/68">{p('vat')}</span>
          <span className="flex-[1_1_20px]" />
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-[9px] rounded-[99px] border border-ink/35 bg-transparent px-[26px] py-[14px] text-[15px] font-[600] whitespace-nowrap text-ink transition-[background,color,border-color] duration-[180ms] ease-[ease] hover:border-ink hover:bg-ink hover:text-cream"
          >
            {p('seePricing')} <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

// "Replies in seconds": a WhatsApp exchange looping every 7 s.
export function WhatsAppSideCard() {
  const t = useTranslations('product.whatsapp.side');
  return (
    <PauseOffscreen className="vp-side flex w-[196px] flex-none flex-col gap-[10px] rounded-[22px] bg-ink p-[16px] text-cream shadow-[0_16px_34px_rgba(43,33,24,0.18)]">
      <div className="font-mono text-[9.5px] tracking-[0.14em] text-coral-light uppercase">{t('label')}</div>
      <div className="flex min-h-[176px] flex-col gap-[7px] rounded-[14px] bg-[#ECE5DD] p-[10px]">
        <div className="vk-a max-w-[88%] self-end rounded-[12px] bg-[#D9FDD3] px-[10px] py-[7px] text-[12.5px] leading-[1.35] text-ink">
          {t('question')}
        </div>
        <div className="vk-b flex gap-[4px] self-start rounded-[12px] bg-white px-[10px] py-[8px]" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="vk-c max-w-[88%] self-start rounded-[12px] bg-white px-[10px] py-[7px] text-[12.5px] leading-[1.35] text-ink">
          {t('answer')}
        </div>
        <div className="vk-d self-center rounded-[99px] bg-coral px-[9px] py-[4px] font-mono text-[9px] tracking-[0.1em] text-white uppercase">
          {t('badge')}
        </div>
      </div>
      <div className="text-[13px] leading-[1.4] font-[700] text-balance text-cream">{t('note')}</div>
    </PauseOffscreen>
  );
}

// "Answers while they browse": a website chat looping every 7 s.
export function ChatSideCard() {
  const t = useTranslations('product.chat.side');
  return (
    <PauseOffscreen className="vp-side flex w-[196px] flex-none flex-col gap-[10px] rounded-[22px] bg-ink p-[16px] text-cream shadow-[0_16px_34px_rgba(43,33,24,0.18)]">
      <div className="font-mono text-[9.5px] tracking-[0.14em] text-coral-light uppercase">{t('label')}</div>
      <div className="flex min-h-[176px] flex-col overflow-hidden rounded-[14px] bg-cream">
        <div className="flex gap-[4px] bg-sand px-[9px] py-[7px]">
          <span className="h-[6px] w-[6px] rounded-[50%] bg-coral" />
          <span className="h-[6px] w-[6px] rounded-[50%] bg-[#E8A33D]" />
          <span className="h-[6px] w-[6px] rounded-[50%] bg-[#B8AE9E]" />
        </div>
        <div className="flex flex-col gap-[7px] p-[10px]">
          <div className="vk-a max-w-[88%] self-end rounded-[12px] bg-ink px-[10px] py-[7px] text-[12.5px] leading-[1.35] text-cream">
            {t('question')}
          </div>
          <div className="vk-c max-w-[88%] self-start rounded-[12px] border border-ink/12 bg-white px-[10px] py-[7px] text-[12.5px] leading-[1.35] text-ink">
            {t('answer')}
          </div>
          <div className="vk-d self-center rounded-[99px] bg-coral px-[9px] py-[4px] font-mono text-[9px] tracking-[0.1em] text-white uppercase">
            {t('badge')}
          </div>
        </div>
      </div>
      <div className="text-[13px] leading-[1.4] font-[700] text-balance text-cream">{t('note')}</div>
    </PauseOffscreen>
  );
}

// "Built around your business, not a template".
export function DoneForYou() {
  const t = useTranslations('product.done');
  return (
    <section className="border-t border-ink/12 bg-paper">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-x-[64px] gap-y-[36px]">
          <div className="min-w-0">
            <Eyebrow>{t('eyebrow')}</Eyebrow>
            <h2 className="mx-0 mt-[18px] mb-0 max-w-[18ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
              {t('title')}
            </h2>
            <p className="mx-0 mt-[18px] mb-0 max-w-[56ch] text-[18px] leading-[1.7] text-pretty text-ink/80">
              {t('text')}
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-start gap-[22px] rounded-[24px] border border-ink/12 bg-paper px-[30px] pt-[30px] pb-[34px]">
            <CheckList items={t.raw('items') as string[]} />
            <ButtonLink href="/contact">{t('cta')}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// "Questions per channel": three compact FAQ columns.
export function ProductFaq() {
  const t = useTranslations('product.faq');
  const groups: Channel[] = ['voice', 'whatsapp', 'chat'];
  return (
    <section className="border-y border-ink/12 bg-sand">
      <div className="mx-auto max-w-[1200px] px-[40px] py-[80px]">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h2 className="mx-0 mt-[18px] mb-0 max-w-[22ch] text-[40px] leading-[1.05] font-[800] tracking-[-0.035em] text-balance">
          {t('title')}
        </h2>
        <div className="vp-faq mt-[30px]">
          {groups.map((g) => (
            <div key={g} className="flex min-w-0 flex-col gap-[8px]">
              <div className="pb-[4px] font-mono text-[10.5px] tracking-[0.14em] text-amber uppercase">{NAMES[g]}</div>
              <Faq entries={t.raw(g) as { q: string; a: string }[]} variant="compact" gap={8} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
