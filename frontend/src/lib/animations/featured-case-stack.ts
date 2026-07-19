import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildMaskedLines } from '@/lib/reveal-lines'

gsap.registerPlugin(ScrollTrigger)

/**
 * Slides a case's text lines up out of their clipping masks. `amount` 0 = fully
 * hidden below the mask, 1 = fully revealed, staggered top-to-bottom so a
 * partial `amount` shows the first lines already up while later ones follow.
 */
function applyLineReveal(lines: HTMLElement[], amount: number): void {
  const n = lines.length
  const span = 0.6 // portion of `amount` each line spends rising
  const spread = 1 - span
  lines.forEach((line, i) => {
    const start = n > 1 ? (i / (n - 1)) * spread : 0
    const lp = Math.max(0, Math.min(1, (amount - start) / span))
    const eased = 1 - Math.pow(1 - lp, 3) // easeOutCubic
    line.style.transform = `translateY(${(1 - eased) * 100}%)`
  })
}

/**
 * Featured cases stacked-scroll: each case slides up over the previous one,
 * with the outgoing (current) case parallaxing upward more slowly than the
 * incoming one. Used on both the home page and /projects. The ScrollTrigger
 * created here is cleaned up centrally on page leave.
 */
export function initFeaturedCaseStack(): void {
  const wrapper     = document.querySelector('[data-cases-wrapper]') as HTMLElement | null
  const imageSlides = Array.from(document.querySelectorAll('[data-case-images]')) as HTMLElement[]
  const textSlides  = Array.from(document.querySelectorAll('[data-case-text]'))  as HTMLElement[]

  if (!wrapper || imageSlides.length <= 1) return

  const N = imageSlides.length

  // Split each case's tag/title/description into masked lines. Deferred until
  // fonts are ready — measuring line wraps against the fallback face bakes in
  // the wrong breaks. Parked hidden; the ScrollTrigger below drives them.
  const caseLines: HTMLElement[][] = textSlides.map(() => [])
  document.fonts.ready.then(() => {
    textSlides.forEach((slide, i) => {
      const targets = slide.querySelectorAll<HTMLElement>('[data-case-reveal]')
      caseLines[i] = Array.from(targets).flatMap((el) => buildMaskedLines(el))
      applyLineReveal(caseLines[i], 0)
    })
  })

  ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate(self) {
      const progress = self.progress
      const rawSegment      = progress * (N - 1)
      const currentSegment  = Math.min(Math.floor(rawSegment), N - 2)
      const segmentProgress = rawSegment - currentSegment

      // imagens: próximo case sobe de baixo, e o case atual (de cima) acompanha
      // com parallax mais lento, subindo só uma fração da distância
      const PARALLAX_RATIO = 0.3

      imageSlides.forEach((slide, i) => {
        if (i === currentSegment + 1) {
          slide.style.transform = `translateY(${(1 - segmentProgress) * 100}%)`
        } else if (i === currentSegment) {
          slide.style.transform = `translateY(${-segmentProgress * PARALLAX_RATIO * 100}%)`
        } else if (i < currentSegment) {
          slide.style.transform = 'translateY(0%)'
        } else {
          slide.style.transform = 'translateY(100%)'
        }
      })

      // textos: swap nos últimos 20% do slide
      const fadeStart    = 0.8
      const textProgress = Math.max(0, (segmentProgress - fadeStart) / (1 - fadeStart))

      textSlides.forEach((text, i) => {
        let opacity = 0
        let pe = 'none'

        if (i === currentSegment) {
          opacity = 1 - textProgress
          if (opacity > 0.5) pe = 'auto'
        } else if (i === currentSegment + 1) {
          opacity = textProgress
          if (opacity > 0.5) pe = 'auto'
        }

        text.style.opacity = String(opacity)
        text.style.pointerEvents = pe

        // Masked line reveal, kept in sync with the stack. The masks now do the
        // vertical motion, so the container no longer translates.
        let reveal: number
        if (i < currentSegment) {
          reveal = 1 // already passed — stays up
        } else if (i === currentSegment) {
          // The first case has no incoming transition, so give it an entry
          // reveal over the first half-segment; later current cases were
          // already revealed when they slid in.
          reveal = i === 0 ? Math.min(1, rawSegment / 0.5) : 1
        } else if (i === currentSegment + 1) {
          reveal = textProgress // rises as the card swaps in
        } else {
          reveal = 0 // still below
        }
        applyLineReveal(caseLines[i], reveal)
      })
    },
  })
}
