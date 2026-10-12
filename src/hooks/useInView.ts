import { useEffect, useRef, useState } from 'react'

const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window

/** Reports once an element has scrolled into view, then stops watching. */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  // Without IntersectionObserver, show everything straight away.
  const [inView, setInView] = useState(!canObserve)

  useEffect(() => {
    const element = ref.current
    if (!element || !canObserve) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}
