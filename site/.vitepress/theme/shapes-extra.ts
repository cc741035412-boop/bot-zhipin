import { PROFILE_SAMPLES } from './vendor/bloub/profiles'
import { profileFromPolygon, unionOfCirclesProfile, type Point } from './vendor/bloub/shape'

// Original geometric constructions, not x.ai paths. Screen coordinates: y points down.
// All sampling happens once at module load; callers must reuse the resulting arrays.
const TAU = Math.PI * 2
const normalize = (radii: number[], peak = 1.18) => {
  const scale = peak / Math.max(...radii)
  return radii.map((r) => r * scale)
}
// Circular binomial smoothing rounds both tips and notches without a seam at 0°.
// Normalize afterwards so rounding does not shrink bodies around the fixed eyes.
const soften = (radii: number[], passes = 4) => {
  let result = radii
  const n = result.length
  for (let pass = 0; pass < passes; pass++) {
    result = result.map((r, i) => (result[(i + n - 1) % n] + 2 * r + result[(i + 1) % n]) / 4)
  }
  return normalize(result)
}
const polygon = (vertices: number[][]) => {
  const points = vertices.map(([x, y]) => ({ x, y }))
  // Shoelace area centroid, not the vertex average (arcs have many more vertices
  // than straight edges). Cast from here to keep asymmetrical bodies centered.
  let area = 0, cx = 0, cy = 0
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length]
    const cross = a.x * b.y - b.x * a.y
    area += cross
    cx += (a.x + b.x) * cross
    cy += (a.y + b.y) * cross
  }
  return soften(profileFromPolygon(points, cx / (3 * area), cy / (3 * area)))
}
const parametric = (fn: (t: number) => Point) => polygon(
  Array.from({ length: 256 }, (_, i) => {
    const { x, y } = fn(i * TAU / 256)
    return [x, y]
  })
)
const radial = (fn: (a: number) => number) => normalize(
  Array.from({ length: PROFILE_SAMPLES }, (_, i) => fn(i * TAU / PROFILE_SAMPLES))
)
const arc = (cx: number, cy: number, rx: number, ry: number, start: number, end: number) =>
  Array.from({ length: 65 }, (_, i) => {
    const a = start + (end - start) * i / 64
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]
  })

export const EXTRA_SHAPES: Readonly<Record<string, number[]>> = {
  // Kidney bean: an upright ellipse with a smooth, shallow indentation on its left.
  bean: radial((a) => (1 - 0.27 * Math.exp(-(((a - Math.PI) / 0.5) ** 2))) /
    Math.hypot(Math.cos(a) / 0.85, Math.sin(a))),
  // Two elliptical caps connected by vertical sides (a cylinder's outer silhouette).
  cylinder: polygon([
    ...arc(0, -0.59, 0.72, 0.24, Math.PI, TAU),
    ...arc(0, 0.59, 0.72, 0.24, 0, Math.PI)
  ]),
  // A broad, cut gemstone versus a tall, pointed six-sided crystal.
  gem: polygon([[-0.58, -0.76], [0.58, -0.76], [0.98, -0.24], [0, 1.05], [-0.98, -0.24]]),
  crystal: polygon([[0, -1.1], [0.78, -0.57], [0.78, 0.57], [0, 1.1], [-0.78, 0.57], [-0.78, -0.57]]),
  // A pie wedge: a circular outer edge above/right, a pointed heel below/left.
  wedge: polygon([...arc(0, 0, 1.08, 1.08, -Math.PI / 2, 0), [-0.8, 0.8]]),
  shield: polygon([[-0.83, -0.78], [0.83, -0.78], [0.76, 0.25], [0.45, 0.69], [0, 1.04], [-0.45, 0.69], [-0.76, 0.25]]),
  // Dome: wide half-ellipse on a flat base. Arch: upright walls below a round crown.
  // A taller crown leaves padding above the eyes after area-centering.
  dome: polygon(arc(0, 0.38, 1.04, 1.3, Math.PI, TAU)),
  arch: polygon([...arc(0, -0.22, 0.7, 0.7, Math.PI, TAU), [0.7, 0.83], [-0.7, 0.83]]),
  // A pointed, tilted lens; two curved edges meet at opposite tips.
  leaf: parametric((t) => {
    const x = Math.cos(t)
    const y = 0.69 * Math.sin(t) * Math.abs(Math.sin(t))
    const angle = -Math.PI / 4
    return { x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) }
  }),
  // Four tapering rays, not the five straight-sided tips of star.
  sparkle: radial((a) => 0.64 + 0.44 * Math.abs(Math.cos(2 * a)) ** 4),
  // One pass rounds circle intersections without erasing the petal clefts.
  clover: soften(unionOfCirclesProfile([
    { x: -0.38, y: -0.38, r: 0.57 }, { x: 0.38, y: -0.38, r: 0.57 },
    { x: 0.38, y: 0.38, r: 0.57 }, { x: -0.38, y: 0.38, r: 0.57 }
  ]), 1),
  flower: soften(unionOfCirclesProfile(Array.from({ length: 6 }, (_, i) => {
    const a = -Math.PI / 2 + i * TAU / 6
    return { x: 0.6 * Math.cos(a), y: 0.6 * Math.sin(a), r: 0.48 }
  })), 1),
  // Analytic heart with a shallower cleft (cos(2t) coefficient 3 rather than 5)
  // for eye clearance; area-centering replaces the old upward translation.
  heart: parametric((t) => ({
    x: 16 * Math.sin(t) ** 3 / 17,
    y: -(13 * Math.cos(t) - 3 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 17
  })),
  house: polygon([[0, -1.06], [0.83, -0.34], [0.83, 0.78], [-0.83, 0.78], [-0.83, -0.34]]),
  // Keep the radial hub fixed: recentering the unequal clefts would shorten the
  // top ray relative to the lower tips. Its area centroid remains near zero.
  star: soften(profileFromPolygon(Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + i * Math.PI / 5
    // The upper clefts are shallower to leave room for the eyes; keep the
    // other three clefts deep enough to read as a star, not a pentagon.
    const r = i % 2 ? (i === 1 || i === 9 ? 0.76 : 0.62) : 1.08
    return { x: r * Math.cos(a), y: r * Math.sin(a) }
  }), 0, 0), 2)
}
