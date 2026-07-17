import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildMaskedLines } from '@/lib/reveal-lines'

gsap.registerPlugin(ScrollTrigger)

/**
 * Statement section: pinned scrub timeline. Phase 1 — each line slides up out
 * of its clipping mask, the same reveal the hero copy uses. Phase 2 — the USDZ
 * viewer rises into view. ScrollTriggers created here are cleaned up centrally
 * via `ScrollTrigger.getAll().forEach(t => t.kill())` on page leave.
 */
export async function initStatement(): Promise<void> {
  const section = document.getElementById('statement')
  const text    = document.getElementById('statement-text')
  const iframe  = document.getElementById('statement-iframe')

  if (!section || !text || !iframe) return

  // Splitting measures where the text wraps — see entry-reveal for why this
  // must not race the webfont.
  await document.fonts.ready

  const lines = buildMaskedLines(text)
  if (lines.length === 0) return

  gsap.set(lines, { yPercent: 100 })
  gsap.set(iframe, { yPercent: 200 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: '+=180%',
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
    },
  })

  tl.to(lines, {
    yPercent: 0,
    duration: 0.6,
    ease: 'power4.out',
    stagger: { each: 0.08 },
  })
  tl.to(iframe, { yPercent: -40, duration: 2, ease: 'power3.out' }, '>-0.5')

  // The split ran after the other triggers were measured, so re-measure.
  ScrollTrigger.refresh()
}
