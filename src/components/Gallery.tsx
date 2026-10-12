import { useState } from 'react'
import { gallery } from '../site'
import Lightbox from './Lightbox'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Gallery() {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  return (
    <section id="gallery" className="scroll-mt-6 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
      <Reveal>
        <SectionHeading eyebrow="Gallery" title="See Alba Residences">
          <p>Architectural renders of the building, the entrance and the covered parking. Tap any picture to see it larger.</p>
        </SectionHeading>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {gallery.map((image, imageIndex) => (
          <Reveal key={image.src} delay={(imageIndex % 4) * 90}>
            <button
              type="button"
              onClick={() => {
                setIndex(imageIndex)
                setOpen(true)
              }}
              aria-label={`View larger: ${image.alt}`}
              className="group block w-full overflow-hidden rounded-xl bg-white/5"
            >
              <img
                src={image.thumb}
                alt=""
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <Lightbox images={gallery} index={index} open={open} onClose={() => setOpen(false)} onNavigate={setIndex} />
    </section>
  )
}
