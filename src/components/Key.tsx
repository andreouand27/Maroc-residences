import type { ReactNode } from 'react'

/** A keyboard key, as shown in the "press Enter" prompts. */
export default function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-white/30 bg-white/10 px-1.5 py-0.5 font-sans text-[11px] leading-none">
      {children}
    </kbd>
  )
}
