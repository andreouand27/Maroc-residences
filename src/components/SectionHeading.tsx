import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  children?: ReactNode
}

export default function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="mb-4 text-sm text-gray-300">{eyebrow}</p>
      <h2 className="text-3xl font-normal md:text-4xl lg:text-5xl" style={{ letterSpacing: '-0.04em' }}>
        {title}
      </h2>
      {children && <div className="mt-6 text-base text-gray-300 md:text-lg">{children}</div>}
    </div>
  )
}
