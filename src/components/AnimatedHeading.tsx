import { useEffect, useState, type CSSProperties } from 'react'

type AnimatedHeadingProps = {
  /** Heading text; `\n` starts a new line. */
  text: string
  className?: string
  style?: CSSProperties
  /** Milliseconds before the first character starts animating. */
  initialDelay?: number
  /** Stagger between characters in milliseconds. */
  charDelay?: number
  /** Transition length of each character in milliseconds. */
  duration?: number
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

export default function AnimatedHeading({
  text,
  className = '',
  style,
  initialDelay = 200,
  charDelay = 30,
  duration = 500,
}: AnimatedHeadingProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  const lines = text.split('\n')

  return (
    <h1 className={className} style={style} aria-label={lines.join(' ')}>
      {lines.map((line, lineIndex) => {
        const chars = Array.from(line)
        return (
          <span key={lineIndex} className="block" aria-hidden="true">
            {splitWords(chars).map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {word.map(({ char, index }) => (
                  <span
                    key={index}
                    className="inline-block"
                    style={{
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateX(0)' : 'translateX(-18px)',
                      transitionProperty: 'opacity, transform',
                      transitionDuration: `${duration}ms`,
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
    </h1>
  )
}
