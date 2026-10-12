// Scene transitions. Each effect gets the outgoing and incoming scene
// elements, sets their starting state synchronously (before the browser
// paints), then animates with the Web Animations API. The caller cancels every
// animation and clears inline styles once the returned promise settles.

export type EffectName = 'portal' | 'blinds' | 'iris' | 'shatter' | 'cube' | 'curtain' | 'warp' | 'fade'
export type Direction = 1 | -1

export type EffectContext = {
  /** Full-screen container holding the scenes. */
  stage: HTMLElement
  /** Empty layer above the scenes for temporary pieces. */
  overlay: HTMLElement
  from: HTMLElement
  to: HTMLElement
  fromId: string
  toId: string
  direction: Direction
  /** Where the visitor clicked to start the transition, relative to the stage. */
  origin: { x: number; y: number } | null
  /** Starts the incoming scene's own entrance animations now. */
  reveal: () => void
  /** Starts them after a delay; the caller clears the timer if the effect ends first. */
  revealAfter: (ms: number) => void
  /** Element.animate with `fill: 'both'`, tracked so the caller can cancel it. */
  animate: (element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions) => Animation
}

type Effect = (ctx: EffectContext) => Promise<void>

// The in-out curves start briskly on purpose: a steeper start feels like a
// delay after pressing a key.
const EASE = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  in: 'cubic-bezier(0.55, 0, 1, 0.45)',
  inOut: 'cubic-bezier(0.55, 0, 0.15, 1)',
  expoIn: 'cubic-bezier(0.6, 0, 0.8, 0.2)',
  reveal: 'cubic-bezier(0.6, 0, 0.2, 1)',
}

/** Time the outgoing scene's text takes to fade before its picture breaks apart. */
const LEAVE_MS = 180

const TAUPE_SHADES = ['#b8aa98', '#8a7d6d', '#4a4138', '#141210']

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const settle = (animations: Animation[]) =>
  Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))).then(() => undefined)

// Deterministic pseudo-random number in [0, 1), so an effect plays the same way every time.
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

function size(stage: HTMLElement) {
  return { width: stage.clientWidth, height: stage.clientHeight }
}

function farthestCorner(x: number, y: number, width: number, height: number) {
  return Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
}

const motionLayer = (scene: HTMLElement) => scene.querySelector<HTMLElement>('[data-scene-motion]')

function layer(styles: Partial<CSSStyleDeclaration>) {
  const element = document.createElement('div')
  Object.assign(element.style, { position: 'absolute', ...styles })
  return element
}

type Snapshot = {
  image: HTMLImageElement
  /** The picture's box on screen, relative to the stage. */
  left: number
  top: number
  width: number
  height: number
  /** object-position as fractions (0.5, 0.5 = centred). */
  position: [number, number]
}

// Where a scene's background picture currently sits on screen, so pieces of it
// can be redrawn exactly in place.
function snapshot(scene: HTMLElement, stage: HTMLElement): Snapshot | null {
  const image = scene.querySelector<HTMLImageElement>('[data-scene-image]')
  if (!image || !image.complete || image.naturalWidth === 0) return null
  const box = image.getBoundingClientRect()
  const origin = stage.getBoundingClientRect()
  const [x = '50%', y = '50%'] = getComputedStyle(image).objectPosition.split(' ')
  return {
    image,
    left: box.left - origin.left,
    top: box.top - origin.top,
    width: box.width,
    height: box.height,
    position: [parseFloat(x) / 100, parseFloat(y) / 100],
  }
}

type Box = { left: number; top: number; width: number; height: number }

