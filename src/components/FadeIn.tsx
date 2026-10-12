import { useEffect, useState, type ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  /** Milliseconds to wait before fading in. */
  delay?: number
  /** Length of the fade in milliseconds. */
  duration?: number
  className?: string
}

export default function FadeIn({ children, delay = 0, duration = 1000, className = '' }: FadeInProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-opacity ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}
