import { gallery, images } from '../site'
import type { EffectName } from './effects'

export type SceneId = 'splash' | 'hero' | 'project' | 'apartments' | 'features' | 'gallery' | 'contact'

type Scene = {
  id: SceneId
  label: string
  /** Transition played when arriving here going forwards (and reversed when leaving backwards). */
  enter: EffectName
  /** Background picture, preloaded before the transition starts. */
  image?: string
}

export const scenes: Scene[] = [
  { id: 'splash', label: 'Welcome', enter: 'portal' },
  { id: 'hero', label: 'Home', enter: 'portal', image: images.frontDusk.src },
  { id: 'project', label: 'Project', enter: 'blinds', image: images.streetCorner.src },
  { id: 'apartments', label: 'Apartments', enter: 'iris', image: images.fullElevation.src },
  { id: 'features', label: 'Features', enter: 'shatter', image: images.balconiesCorner.src },
  { id: 'gallery', label: 'Gallery', enter: 'cube', image: gallery[0].src },
  { id: 'contact', label: 'Contact', enter: 'curtain', image: images.entrance.src },
]

export const sceneIndex = (id: SceneId) => scenes.findIndex((scene) => scene.id === id)

/** Scenes listed in the navbar. */
export const navScenes: SceneId[] = ['project', 'apartments', 'gallery', 'contact']
