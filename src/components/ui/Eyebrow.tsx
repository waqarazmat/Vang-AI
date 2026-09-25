// Section label ("/ The problem"): IBM Plex Mono 11px, 0.18em, uppercase, coral (design).
// `onDark` is kept for call sites on dark bands; the design uses the same coral there.
export function Eyebrow({ children }: { children: React.ReactNode; onDark?: boolean }) {
  return <div className="font-mono text-[11px] tracking-[0.18em] text-coral uppercase">{children}</div>;
}
