import { ChevronLeft, ChevronRight } from 'lucide-react'
import Eyebrow from '../components/Eyebrow'
import type { Direction } from '../experience/effects'
import { frame, glass } from '../experience/layout'
import { order } from '../experience/order'
import { gallery } from '../site'

type GallerySceneProps = {
  index: number
  /** The picture shown before the current one, kept underneath while the new one wipes in. */
  previous: number | null
  direction: Direction
  onSelect: (index: number) => void
  onStep: (step: Direction) => void
}

const arrowClass =
  'hidden shrink-0 rounded-full p-3 text-white transition-colors hover:bg-white hover:text-black md:block liquid-glass border border-white/20'

export default function GalleryScene({ index, previous, direction, onSelect, onStep }: GallerySceneProps) {
  const image = gallery[index]

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div data-scene-motion className="absolute inset-0">
          <div className="scene-parallax absolute -inset-[3%]">
            {previous !== null && (
              <img src={gallery[previous].src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <img
              key={index}
              data-scene-image
              src={image.src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover ${
                previous === null ? '' : direction > 0 ? 'gallery-next' : 'gallery-prev'
              }`}
            />
          </div>
        </div>
      </div>

      <div className={`${frame} justify-between gap-6`}>
        <div className="scene-float self-start">
          <div className={`scene-panel ${glass} max-w-md p-5 md:p-6 short:p-3`}>
            <Eyebrow>Gallery · Architectural renders</Eyebrow>
            <p className="scene-item text-base md:text-xl short:text-sm" style={order(1)} aria-live="polite">
              <span className="mr-2 tabular-nums text-taupe">
                {index + 1} / {gallery.length}
              </span>
              {image.alt}
            </p>
          </div>
        </div>

        <div className="scene-item flex min-w-0 items-center justify-center gap-3" style={order(2)}>
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous picture" className={arrowClass}>
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div data-swipe-ignore className={`${glass} flex min-w-0 gap-2 overflow-x-auto p-2`}>
            {gallery.map((item, itemIndex) => (
              <button
                key={item.src}
                type="button"
                onClick={() => onSelect(itemIndex)}
                aria-label={`Show picture ${itemIndex + 1}: ${item.alt}`}
                aria-current={itemIndex === index ? 'true' : undefined}
                className={`h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg transition-[opacity,box-shadow] duration-300 md:h-16 md:w-24 short:h-10 short:w-16 ${
                  itemIndex === index ? 'opacity-100 ring-2 ring-inset ring-white' : 'opacity-50 hover:opacity-100'
                }`}
              >
                <img src={item.thumb} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => onStep(1)} aria-label="Next picture" className={arrowClass}>
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
