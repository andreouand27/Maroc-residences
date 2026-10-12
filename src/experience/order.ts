import type { CSSProperties } from 'react'

/** Sets an element's place in its scene's staggered entrance (see `--i` in index.css). */
export const order = (step: number) => ({ '--i': step }) as CSSProperties
