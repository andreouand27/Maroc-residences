import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect, useRef, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { SiteImage } from '../site'

type LightboxProps = {
  images: SiteImage[]
  index: number
  open: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

const controlClass =
  'liquid-glass rounded-lg border border-white/20 p-2.5 text-white transition-colors hover:bg-white hover:text-black'

export default function Lightbox({ images, index, open, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const count = images.length
  const image = images[index]
  const next = (index + 1) % count
  const previous = (index - 1 + count) % count

  // While open: lock page scroll, move focus into the viewer, and hand focus
  // back to the picture that opened it on close.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      opener?.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') onNavigate(next)
      else if (event.key === 'ArrowLeft') onNavigate(previous)
      else if (event.key === 'Tab') {
        // Keep keyboard focus inside the viewer.
        const buttons = dialogRef.current?.querySelectorAll<HTMLElement>('button')
        if (!buttons?.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, next, previous, onClose, onNavigate])

  const go = (target: number) => (event: MouseEvent) => {
    event.stopPropagation()
    onNavigate(target)
  }

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      aria-hidden={!open}
      onClick={onClose}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return
        const distance = event.changedTouches[0].clientX - touchStartX.current
        touchStartX.current = null
        if (Math.abs(distance) > 50) onNavigate(distance < 0 ? next : previous)
      }}
      // Visibility only animates on close, so the viewer can take focus the
      // moment it opens.
      className={`fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm duration-500 ${
        open ? 'visible opacity-100 transition-opacity' : 'invisible opacity-0 transition-[opacity,visibility]'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-16">
        <p className="text-sm tabular-nums text-gray-300">
          {index + 1} / {count}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={controlClass}>
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <div
        className={`relative flex min-h-0 flex-1 items-center justify-center px-4 transition-transform duration-500 md:px-24 ${
          open ? 'scale-100' : 'scale-95'
        }`}
      >
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          onClick={(event) => event.stopPropagation()}
          className="lightbox-image max-h-full max-w-full rounded-xl object-contain"
        />
        <button
          type="button"
          onClick={go(previous)}
          aria-label="Previous image"
          className={`${controlClass} absolute left-4 top-1/2 -translate-y-1/2 md:left-8`}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          onClick={go(next)}
          aria-label="Next image"
          className={`${controlClass} absolute right-4 top-1/2 -translate-y-1/2 md:right-8`}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      <p className="px-6 py-5 text-center text-sm text-gray-300">{image.alt}</p>
    </div>,
    document.body,
  )
}
