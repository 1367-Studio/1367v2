import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Statement section: pinned scrub timeline. Phase 1 — each letter rotates
 * upright out of a clipped mask (mwg_effect058 style). Phase 2 — the USDZ
 * viewer rises into view. ScrollTriggers created here are cleaned up
 * centrally via `ScrollTrigger.getAll().forEach(t => t.kill())` on page leave.
 */
export function initStatement(): void {
  const section = document.getElementById('statement')
  const text    = document.getElementById('statement-text')
  const iframe  = document.getElementById('statement-iframe')

  if (!section || !text || !iframe) return

  const words = (text.textContent ?? '').trim().split(/\s+/)
  text.innerHTML = words
    .map((word) => {
      const letters = [...word]
        .map(
          (ch) =>
            `<span class="letter" style="display:inline-block;clip-path:polygon(0 0,0 100%,100% 100%,100% 0)"><span style="display:inline-block">${ch}</span></span>`
        )
        .join('')
      return `<span class="word" style="display:inline-block">${letters}</span>`
    })
    .join(' ')

  const letters = text.querySelectorAll('.letter span')

  gsap.set(letters, { rotate: -80, transformOrigin: '50% 120%' })
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

  tl.to(letters, {
    rotate: 0,
    duration: 0.6,
    ease: 'back.out(1.1)',
    stagger: { each: 0.02 },
  })
  tl.to(iframe, { yPercent: -40, duration: 2, ease: 'power3.out' }, '>-0.5')
}
