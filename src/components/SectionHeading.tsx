import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  children?: ReactNode
}

export default function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      {/* The rule echoes the lines either side of "RESIDENCES" in the logo. */}
      <p className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-taupe">
        <span className="h-px w-8 bg-taupe" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="text-3xl font-normal [text-wrap:balance] md:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.04em' }}>
        {title}
      </h2>
      {children && <div className="mt-6 text-base text-gray-300 md:text-lg">{children}</div>}
    </div>
  )
}