// A rectangular piece of the scene's picture. It is drawn onto a canvas from the
// already-decoded <img>, so it is ready on the very first frame; a CSS
// background copy can paint blank for a frame or two while it decodes.
// `outer` clips and moves; `inner` (the canvas) can be stretched inside it.
function piece(shot: Snapshot | null, box: Box) {
  const outer = layer({
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    overflow: 'hidden',
    background: '#000',
    willChange: 'transform, opacity',
  })
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const inner = document.createElement('canvas')
  inner.width = Math.max(1, Math.round(box.width * ratio))
  inner.height = Math.max(1, Math.round(box.height * ratio))
  Object.assign(inner.style, { position: 'absolute', inset: '0', width: '100%', height: '100%' })
  const context = inner.getContext('2d')
  if (shot && context) {
    // Same maths as object-fit: cover with the picture's object-position.
    const { image } = shot
    const scale = Math.max(shot.width / image.naturalWidth, shot.height / image.naturalHeight)
    const imageLeft = shot.left + (shot.width - image.naturalWidth * scale) * shot.position[0]
    const imageTop = shot.top + (shot.height - image.naturalHeight * scale) * shot.position[1]
    context.drawImage(
      image,
      (box.left - imageLeft) / scale,
      (box.top - imageTop) / scale,
      box.width / scale,
      box.height / scale,
      0,
      0,
      inner.width,
      inner.height,
    )
  }
  outer.appendChild(inner)
  return { outer, inner }
}

