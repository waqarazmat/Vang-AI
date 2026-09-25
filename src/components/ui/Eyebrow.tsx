// Section label ("/ The problem"): IBM Plex Mono 11px, 0.18em, uppercase.
// Colour follows the approved contrast correction: deep coral on light backgrounds,
// the design's light coral on dark backgrounds.
export function Eyebrow({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  return (
    <div
      className={`font-mono text-[11px] tracking-[0.18em] uppercase ${onDark ? 'text-coral-light' : 'text-coral-text'}`}
    >
      {children}
    </div>
  );
}
