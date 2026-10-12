import { useEffect, useState, type CSSProperties } from 'react'
import { prefersReducedMotion } from '../experience/motion'

type AnimatedHeadingProps = {
  /** Heading text; `\n` starts a new line. */
  text: string
  as?: 'h1' | 'h2'
  /**
   * `slide`: characters fade in from the left (the hero).
   * `rise`: characters swing up into place from behind a mask.
   */
  variant?: 'slide' | 'rise'
  className?: string
  style?: CSSProperties
  /** Milliseconds before the first character starts animating. */
  initialDelay?: number
  /** Stagger between characters in milliseconds. */
  charDelay?: number
  /** Transition length of each character in milliseconds. */
  duration?: number
  /** The animation starts when this turns true; turning it false hides the text again. */
  play?: boolean
}

type Char = { char: string; index: number }

// Groups a line's characters into words (each keeping its trailing space) so
// the heading only wraps between words, never in the middle of one.
function splitWords(chars: string[]): Char[][] {
  const words: Char[][] = [[]]
  chars.forEach((char, index) => {
    words[words.length - 1].push({ char, index })
    if (char === ' ') words.push([])
  })
  return words.filter((word) => word.length > 0)
}

const hidden = {
  slide: { opacity: 0, transform: 'translateX(-18px)' },
  rise: { opacity: 1, transform: 'translateY(110%) rotate(10deg)' },
}
const shown = {
  slide: { opacity: 1, transform: 'translateX(0)' },
  rise: { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
}

export default function AnimatedHeading({
  text,
  as: Tag = 'h1',
  variant = 'slide',
  className = '',
  style,
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
  play = true,
}: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (!play) return
    const timer = setTimeout(() => setAnimate(true), prefersReducedMotion() ? 0 : initialDelay)
    return () => {
      clearTimeout(timer)
      setAnimate(false)
    }
  }, [initialDelay, play])

  const lines = text.split('\n')
  const state = animate ? shown[variant] : hidden[variant]

  return (
    <Tag className={className} style={style} aria-label={lines.join(' ')}>
      {lines.map((line, lineIndex) => {
        const chars = Array.from(line)
        return (
          <span
            key={lineIndex}
            className={variant === 'rise' ? '-mb-[0.12em] block overflow-hidden pb-[0.12em]' : 'block'}
            aria-hidden="true"
          >
            {splitWords(chars).map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {word.map(({ char, index }) => (
                  <span
                    key={index}
                    className="anim-char inline-block origin-bottom-left"
                    style={{
                      ...state,
                      transitionProperty: 'opacity, transform',
                      transitionDuration: `${duration}ms`,
                      transitionTimingFunction: variant === 'rise' ? 'cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
                      transitionDelay: `${lineIndex * chars.length * charDelay + index * charDelay}ms`,
                    }}
                  >
                    {char === ' ' ? ' ' : char}
                  </span>
                ))}
              </span>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}
