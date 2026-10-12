import type { ReactNode } from 'react'
import type { SiteImage } from '../site'

type SceneBackgroundProps = {
  image: SiteImage
  /** CSS object-position for the picture. */
  position?: string
  /** Extra layers drawn over the picture, such as the hero video. */
  children?: ReactNode
}

// Full-screen picture behind a scene. Transitions animate the motion layer and
// redraw the picture from `data-scene-image`; the parallax layer follows the mouse.
export default function SceneBackground({ image, position = 'center', children }: SceneBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div data-scene-motion className="absolute inset-0">
        <div className="scene-parallax absolute -inset-[3%]">
          <img
            data-scene-image
            src={image.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: position }}
          />
          {children}
        </div>
      </div>
    </div>
  )
}
