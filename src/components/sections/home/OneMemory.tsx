import { useTranslations } from 'next-intl';
import { Mark } from '@/components/ui/Mark';
import { PauseOffscreen } from '@/components/animations/PauseOffscreen';

// Burst icons from the design (stroke icons in coral, WhatsApp filled green).
const Phone = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round">
    <path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z" />
    <path d="M17 2.5c1.6.6 2.9 1.9 3.5 3.5M15.5 5.5c.9.4 1.6 1.1 2 2" />
  </svg>
);
const WhatsApp = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="#25D366">
    <path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.8L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 1.9a7.8 7.8 0 1 1-4 14.5l-.4-.2-2.8.7.8-2.7-.2-.4A7.8 7.8 0 0 1 12 4.1z" />
    <path d="M9.3 7.6c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.8 4.3 3.8 2.1.8 2.5.7 2.9.6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1 0-.1-.2-.2-.5-.3l-1.5-.7c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.5-.6c.1-.2.2-.3.1-.5l-.6-1.5z" />
  </svg>
);
const Browser = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="15" rx="2.5" />
    <path d="M3 9h18M6.5 6.5h.01M9 6.5h.01" />
  </svg>
);
const Calendar = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round">
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M3.5 10h17M8 3.5v3M16 3.5v3M9.5 14.5l2 2 3.5-4" />
  </svg>
);
const Check = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D85A30" strokeWidth="2.6" strokeLinecap="round">
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);
const Mail = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round">
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.8 7l8.2 6 8.2-6" />
  </svg>
);

// Burst offsets and delays, exactly as in the design.
const OUT = [
  [-46, -26, 0],
  [46, -30, 400],
  [-52, 22, 800],
  [50, 26, 1200],
  [-10, -46, 1600],
  [16, 44, 2000],
] as const;
const IN = [
  [-62, -40, 0, Phone],
  [64, -36, 300, WhatsApp],
  [-58, 42, 600, Browser],
  [60, 44, 900, Phone],
  [0, -58, 1200, WhatsApp],
  [0, 60, 1500, Browser],
  [-72, 6, 1800, Phone],
  [70, 10, 2100, WhatsApp],
] as const;

const burstStyle = (dx: number, dy: number, delay: number, name: 'vg-out' | 'vg-in') =>
  ({
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    animation: `${name} 950ms ease-out ${delay}ms infinite`,
  }) as React.CSSProperties;

function Card({ title, sub, icons }: { title: string; sub: string; icons: (() => React.JSX.Element)[] }) {
  return (
    <div className="vg-card relative min-w-0 rounded-[16px] border border-ink/20 bg-cream px-[18px] py-[15px] text-center transition-[border-color] duration-[200ms] ease-[ease] hover:border-coral">
      <div className="vg-fx pointer-events-none absolute inset-0" aria-hidden="true">
        {OUT.map(([dx, dy, delay], i) => {
          const Icon = icons[i % icons.length];
          return (
            <span key={i} className="absolute top-1/2 left-1/2 opacity-0" style={burstStyle(dx, dy, delay, 'vg-out')}>
              <Icon />
            </span>
          );
        })}
      </div>
      <div className="relative text-[15.5px] font-[700]">{title}</div>
      <div className="relative mt-[4px] font-mono text-[9.5px] tracking-[0.08em] text-ink/50 uppercase">{sub}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="vg-arr flex h-[56px] min-w-0 items-center justify-center">
      <div className="vg-flow h-[5px] min-w-0 flex-1 rounded-[99px] bg-[repeating-linear-gradient(90deg,rgba(216,90,48,0.35)_0_10px,#D85A30_10px_20px)] bg-size-[40px_5px]" />
      <div className="h-0 w-0 flex-none border-y-[13px] border-l-[20px] border-y-transparent border-l-coral" />
    </div>
  );
}

// "One memory, no repeating yourself." (design: VangAI Home.dc.html, .vg-memgrid).
export function OneMemory() {
  const t = useTranslations('home.memory');
  return (
    <PauseOffscreen className="mx-auto max-w-[1200px] px-[40px] py-[88px]">
      <h2 className="m-0 max-w-[22ch] text-[40px] leading-[1.1] font-[800] tracking-[-0.032em] text-balance">
        {t('title')}
      </h2>
      <p className="mx-0 mt-[16px] mb-0 max-w-[60ch] text-[18px] leading-[1.7] text-pretty text-ink/78">{t('lead')}</p>
      <div className="mt-[14px] font-mono text-[11px] tracking-[0.12em] text-amber uppercase">{t('hint')}</div>
      <div className="vg-memgrid mt-[44px] grid grid-cols-[minmax(100px,1fr)_minmax(56px,84px)_minmax(100px,1fr)_minmax(56px,84px)_minmax(100px,1fr)] items-center gap-[16px]">
        <div className="flex min-w-0 flex-col gap-[10px]">
          <Card title={t('phone')} sub={t('phoneSub')} icons={[Phone]} />
          <Card title="WhatsApp" sub={t('whatsappSub')} icons={[WhatsApp]} />
          <Card title={t('chat')} sub={t('chatSub')} icons={[Browser]} />
        </div>
        <Arrow />
        <div className="vg-card vg-hub relative min-w-0 rounded-[22px] bg-ink px-[22px] py-[30px] text-center text-cream">
          <div className="vg-fx pointer-events-none absolute inset-0" aria-hidden="true">
            {IN.map(([dx, dy, delay, Icon], i) => (
              <span key={i} className="absolute top-1/2 left-1/2 opacity-0" style={burstStyle(dx, dy, delay, 'vg-in')}>
                <Icon />
              </span>
            ))}
          </div>
          <div className="relative mx-auto mb-[12px] h-[50px] w-[50px]">
            <Mark size={50} tone="cream" />
          </div>
          <div className="relative text-[20px] font-[800] tracking-[-0.028em] text-cream">VangAI</div>
          <div className="relative mt-[6px] font-mono text-[9.5px] tracking-[0.1em] text-cream/60">{t('hubSub')}</div>
        </div>
        <Arrow />
        <div className="flex min-w-0 flex-col gap-[10px]">
          <Card title={t('calendar')} sub={t('calendarSub')} icons={[Calendar, Check]} />
          <Card title={t('inbox')} sub={t('inboxSub')} icons={[Mail]} />
        </div>
      </div>
    </PauseOffscreen>
  );
}
