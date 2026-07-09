declare global {
  interface Window {
    THREE?: unknown
    Globe?: {
      init: (opts: { canvas: HTMLCanvasElement; cardsLayer: HTMLElement; sceneEl: HTMLElement }) => void
      setConfig: (next: Record<string, unknown>) => void
      destroy: () => void
    }
  }
}

let loadPromise: Promise<void> | null = null

function loadScriptOnce(src: string): Promise<void> {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
  if (existing) {
    return new Promise((resolve) => {
      // Already requested (e.g. present in the initial hard-loaded HTML) —
      // it may already have executed, or still be loading; either way, once
      // loaded it stays loaded, so just wait for it if it hasn't fired yet.
      if ((existing as any)._loaded) resolve()
      else existing.addEventListener('load', () => resolve(), { once: true })
    })
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      ;(script as any)._loaded = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
}

async function ensureGlobeEngineLoaded(): Promise<void> {
  if (!loadPromise) {
    // Barba fetches page HTML as inert markup — <script src="..."> tags in it
    // never execute on their own, so the globe engine has to be loaded by
    // hand the first time we ever need it, whichever page that happens on.
    loadPromise = (async () => {
      if (!window.THREE) await loadScriptOnce('/three.globe.js')
      if (!window.Globe) await loadScriptOnce('/globe-engine.js')
    })()
  }
  return loadPromise
}

/**
 * Building Worldwide globe (Three.js canvas). `Globe.init()` is not
 * idempotent on its own — it always starts a fresh render loop — so we call
 * `Globe.destroy()` first (it also runs internally as a safety net) whenever
 * re-entering a page that has this section.
 */
export async function initGlobe(): Promise<void> {
  const canvas = document.getElementById('globe-canvas') as HTMLCanvasElement | null
  const cardsLayer = document.getElementById('globe-cards')
  const sceneEl = document.getElementById('globe-scene')

  if (!canvas || !cardsLayer || !sceneEl) return

  await ensureGlobeEngineLoaded()
  if (!window.Globe) return

  window.Globe.destroy()
  window.Globe.init({ canvas, cardsLayer, sceneEl })
  window.Globe.setConfig({ spins: 0, density: 'dense' })
}

export function destroyGlobe(): void {
  window.Globe?.destroy()
}