// Expanding rings that trace the edge of a circular reveal.
function rings(ctx: EffectContext, x: number, y: number, radius: number, timing: KeyframeAnimationOptions) {
  return [0, 1].map((index) => {
    const ring = layer({
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      borderRadius: '50%',
      border: index === 0 ? '2px solid rgba(255, 255, 255, 0.85)' : '1px solid rgba(184, 170, 152, 0.8)',
    })
    ctx.overlay.appendChild(ring)
    return ctx.animate(
      ring,
      [
        { transform: 'scale(0)', opacity: 1 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      { ...timing, delay: (Number(timing.delay) || 0) + index * 140 },
    )
  })
}

// Splash ⇄ scene: fly into the logo while the scene opens out of it.
const portal: Effect = async (ctx) => {
  const { stage, from, to, fromId, animate, revealAfter } = ctx
  const { width, height } = size(stage)
  const entering = fromId === 'splash'
  const splash = entering ? from : to
  const scene = entering ? to : from
  const logo = splash.querySelector<HTMLElement>('[data-splash-logo]')
  const stageBox = stage.getBoundingClientRect()
  const logoBox = logo?.getBoundingClientRect()
  // Aim into the building drawing, a little above the logo's middle.
  const x = logoBox ? logoBox.left - stageBox.left + logoBox.width / 2 : width / 2
  const y = logoBox ? logoBox.top - stageBox.top + logoBox.height * 0.32 : height / 2
  const radius = farthestCorner(x, y, width, height)
  const circle = (r: number) => `circle(${r}px at ${x}px ${y}px)`
  if (logo && logoBox) logo.style.transformOrigin = `${x + stageBox.left - logoBox.left}px ${y + stageBox.top - logoBox.top}px`

  splash.style.zIndex = '10'
  scene.style.zIndex = '20'
  const motion = motionLayer(scene)
  const animations: Animation[] = []

  if (entering) {
    const timing = { duration: 1300, delay: 250, easing: EASE.reveal }
    animations.push(animate(scene, [{ clipPath: circle(0) }, { clipPath: circle(radius) }], timing))
    if (logo) {
      animations.push(
        animate(
          logo,
          [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(16)', opacity: 0 },
          ],
          { duration: 1400, easing: EASE.expoIn },
        ),
      )
    }
    if (motion) {
      animations.push(
        animate(motion, [{ transform: 'scale(1.6)' }, { transform: 'none' }], {
          duration: 2100,
          delay: 250,
          easing: EASE.out,
        }),
      )
    }
    animations.push(...rings(ctx, x, y, radius, timing))
    revealAfter(1250)
  } else {
    const timing = { duration: 1200, easing: EASE.reveal }
    animations.push(animate(scene, [{ clipPath: circle(radius) }, { clipPath: circle(0) }], timing))
    if (motion) animations.push(animate(motion, [{ transform: 'none' }, { transform: 'scale(1.4)' }], timing))
    if (logo) {
      animations.push(
        animate(
          logo,
          [
            { transform: 'scale(16)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: 1300, delay: 300, easing: EASE.out },
        ),
      )
    }
    revealAfter(900)
  }
  await settle(animations)
}

// The picture splits into vertical blinds that sweep away in a wave.
const blinds: Effect = async (ctx) => {
  const { stage, overlay, from, to, direction, animate, revealAfter } = ctx
  const { width, height } = size(stage)
  from.style.zIndex = '20'
  to.style.zIndex = '10'
  const animations: Animation[] = []
  const motion = motionLayer(to)
  if (motion) {
    animations.push(
      animate(
        motion,
        [
          { transform: 'scale(1.35)', filter: 'brightness(0.3)' },
          { transform: 'none', filter: 'brightness(1)' },
        ],
        { duration: 1800, delay: LEAVE_MS, easing: EASE.out },
      ),
    )
  }

  await wait(LEAVE_MS)
  const shot = snapshot(from, stage)
  const count = width < 768 ? 5 : 9
  const stripWidth = width / count
  for (let index = 0; index < count; index++) {
    const { outer, inner } = piece(shot, { left: index * stripWidth, top: 0, width: stripWidth + 1, height })
    inner.style.transformOrigin = direction > 0 ? '50% 100%' : '50% 0%'
    overlay.appendChild(outer)
    const order = direction > 0 ? index : count - 1 - index
    const timing = { duration: 1000, delay: order * 55, easing: EASE.inOut }
    animations.push(
      animate(outer, [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(0, ${-direction * 110}%, 0)` }], timing),
      animate(
        inner,
        [
          { transform: 'scaleY(1)', filter: 'brightness(1)' },
          { transform: 'scaleY(1.5)', filter: 'brightness(0.45)' },
        ],
        timing,
      ),
    )
  }
  from.style.visibility = 'hidden'
  revealAfter(750)
  await settle(animations)
}

// The next scene opens in a circle from where the visitor clicked (or the centre).
const iris: Effect = async (ctx) => {
  const { stage, from, to, direction, origin, animate, revealAfter } = ctx
  const { width, height } = size(stage)
  const x = origin?.x ?? width / 2
  const y = origin?.y ?? height / 2
  const radius = farthestCorner(x, y, width, height)
  from.style.zIndex = '10'
  to.style.zIndex = '20'
  const timing = { duration: 1300, easing: EASE.reveal }
  const animations = [
    animate(
      to,
      [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${radius}px at ${x}px ${y}px)` }],
      timing,
    ),
    animate(
      from,
      [
        { transform: 'scale(1)', filter: 'brightness(1)' },
        { transform: 'scale(0.85)', filter: 'brightness(0.25)' },
      ],
      timing,
    ),
    ...rings(ctx, x, y, radius, timing),
  ]
  const motion = motionLayer(to)
  if (motion) {
    animations.push(
      animate(motion, [{ transform: `scale(1.5) rotate(${direction * -10}deg)` }, { transform: 'none' }], {
        duration: 1800,
        easing: EASE.out,
      }),
    )
  }
  revealAfter(800)
  await settle(animations)
}

// The picture cracks into tiles that burst towards the viewer.
const shatter: Effect = async (ctx) => {
  const { stage, overlay, from, to, direction, animate, revealAfter } = ctx
  const { width, height } = size(stage)
  from.style.zIndex = '20'
  to.style.zIndex = '10'
  const animations: Animation[] = []
  const motion = motionLayer(to)
  if (motion) {
    animations.push(
      animate(
        motion,
        [
          { transform: 'scale(1.25)', filter: 'brightness(0.2)' },
          { transform: 'none', filter: 'brightness(1)' },
        ],
        { duration: 1800, delay: LEAVE_MS + 150, easing: EASE.out },
      ),
    )
  }

  await wait(LEAVE_MS)
  const shot = snapshot(from, stage)
  const landscape = width >= height
  const columns = landscape ? 8 : 4
  const rows = landscape ? 5 : 7
  const tileWidth = width / columns
  const tileHeight = height / rows
  overlay.style.perspective = '1200px'
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column
      const cx = (column + 0.5) / columns - 0.5
      const cy = (row + 0.5) / rows - 0.5
      const distance = Math.hypot(cx, cy) / Math.SQRT1_2
      const [n1, n2, n3] = [noise(index), noise(index + 101), noise(index + 202)]
      const tx = cx * width * (1.1 + n1)
      const ty = cy * height * (1.1 + n2) + direction * height * 0.2
      const tz = 200 + n3 * 600
      const spin = `rotateX(${(n2 - 0.5) * 220}deg) rotateY(${(n1 - 0.5) * 220}deg) rotateZ(${(n3 - 0.5) * 180}deg)`
      const { outer } = piece(shot, {
        left: column * tileWidth,
        top: row * tileHeight,
        width: tileWidth + 1,
        height: tileHeight + 1,
      })
      overlay.appendChild(outer)
      animations.push(
        animate(
          outer,
          [
            // Crack apart quickly, then accelerate away.
            { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1, easing: 'ease-out' },
            {
              offset: 0.15,
              transform: 'translate3d(0, 0, 20px) scale(0.94)',
              opacity: 1,
              easing: 'cubic-bezier(0.5, 0, 0.75, 0)',
            },
            { transform: `translate3d(${tx}px, ${ty}px, ${tz}px) ${spin} scale(0.5)`, opacity: 0 },
          ],
          { duration: 1250, delay: distance * 240 },
        ),
      )
    }
  }
  const flash = layer({ inset: '0', background: '#fff' })
  overlay.appendChild(flash)
  animations.push(
    animate(flash, [{ opacity: 0 }, { offset: 0.25, opacity: 0.3 }, { opacity: 0 }], { duration: 450, easing: 'ease-out' }),
  )
  from.style.visibility = 'hidden'
  revealAfter(850)
  await settle(animations)
}

// Both scenes turn as two faces of a cube.
const cube: Effect = async (ctx) => {
  const { stage, from, to, direction, animate, revealAfter } = ctx
  const { width } = size(stage)
  stage.style.perspective = `${Math.max(1200, width * 1.4)}px`
  for (const scene of [from, to]) {
    scene.style.transformOrigin = `50% 50% ${-width / 2}px`
    scene.style.backfaceVisibility = 'hidden'
  }
  from.style.zIndex = '20'
  to.style.zIndex = '10'
  const pull = -width * 0.35
  const timing = { duration: 1500, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
  const animations = [
    animate(
      from,
      [
        { transform: 'translateZ(0) rotateY(0deg)', filter: 'brightness(1)' },
        { offset: 0.5, transform: `translateZ(${pull}px) rotateY(${-45 * direction}deg)`, filter: 'brightness(0.6)' },
        { transform: `translateZ(0) rotateY(${-90 * direction}deg)`, filter: 'brightness(0.2)' },
      ],
      timing,
    ),
    animate(
      to,
      [
        { transform: `translateZ(0) rotateY(${90 * direction}deg)`, filter: 'brightness(0.2)' },
        { offset: 0.5, transform: `translateZ(${pull}px) rotateY(${45 * direction}deg)`, filter: 'brightness(0.6)' },
        { transform: 'translateZ(0) rotateY(0deg)', filter: 'brightness(1)' },
      ],
      timing,
    ),
  ]
  revealAfter(1000)
  await settle(animations)
}

// Panels in the logo's taupe tones sweep across, the logo mark shows, and they sweep away.
const curtain: Effect = async (ctx) => {
  const { overlay, from, to, direction, animate, revealAfter } = ctx
  from.style.zIndex = '20'
  to.style.zIndex = '10'
  const panels = TAUPE_SHADES.map((color) => {
    const panel = layer({ inset: '0', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' })
    overlay.appendChild(panel)
    return panel
  })
  const mark = document.createElement('img')
  mark.src = 'images/logo-mark.webp'
  mark.alt = ''
  Object.assign(mark.style, { width: 'min(40vw, 240px)', height: 'auto' })
  panels[panels.length - 1].appendChild(mark)

  const stagger = 110
  const coverIn = panels.map((panel, index) =>
    animate(panel, [{ transform: `translate3d(${direction * 100}%, 0, 0)` }, { transform: 'translate3d(0, 0, 0)' }], {
      duration: 750,
      delay: index * stagger,
      easing: EASE.inOut,
    }),
  )
  const markIn = animate(
    mark,
    [
      { opacity: 0, transform: 'translateY(24px) scale(0.7)' },
      { opacity: 1, transform: 'none' },
    ],
    { duration: 700, delay: stagger * (panels.length - 1) + 400, easing: EASE.out },
  )
  await settle(coverIn)
  from.style.visibility = 'hidden'
  await settle([markIn])
  await wait(150)

  const motion = motionLayer(to)
  const animations = panels.map((panel, index) =>
    animate(panel, [{ transform: 'translate3d(0, 0, 0)' }, { transform: `translate3d(${-direction * 100}%, 0, 0)` }], {
      duration: 750,
      delay: (panels.length - 1 - index) * stagger,
      easing: EASE.inOut,
    }),
  )
  if (motion) animations.push(animate(motion, [{ transform: 'scale(1.25)' }, { transform: 'none' }], { duration: 1600, easing: EASE.out }))
  revealAfter(350)
  await settle(animations)
}

// Light-speed jump: streaks fly past while one scene rushes away and the next arrives.
const warp: Effect = async (ctx) => {
  const { stage, overlay, from, to, direction, animate, revealAfter } = ctx
  const { width, height } = size(stage)
  from.style.zIndex = '10'
  to.style.zIndex = '20'
  const forward = direction > 0
  const far = Math.hypot(width, height) / 2
  const animations = [
    animate(
      from,
      [
        { transform: 'scale(1)', filter: 'blur(0px) brightness(1)', opacity: 1 },
        { transform: `scale(${forward ? 2.6 : 0.4})`, filter: 'blur(16px) brightness(1.8)', opacity: 0 },
      ],
      { duration: 1100, easing: EASE.expoIn },
    ),
    animate(
      to,
      [
        { transform: `scale(${forward ? 0.4 : 2.2})`, filter: 'blur(18px)', opacity: 0 },
        { transform: 'scale(1)', filter: 'blur(0px)', opacity: 1 },
      ],
      { duration: 1100, delay: 650, easing: EASE.out },
    ),
  ]
  for (let index = 0; index < 70; index++) {
    const angle = noise(index) * 360
    const length = 60 + noise(index + 50) * 220
    const streak = layer({
      left: `${width / 2}px`,
      top: `${height / 2}px`,
      width: `${length}px`,
      height: noise(index + 9) > 0.8 ? '2px' : '1px',
      background: `linear-gradient(${forward ? 90 : 270}deg, transparent, rgba(255, 255, 255, 0.9))`,
      transformOrigin: '0 50%',
    })
    overlay.appendChild(streak)
    const near = 20 + noise(index + 7) * 80
    const [start, end] = forward ? [near, far + length] : [far + length, near]
    animations.push(
      animate(
        streak,
        [
          { transform: `rotate(${angle}deg) translateX(${start}px) scaleX(0.2)`, opacity: 0 },
          { offset: 0.3, opacity: 1 },
          { transform: `rotate(${angle}deg) translateX(${end}px) scaleX(1)`, opacity: 0 },
        ],
        { duration: 700 + noise(index + 3) * 500, delay: 150 + noise(index + 5) * 600, easing: EASE.in },
      ),
    )
  }
  revealAfter(1300)
  await settle(animations)
}

// Used when the visitor prefers reduced motion.
const fade: Effect = async ({ from, to, animate, reveal }) => {
  from.style.zIndex = '10'
  to.style.zIndex = '20'
  const animation = animate(to, [{ opacity: 0 }, { opacity: 1 }], { duration: 350, easing: 'ease' })
  reveal()
  await settle([animation])
}

export const effects: Record<EffectName, Effect> = { portal, blinds, iris, shatter, cube, curtain, warp, fade }
