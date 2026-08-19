import metrics from '../data/logo-metrics.json'

export interface LogoDimensions {
  /** Path to the whitespace-cropped copy in public/logos/ */
  src: string
  width: number
  height: number
  offsetY: number
}

const STORED_BASE_SIZE = 64

// Dimensions are precomputed by scripts/generate-logo-metrics.mjs (prebuild)
// at baseSize 64; logo-soup's normalize() is linear in baseSize, so rescaling
// here avoids importing the package (and its sharp dependency) at runtime.
// Returns null for logos not yet analyzed (e.g. added after the last deploy).
export function getLogoDimensions(
  logoUrl: string | undefined,
  baseSize: number,
): LogoDimensions | null {
  if (!logoUrl) return null
  const dims = (metrics as Record<string, LogoDimensions & { offsetX: number }>)[logoUrl]
  if (!dims) return null
  const scale = baseSize / STORED_BASE_SIZE
  return {
    src: dims.src,
    width: Math.round(dims.width * scale * 100) / 100,
    height: Math.round(dims.height * scale * 100) / 100,
    offsetY: Math.round(dims.offsetY * scale * 100) / 100,
  }
}
