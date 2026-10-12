import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Controls from '../components/Controls'
import Navbar from '../components/Navbar'
import ApartmentsScene from '../scenes/ApartmentsScene'
import ContactScene from '../scenes/ContactScene'
import FeaturesScene from '../scenes/FeaturesScene'
import GalleryScene from '../scenes/GalleryScene'
import HeroScene from '../scenes/HeroScene'
import ProjectScene from '../scenes/ProjectScene'
import SplashScene from '../scenes/SplashScene'
import { gallery } from '../site'
import { effects, type Direction, type EffectName } from './effects'
import { prefersReducedMotion } from './motion'
import { sceneIndex, scenes, type SceneId } from './scenes'

type Transition = {
  from: number
  to: number
  direction: Direction
  effect: EffectName
  origin: { x: number; y: number } | null
}

type GalleryState = { index: number; previous: number | null; direction: Direction }

type NavigateOptions = { effect?: EffectName; direction?: Direction }

const SWIPE_DISTANCE = 50
const WHEEL_DISTANCE = 40
/** A pause this long between wheel events starts a new scroll gesture. */
const WHEEL_GESTURE_GAP = 220

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

const decoded = new Map<string, Promise<void>>()

/** Downloads and decodes a picture once; later calls reuse the same promise. */
function preload(src: string) {
  let promise = decoded.get(src)
  if (!promise) {
    const image = new Image()
    image.src = src
    promise = image.decode().catch(() => undefined)
    decoded.set(src, promise)
  }
  return promise
}

function pickEffect(from: number, to: number, direction: Direction): EffectName {
  if (scenes[from].id === 'splash' || scenes[to].id === 'splash') return 'portal'
  return direction > 0 ? scenes[to].enter : scenes[from].enter
}

// True when the event happened inside something that can still scroll that way,
// so the gesture belongs to it rather than to scene changes.
function insideScrollable(target: EventTarget | null, deltaY: number) {
  let element = target instanceof Element ? target : null
  while (element && element !== document.body) {
    if (element instanceof HTMLElement && element.scrollHeight > element.clientHeight + 1) {
      const { overflowY } = getComputedStyle(element)
      if (overflowY === 'auto' || overflowY === 'scroll') {
        if (deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 1) return true
        if (deltaY < 0 && element.scrollTop > 0) return true
      }
    }
    element = element.parentElement
  }
  return false
}

function initialScene() {
  const id = window.location.hash.slice(1)
  const index = scenes.findIndex((scene) => scene.id === id)
  return index > 0 ? index : 0
}

