// Phone mockup shared by the three demos (design: 320px wide + 10px padding, 640px screen).
export function PhoneFrame({ screen, children }: { screen: string; children: React.ReactNode }) {
  return (
    <div className="w-[320px] max-w-full rounded-[46px] bg-ink p-[10px] font-sans shadow-[0_26px_64px_rgba(43,33,24,0.26)]">
      <div className={`relative flex h-[640px] flex-col overflow-hidden rounded-[38px] ${screen}`}>
        <div className="absolute top-[11px] left-1/2 z-[4] h-[23px] w-[84px] -translate-x-1/2 rounded-[99px] bg-ink" />
        {children}
      </div>
    </div>
  );
}

export function StatusIcons({ color, faint }: { color: string; faint: string }) {
  return (
    <span className="flex items-center gap-[5px]">
      <svg viewBox="0 0 20 14" width="17" height="12" fill={color}>
        <rect x="0" y="9" width="3" height="5" rx="1" />
        <rect x="4.7" y="6.5" width="3" height="7.5" rx="1" />
        <rect x="9.4" y="3.5" width="3" height="10.5" rx="1" />
        <rect x="14.1" y="0.5" width="3" height="13.5" rx="1" />
      </svg>
      <svg
        viewBox="0 0 18 14"
        width="15"
        height="12"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      >
        <path d="M1.2 4.6a11 11 0 0 1 15.6 0" />
        <path d="M4.1 7.8a7 7 0 0 1 9.8 0" />
        <path d="M7 11a3 3 0 0 1 4 0" />
      </svg>
      <svg viewBox="0 0 26 13" width="22" height="11" fill="none">
        <rect x="0.7" y="0.7" width="21" height="11.6" rx="3.4" stroke={faint} strokeWidth="1.3" />
        <rect x="2.6" y="2.6" width="15" height="7.8" rx="2" fill={color} />
        <path d="M23.4 4.4v4.2a2.6 2.6 0 0 0 0-4.2z" fill={faint} />
      </svg>
    </span>
  );
}
