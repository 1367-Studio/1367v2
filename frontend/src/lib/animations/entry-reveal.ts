import { gsap } from 'gsap'
import { hasBarbaTransitioned } from '@/lib/page-lifecycle'
import { buildMaskedLines } from '@/lib/reveal-lines'

const destroyers: Array<() => void> = []

/**
 * Above-the-fold line reveal: each line sits in a static clipping mask and
 * slides up from underneath it. Opt in with `data-reveal-entry`.
 *
 * Entry, not scroll: this copy is already on screen at load, so a ScrollTrigger
 * would either fire instantly or (on the home hero, which sits below the
 * trigger line and is faded out by `initHero` the moment scrolling starts)
 * never usefully fire at all.
 */
export async function initEntryReveal(): Promise<void> {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal-entry]')
  if (targets.length === 0) return

  // Splitting measures where the text wraps, so it must not race the webfont:
  // measured against the fallback face, the line breaks are baked in wrong and
  // lines re-wrap inside their own masks once the real font swaps in.
  await document.fonts.ready

  // The long delay exists only to let the home hero's video frame start growing
  // (initHero begins that at 0.8s). Pages without that intro — and any Barba
  // navigation, where the transition already covers the swap — start promptly.
  const hasHeroIntro = document.getElementById('video-project') !== null
  const target = hasBarbaTransitioned() || !hasHeroIntro ? 0.15 : 0.9
  // Waiting on fonts already burned part of that window; keep the intended
  // moment rather than stacking the delay on top of the font load.
  const startDelay = Math.max(0.1, target - performance.now() / 1000)

  targets.forEach((el, index) => {
    const lines = buildMaskedLines(el)
    if (lines.length === 0) return

    // Transform only — the home hero's subtitle carries its own 0.4 opacity,
    // and the mask is what does the revealing.
    const tween = gsap.from(lines, {
      yPercent: 100,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.09,
      delay: startDelay + index * 0.06,
    })
    destroyers.push(() => tween.kill())
  })
}

export function destroyEntryReveal(): void {
  destroyers.splice(0).forEach((fn) => fn())
}
