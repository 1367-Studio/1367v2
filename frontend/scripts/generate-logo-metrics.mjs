// Downloads the brand logos referenced in Sanity, crops away the whitespace
// around the artwork (the source SVGs share a padded canvas, which breaks
// logo-soup sizing), writes the cropped copies to public/logos/, analyzes
// them with logo-soup, and writes src/data/logo-metrics.json (original URL
// -> { src, width, height, offsetX, offsetY } at baseSize 64). Runs as
// `prebuild`. Failures skip the logo, never the build.
import { createClient } from '@sanity/client'
import { analyze, normalize } from 'logo-soup'
import sharp from 'sharp'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url)) + '/..'
const logosDir = join(root, 'public/logos')

async function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    try {
      const content = await readFile(join(root, file), 'utf8')
      for (const line of content.split('\n')) {
        const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"\n]*)"?\s*$/)
        if (match && !(match[1] in process.env)) process.env[match[1]] = match[2]
      }
    } catch {
      // file absent (e.g. on Vercel, where env vars come from the platform)
    }
  }
}

// Rasterize, trim, and report the content box as fractions of the canvas.
async function findContentBox(buffer, isSvg) {
  const density = isSvg ? 72 * 8 : undefined
  const raster = await sharp(buffer, density ? { density } : {})
    .ensureAlpha()
    .png()
    .toBuffer({ resolveWithObject: true })
  const trimmed = await sharp(raster.data)
    .trim({ threshold: 10 })
    .toBuffer({ resolveWithObject: true })
  const { width: fullW, height: fullH } = raster.info
  return {
    trimmedBuffer: trimmed.data,
    x: -trimmed.info.trimOffsetLeft / fullW,
    y: -trimmed.info.trimOffsetTop / fullH,
    w: trimmed.info.width / fullW,
    h: trimmed.info.height / fullH,
  }
}

// Crop an SVG to its content by rewriting the root viewBox; keeps it vector.
function cropSvg(svgText, box) {
  const rootTag = svgText.match(/<svg\b[^>]*>/i)?.[0]
  if (!rootTag) return null
  const viewBoxMatch = rootTag.match(/viewBox\s*=\s*["']([^"']+)["']/i)
  let [vx, vy, vw, vh] = viewBoxMatch
    ? viewBoxMatch[1].trim().split(/[\s,]+/).map(Number)
    : [
        0,
        0,
        Number.parseFloat(rootTag.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1]),
        Number.parseFloat(rootTag.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1]),
      ]
  if (![vx, vy, vw, vh].every(Number.isFinite) || !vw || !vh) return null
  const viewBox = [vx + box.x * vw, vy + box.y * vh, box.w * vw, box.h * vh]
    .map((n) => Math.round(n * 1000) / 1000)
    .join(' ')
  const newRootTag = rootTag
    .replace(/\s(width|height|viewBox)\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/<svg\b/i, `<svg viewBox="${viewBox}"`)
  return svgText.replace(rootTag, newRootTag)
}

async function main() {
  await loadEnv()

  const client = createClient({
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    apiVersion: '2024-01-01',
    useCdn: true,
  })

  const sections = await client.fetch(
    `*[_type in ["projectSection", "testimonialsSection"]]{ "logoUrls": brands[].logo.asset->url }`,
  )
  const urls = [...new Set(sections.flatMap((s) => s.logoUrls ?? []).filter(Boolean))]
  console.log(`logo-metrics: processing ${urls.length} logos`)

  await mkdir(logosDir, { recursive: true })

  const metrics = {}
  for (const url of urls) {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      const isSvg = url.endsWith('.svg')
      const box = await findContentBox(buffer, isSvg)

      let fileName = url.split('/').pop()
      const croppedSvg = isSvg ? cropSvg(buffer.toString('utf8'), box) : null
      if (croppedSvg) {
        await writeFile(join(logosDir, fileName), croppedSvg)
      } else {
        // Raster fallback: the trimmed high-res PNG from analysis
        fileName = fileName.replace(/\.[a-z]+$/i, '') + '.png'
        await writeFile(join(logosDir, fileName), box.trimmedBuffer)
      }

      // Analyze the cropped file so metrics describe the artwork itself.
      // Dimensions are stored at baseSize 64; normalize() is linear in
      // baseSize, so render-time code rescales with plain arithmetic
      // instead of importing logo-soup (whose entry module loads sharp).
      const result = await analyze(join(logosDir, fileName))
      if (result) metrics[url] = { src: `/logos/${fileName}`, ...normalize(result, { baseSize: 64 }) }
      else console.warn(`logo-metrics: no content detected in ${url}`)
    } catch (error) {
      console.warn(`logo-metrics: skipping ${url}: ${error.message}`)
    }
  }

  const outFile = join(root, 'src/data/logo-metrics.json')
  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, JSON.stringify(metrics, null, 2) + '\n')
  console.log(`logo-metrics: wrote ${Object.keys(metrics).length} entries to src/data/logo-metrics.json`)
}

main().catch((error) => {
  console.warn(`logo-metrics: generation failed, keeping existing metrics: ${error.message}`)
})
