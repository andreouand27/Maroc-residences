// Shared class lists for scene layouts. Kept as full strings so Tailwind sees them.

/** Fills the screen, clearing the navbar at the top and the controls at the bottom. */
export const frame =
  'relative flex h-full flex-col px-6 pb-[calc(5.5rem+var(--safe-bottom))] pt-[calc(7rem+var(--safe-top))] md:px-12 lg:px-16 lg:pb-[calc(6rem+var(--safe-bottom))] lg:pt-[calc(8rem+var(--safe-top))]'

/** Frosted panel that keeps text readable over the renders. */
export const glass = 'liquid-glass glass-strong rounded-2xl border border-white/15'
