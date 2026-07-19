import { gsap } from 'gsap'
import { hasBarbaTransitioned } from '@/lib/page-lifecycle'
import { buildMaskedLines } from '@/lib/reveal-lines'

const destroyers: Array<() => void> = []

/**
 * Hero video: starts small, grows to fill the screen via a spring (mass 1,
 * stiffness 115.2, damping 24), matching the Figma prototype's "First Fold"
 * smart-animate. Only plays the small->full choreography on a true hard page
 * load — once Barba has taken over navigation, the page-transition itself
 * already does an equivalent grow-to-reveal, so replaying it here would be a
 * redundant second animation stacked on top of the first.
 */
export function initHero(): void {
  const wrapper  = document.getElementById('video-project')   as HTMLElement | null
  const video    = document.getElementById('scrub-video')     as HTMLVideoElement | null
  const frame    = document.getElementById('video-frame')     as HTMLElement | null
  const headline = document.getElementById('hero-headline')   as HTMLElement | null
  const aside    = document.getElementById('hero-aside')      as HTMLElement | null
  const overlay  = document.getElementById('orange-overlay')  as HTMLElement | null
  const content  = document.getElementById('project-content') as HTMLElement | null

  if (!wrapper || !frame || !video || !overlay || !content) return

  const START_SCALE = window.innerWidth < 1024 ? 0.65 : 0.55
  const skipIntro = hasBarbaTransitioned()

  frame.style.transform = `scale(${skipIntro ? 1 : START_SCALE})`
  frame.style.borderRadius = '0px'
  frame.style.overflow = 'hidden'

  const SPRING = { mass: 1, stiffness: 115.2, damping: 24 }
  let introPos = skipIntro ? 1 : 0 // 0 = collapsed (START_SCALE), 1 = filled (scale 1)
  let introVel = 0
  let introStarted = skipIntro
  let introDone = skipIntro

  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    window.__lenisLocked = true
    window.__lenis?.stop()
  }
  const unlockScroll = () => {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    window.__lenisLocked = false
    window.__lenis?.start()
  }

  if (!skipIntro) lockScroll()

  const applyFrameSize = (pos: number) => {
    const clamped = Math.min(1, Math.max(0, pos))
    frame.style.transform = `scale(${START_SCALE + (1 - START_SCALE) * clamped})`
  }

  // Damped harmonic oscillator step response, mirrors the Figma spring params.
  const stepSpring = (dt: number) => {
    const substeps = 4
    const h = dt / substeps
    for (let i = 0; i < substeps; i++) {
      const displacement = introPos - 1
      const accel = (-SPRING.stiffness * displacement - SPRING.damping * introVel) / SPRING.mass
      introVel += accel * h
      introPos += introVel * h
    }
  }

  if (!skipIntro) {
    gsap.delayedCall(0.8, () => { introStarted = true })
  }

  // iOS requires a play/pause cycle to unlock seeking
  let videoReady = false
  const unlock = () => {
    video.play()
      .then(() => { video.pause(); video.currentTime = 0; videoReady = true })
      .catch(() => { video.currentTime = 0; videoReady = true })
  }
  if (video.readyState >= 1) { unlock() }
  else { video.addEventListener('loadedmetadata', unlock, { once: true }) }

  // Queue-based seeking: never interrupt a seek in progress
  let pendingTime: number | null = null
  video.addEventListener('seeked', () => {
    if (pendingTime !== null) {
      video.currentTime = pendingTime
      pendingTime = null
    }
  })

  const getProgress = () => {
    const rect = wrapper.getBoundingClientRect()
    const scrollable = wrapper.offsetHeight - window.innerHeight
    return scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
  }

  // Project-content reveal: split the title + description into masked lines and
  // drive them from the same end-of-scroll progress (cp) below, so they rise
  // out of their clipping masks like the Statement section, instead of the
  // whole block sliding up as one. Split only after fonts are ready — measuring
  // line wraps against the fallback face bakes in the wrong breaks.
  let contentLines: HTMLElement[] = []
  document.fonts.ready.then(() => {
    const targets = content.querySelectorAll<HTMLElement>('[data-reveal-content]')
    contentLines = Array.from(targets).flatMap((el) => buildMaskedLines(el))
    // Park every line just below its mask until cp drives it up.
    contentLines.forEach((line) => {
      line.style.transform = 'translateY(100%)'
    })
  })

  let lastTs: number | null = null

  const tick = () => {
    if (introStarted && !introDone) {
      const now = performance.now()
      const dt = lastTs === null ? 0 : Math.min(0.05, (now - lastTs) / 1000)
      lastTs = now
      stepSpring(dt)
      if (Math.abs(introPos - 1) < 0.001 && Math.abs(introVel) < 0.001) {
        introDone = true
        introPos = 1
        unlockScroll()
      }
      applyFrameSize(introPos)
    }

    const p = getProgress()

    // Hero text exits as soon as scrubbing starts: both groups slide down off
    // the bottom edge and fade, clearing the man before the video scrubs.
    const rawExit = Math.max(0, Math.min(1, p / 0.12))
    const exit = 1 - Math.pow(1 - rawExit, 3) // easeOutCubic
    if (headline) {
      headline.style.opacity = String(1 - exit)
      headline.style.transform = `translate3d(0, ${140 * exit}px, 0)`
    }
    if (aside) {
      aside.style.opacity = String(1 - exit)
      aside.style.transform = `translate3d(0, ${140 * exit}px, 0)`
    }

    if (videoReady && video.duration) {
      const t = p * video.duration
      if (video.seeking) {
        pendingTime = t
      } else {
        video.currentTime = t
      }
    }

    overlay.style.opacity = String(Math.max(0, Math.min(1, (p - 0.78) / 0.22)))
    const cp = Math.max(0, Math.min(1, (p - 0.9) / 0.1))
    if (contentLines.length > 0) {
      // Block fades in fast; the masked lines do the staggered rise.
      content.style.opacity = String(Math.min(1, cp / 0.2))
      content.style.transform = ''
      const n = contentLines.length
      const span = 0.6 // portion of cp each line spends rising
      const spread = 1 - span
      contentLines.forEach((line, i) => {
        const start = n > 1 ? (i / (n - 1)) * spread : 0
        const lp = Math.max(0, Math.min(1, (cp - start) / span))
        const eased = 1 - Math.pow(1 - lp, 3) // easeOutCubic
        line.style.transform = `translateY(${(1 - eased) * 100}%)`
      })
    } else {
      // Fallback until fonts resolve and the split lands: original block slide.
      content.style.opacity = String(cp)
      content.style.transform = `translateY(${(1 - cp) * 60}px)`
    }
  }

  gsap.ticker.add(tick)
  destroyers.push(() => gsap.ticker.remove(tick))
}

export function destroyHero(): void {
  destroyers.splice(0).forEach((fn) => fn())
}