export default function Experience() {
  const [current, setCurrent] = useState(initialScene)
  const [transition, setTransition] = useState<Transition | null>(null)
  // Whether the scene being shown has started its entrance animations.
  const [revealed, setRevealed] = useState(false)
  const [galleryState, setGalleryState] = useState<GalleryState>({ index: 0, previous: null, direction: 1 })
  const [announcement, setAnnouncement] = useState('')

  const stageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const sceneElements = useRef(new Map<SceneId, HTMLElement>())
  const currentRef = useRef(current)
  const galleryRef = useRef(galleryState)
  const busy = useRef(false)
  const lastPointer = useRef<{ x: number; y: number; time: number } | null>(null)

  useEffect(() => {
    currentRef.current = current
  }, [current])
  useEffect(() => {
    galleryRef.current = galleryState
  }, [galleryState])

  // Let the first scene paint in its hidden state, then play its entrance.
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setRevealed(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  // Fetch every picture up front so transitions never wait on the network.
  useEffect(() => {
    for (const image of gallery) {
      preload(image.src)
      preload(image.thumb)
    }
    for (const name of ['logo-mark', 'logo-wordmark']) preload(`images/${name}.webp`)
  }, [])

  const goTo = useCallback(async (target: number, options: NavigateOptions = {}) => {
    const from = currentRef.current
    if (busy.current || target === from || target < 0 || target >= scenes.length) return
    busy.current = true

    const direction = options.direction ?? (target > from ? 1 : -1)
    const effect = options.effect ?? pickEffect(from, target, direction)
    const pointer = lastPointer.current
    const stage = stageRef.current
    let origin: Transition['origin'] = null
    if (pointer && stage && performance.now() - pointer.time < 800) {
      const box = stage.getBoundingClientRect()
      origin = { x: pointer.x - box.left, y: pointer.y - box.top }
    }

    if (scenes[target].id === 'gallery') {
      setGalleryState((state) => ({ ...state, previous: null }))
    }
    const image = scenes[target].id === 'gallery' ? gallery[galleryRef.current.index].src : scenes[target].image
    if (image) await Promise.race([preload(image), wait(400)])

    setRevealed(false)
    setTransition({ from, to: target, direction, effect, origin })
  }, [])

  const next = useCallback(() => {
    const index = currentRef.current
    if (index === scenes.length - 1) goTo(0, { effect: 'warp', direction: 1 })
    else goTo(index + 1)
  }, [goTo])

  const previous = useCallback(() => {
    if (currentRef.current > 0) goTo(currentRef.current - 1)
  }, [goTo])

  const goToId = useCallback((id: SceneId) => goTo(sceneIndex(id)), [goTo])

  const stepGallery = useCallback((step: Direction) => {
    setGalleryState((state) => ({
      index: (state.index + step + gallery.length) % gallery.length,
      previous: state.index,
      direction: step,
    }))
  }, [])

  const selectGallery = useCallback((index: number) => {
    setGalleryState((state) =>
      index === state.index ? state : { index, previous: state.index, direction: index > state.index ? 1 : -1 },
    )
  }, [])

  // Run the transition before the browser paints, so the incoming scene never
  // flashes up in its resting state.
  useLayoutEffect(() => {
    if (!transition) return
    const stage = stageRef.current
    const overlay = overlayRef.current
    const fromId = scenes[transition.from].id
    const toId = scenes[transition.to].id
    const from = sceneElements.current.get(fromId)
    const to = sceneElements.current.get(toId)
    const finish = () => {
      // Update the ref before accepting input again: the effect that syncs it
      // runs later, and a held key would otherwise replay this transition.
      currentRef.current = transition.to
      setCurrent(transition.to)
      setTransition(null)
      setRevealed(true)
      setAnnouncement(`${scenes[transition.to].label}, ${transition.to + 1} of ${scenes.length}`)
      busy.current = false
    }
    if (!stage || !overlay || !from || !to) {
      finish()
      return
    }

    const animations: Animation[] = []
    const timers: number[] = []
    const run = effects[prefersReducedMotion() ? 'fade' : transition.effect]
    let revealedEarly = false
    const reveal = () => {
      if (revealedEarly) return
      revealedEarly = true
      setRevealed(true)
    }

    run({
      stage,
      overlay,
      from,
      to,
      fromId,
      toId,
      direction: transition.direction,
      origin: transition.origin,
      reveal,
      revealAfter: (ms) => {
        timers.push(window.setTimeout(reveal, ms))
      },
      animate: (element, keyframes, options) => {
        const animation = element.animate(keyframes, { fill: 'both', ...options })
        animations.push(animation)
        return animation
      },
    })
      .catch(() => undefined)
      .then(() => {
        for (const timer of timers) clearTimeout(timer)
        // Hide the outgoing scene before cancelling, so it can't reappear for a frame.
        from.style.visibility = 'hidden'
        for (const animation of animations) animation.cancel()
        overlay.replaceChildren()
        overlay.removeAttribute('style')
        stage.style.perspective = ''
        to.removeAttribute('style')
        finish()
        to.focus({ preventScroll: true })
      })
  }, [transition])

  // Keyboard: Enter or Space for the next scene, plus arrows and Page keys.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      const onControl = Boolean(target?.closest('a, button, [role="button"]'))
      const inGallery = scenes[currentRef.current].id === 'gallery'

      switch (event.key) {
        case 'Enter':
        case ' ':
          // A focused button or link handles these keys itself.
          if (onControl) return
          event.preventDefault()
          if (event.key === ' ' && event.shiftKey) previous()
          else next()
          break
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          next()
          break
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          previous()
          break
        case 'ArrowRight':
          event.preventDefault()
          if (inGallery) stepGallery(1)
          else next()
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (inGallery) stepGallery(-1)
          else previous()
          break
        case 'Home':
          event.preventDefault()
          goTo(0)
          break
        case 'End':
          event.preventDefault()
          goTo(scenes.length - 1)
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goTo, next, previous, stepGallery])

  // Mouse wheel and trackpad: one scene per scroll gesture.
  useEffect(() => {
    const gesture = { last: -Infinity, total: 0, armed: true }
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      if (event.timeStamp - gesture.last > WHEEL_GESTURE_GAP) {
        gesture.total = 0
        gesture.armed = true
      }
      gesture.last = event.timeStamp
      if (busy.current) gesture.armed = false
      if (!gesture.armed || insideScrollable(event.target, event.deltaY)) return
      gesture.total += event.deltaY
      if (Math.abs(gesture.total) < WHEEL_DISTANCE) return
      gesture.armed = false
      if (gesture.total > 0) next()
      else previous()
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [next, previous])

  // Touch: swipe up or left for next, down or right for back; sideways browses the gallery.
  useEffect(() => {
    let start: { x: number; y: number; target: EventTarget | null } | null = null
    const onTouchStart = (event: TouchEvent) => {
      start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY, target: event.target } : null
    }
    const onTouchEnd = (event: TouchEvent) => {
      if (!start) return
      const dx = event.changedTouches[0].clientX - start.x
      const dy = event.changedTouches[0].clientY - start.y
      const target = start.target instanceof Element ? start.target : null
      start = null
      if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_DISTANCE) return
      if (Math.abs(dy) > Math.abs(dx)) {
        if (insideScrollable(target, -dy)) return
        if (dy < 0) next()
        else previous()
      } else {
        if (target?.closest('[data-swipe-ignore]')) return
        if (scenes[currentRef.current].id === 'gallery') stepGallery(dx < 0 ? 1 : -1)
        else if (dx < 0) next()
        else previous()
      }
    }
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, previous, stepGallery])

  // Mouse parallax: the scene's picture drifts against the pointer.
  const onPointerMove = (event: ReactPointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const stage = stageRef.current
    if (!stage) return
    stage.style.setProperty('--px', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
    stage.style.setProperty('--py', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
  }

  const onPointerDown = (event: ReactPointerEvent) => {
    lastPointer.current = { x: event.clientX, y: event.clientY, time: performance.now() }
  }

  const shown = transition ? [transition.from, transition.to].sort((a, b) => a - b) : [current]
  const settledScene = scenes[transition ? transition.to : current].id

  const renderScene = (index: number, active: boolean) => {
    switch (scenes[index].id) {
      case 'splash':
        return <SplashScene onEnter={next} />
      case 'hero':
        return <HeroScene active={active} onNavigate={goToId} />
      case 'project':
        return <ProjectScene active={active} />
      case 'apartments':
        return <ApartmentsScene active={active} />
      case 'features':
        return <FeaturesScene active={active} />
      case 'gallery':
        return (
          <GalleryScene
            index={galleryState.index}
            previous={galleryState.previous}
            direction={galleryState.direction}
            onSelect={selectGallery}
            onStep={stepGallery}
          />
        )
      case 'contact':
        return <ContactScene active={active} />
    }
  }

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 overflow-hidden bg-black font-sans text-white"
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
    >
      {shown.map((index) => {
        const scene = scenes[index]
        const leaving = transition !== null && index === transition.from
        const active = !leaving && revealed
        return (
          <section
            key={scene.id}
            ref={(element) => {
              if (element) sceneElements.current.set(scene.id, element)
              else sceneElements.current.delete(scene.id)
            }}
            tabIndex={-1}
            aria-roledescription="slide"
            aria-label={`${scene.label}, ${index + 1} of ${scenes.length}`}
            inert={leaving}
            className={`absolute inset-0 outline-none ${leaving ? 'is-leaving z-20' : 'z-10'} ${active ? 'is-active' : ''}`}
          >
            {renderScene(index, active)}
          </section>
        )
      })}

      <div ref={overlayRef} className="pointer-events-none absolute inset-0 z-40" aria-hidden="true" />

      <Navbar current={settledScene} visible={settledScene !== 'splash'} onNavigate={goToId} />
      <Controls current={transition ? transition.to : current} visible={settledScene !== 'splash'} onNavigate={goTo} onNext={next} />

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  )
}
