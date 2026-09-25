import Image from 'next/image';

type Tone = 'twotone' | 'cream' | 'orange';

const src: Record<Tone, string> = {
  twotone: '/brand/mark-twotone.png',
  cream: '/brand/mark-cream.png',
  orange: '/brand/mark-orange.png',
};

/**
 * The VangAI mark (two hands forming a V), rendered exactly like the design: a size x size
 * slot in which the 567x631 PNG takes the full width at its natural aspect ratio, so it is
 * slightly taller than the slot (34px slot -> 34 x 37.8px mark) and extends below it.
 * Unoptimized so the pixels are the design's own. Decorative: it always sits next to the
 * "VangAI" wordmark or inside a labelled link.
 */
export function Mark({ size, tone = 'twotone', priority = false }: { size: number; tone?: Tone; priority?: boolean }) {
  return (
    <div style={{ width: size, height: size, flex: 'none' }}>
      <div className="flex w-full items-center justify-center overflow-hidden">
        <Image
          src={src[tone]}
          alt=""
          width={567}
          height={631}
          unoptimized
          priority={priority}
          className="block h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}
