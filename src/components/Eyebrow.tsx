import type { ReactNode } from 'react'
import { order } from '../experience/order'

type EyebrowProps = {
  children: ReactNode
  /** Position in the scene's entrance sequence. */
  step?: number
}

export default function Eyebrow({ children, step = 0 }: EyebrowProps) {
  return (
    <p
      className="scene-item mb-3 flex items-center md:mb-4 short:mb-2 gap-3 text-xs font-medium uppercase tracking-[0.3em] text-taupe"
      style={order(step)}
    >
      {/* The rule echoes the lines either side of "RESIDENCES" in the logo. */}
      <span className="eyebrow-line h-px w-8 shrink-0 bg-taupe" aria-hidden="true" />
      {children}
    </p>
  )
}
