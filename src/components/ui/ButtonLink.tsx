import type { ComponentProps } from 'react';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from './icons';

type Variant = 'primary' | 'primaryOnDark' | 'dark';
type Size = 'nav' | 'md' | 'lg';

// Values from the design's inline styles.
const base =
  'group inline-flex flex-none items-center justify-center whitespace-nowrap rounded-[99px] font-[600] transition-[background,color,border-color,scale] duration-[180ms] ease-[ease] active:scale-[0.98]';

const sizes: Record<Size, string> = {
  // Header: 15px, 11px 20px, gap 8px, no border.
  nav: 'gap-[8px] px-[20px] py-[11px] text-[15px]',
  // Default: 15px, 14px 26px, gap 9px, 1px border.
  md: 'gap-[9px] border px-[26px] py-[14px] text-[15px]',
  // Hero: same as md with 16px 28px.
  lg: 'gap-[9px] border px-[28px] py-[16px] text-[15px]',
};

const variants: Record<Variant, string> = {
  primary: 'border-coral bg-coral text-white hover:border-ink hover:bg-ink hover:text-white',
  primaryOnDark: 'border-coral bg-coral text-white hover:border-cream hover:bg-cream hover:text-ink',
  // On coral backgrounds (coral CTA bands).
  dark: 'border-ink bg-ink text-cream hover:border-cream hover:bg-cream hover:text-ink',
};

type Props = Omit<ComponentProps<typeof Link>, 'className'> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
};

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  arrow = true,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <Link {...rest} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
      {arrow && (
        // Added motion: the arrow nudges right on hover.
        <ArrowRight className="transition-transform duration-[180ms] ease-[ease] group-hover:translate-x-[3px]" />
      )}
    </Link>
  );
}
