import faces from '../data/faces.json'
import { avatarSeed } from './avatar'
import { SHAPES, COLORS } from './vendor/bloub/skins'
import { PROFILES } from './vendor/bloub/profiles'
import { EXTRA_SHAPES } from './shapes-extra'

export const XAI_SHAPE_IDS: readonly string[] = [
  'blob', 'pebble', 'bean', 'egg', 'squircle', 'tablet', 'capsule', 'cylinder',
  'hex', 'gem', 'crystal', 'wedge', 'shield', 'dome', 'arch', 'cloud', 'teardrop',
  'leaf', 'square', 'sparkle', 'clover', 'flower', 'heart', 'house', 'star'
]

const mapping: Record<string, string> = {
  blob: 'cercle', pebble: 'galet', squircle: 'squircle', square: 'squircle',
  tablet: 'capsule', capsule: 'capsule', hex: 'hexagone', cloud: 'nuage', teardrop: 'goutte'
}
const profiles = new Map<string, number[]>(Object.entries(EXTRA_SHAPES))
profiles.set('egg', [...PROFILES.egg])
for (const [id, bloubId] of Object.entries(mapping)) {
  // Identity matters: bloub's eye-fit table is keyed by these exact arrays.
  profiles.set(id, SHAPES.find((shape) => shape.id === bloubId)!.radii)
}

export function shapeRadii(xaiId: string): number[] | null {
  return profiles.get(xaiId) ?? null
}

export interface BotFace {
  slug: string
  shape: string
  radii: number[]
  color: string
  source: 'official' | 'seed'
}

interface FaceEntry { color: string; shape: string; fetchedAt?: string }

export function resolveFace(slug: string, entry?: FaceEntry): BotFace {
  const radii = entry ? shapeRadii(entry.shape) : null
  if (entry && radii) {
    return { slug, shape: entry.shape, radii, color: entry.color.toLowerCase(), source: 'official' }
  }
  const seed = avatarSeed(slug)
  const fallback = SHAPES[seed % SHAPES.length]
  return {
    slug,
    shape: `seed:${fallback.id}`,
    radii: fallback.radii,
    color: entry ? entry.color.toLowerCase() : COLORS[Math.floor(seed / SHAPES.length) % COLORS.length].hex,
    source: 'seed'
  }
}

export function botFace(slug: string): BotFace {
  return resolveFace(slug, Object.hasOwn(faces, slug) ? (faces as Record<string, FaceEntry>)[slug] : undefined)
}

export function faceColors(hex: string): { light: string; dark: string; outline: string | null } {
  const light = hex.toLowerCase()
  const rgb = [1, 3, 5].map((start) => {
    const channel = parseInt(light.slice(start, start + 2), 16) / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
  return { light, dark: luminance < 0.04 ? '#f1efe9' : light, outline: luminance > 0.85 ? 'rgba(0,0,0,.12)' : null }
}
