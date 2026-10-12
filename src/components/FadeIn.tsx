import { useEffect, useState, type ReactNode } from 'react'
import { prefersReducedMotion } from '../experience/motion'

type FadeInProps = {
  children: ReactNode
  /** Milliseconds to wait before fading in. */
  delay?: number
  /** Length of the fade in milliseconds. */
  duration?: number
  /** The delay starts counting when this turns true; turning it false hides the content again. */
  play?: boolean
  className?: string
}

export default function FadeIn({ children, delay = 0, duration = 1000, play = true, className = '' }: FadeInProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!play) return
    // With reduced motion, show the content straight away.
    const timer = setTimeout(() => setVisible(true), prefersReducedMotion() ? 0 : delay)
    return () => {
      clearTimeout(timer)
      setVisible(false)
    }
  }, [delay, play])

  return (
    <div
      inert={!visible}
      className={`fade-in transition-opacity ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}
