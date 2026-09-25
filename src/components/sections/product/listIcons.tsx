// List icons from the design (VangAI Product.dc.html): coral check and amber arrow.

export function CheckIcon({ color = '#D85A30' }: { color?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[3px] flex-none"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="#854F0B"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[3px] flex-none"
    >
      <path d="M5 12h12M13 7l5 5-5 5" />
    </svg>
  );
}
