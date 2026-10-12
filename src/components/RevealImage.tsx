import { useInView } from '../hooks/useInView'
import type { SiteImage } from '../site'

type RevealImageProps = {
  image: SiteImage
  /** Sizing for the frame, e.g. an aspect ratio. */
  className?: string
  /** Extra classes for the picture, e.g. an object position. */
  imageClassName?: string
}

export default function RevealImage({ image, className = '', imageClassName = '' }: RevealImageProps) {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div ref={ref} className={`reveal-image overflow-hidden rounded-xl bg-white/5 ${inView ? 'is-visible' : ''} ${className}`}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    </div>
  )
}
