// Every duration, easing and distance used by added animations. Calm and confident:
// ease-out curves, small distances, no overshoot. Values of the design's own animations
// live next to the components that copy them, with a pointer to the design source.

export const ease = {
  // The design's own easing (step cards, FAQ): cubic-bezier(.22,.61,.36,1)
  design: [0.22, 0.61, 0.36, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
};

export const duration = {
  hover: 0.18, // matches the design's 180ms colour transitions
  menu: 0.18,
  pill: 0.32,
  bubble: 0.28,
  accordion: 0.38, // design: grid-template-rows 380ms
  reveal: 0.6,
  heroLine: 0.7,
  countUp: 1.2,
} as const;

export const distance = {
  menu: 6,
  reveal: 16,
  heroLine: 24,
  bubble: 8,
  cardLift: 4,
} as const;

export const stagger = {
  heroLines: 0.08,
  reveal: 0.06,
} as const;
