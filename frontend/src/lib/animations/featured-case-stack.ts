import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
        let translateY = 0
        let pe = 'none'

        if (i === currentSegment) {
          opacity = 1 - textProgress
          if (opacity > 0.5) pe = 'auto'
        } else if (i === currentSegment + 1) {
          opacity = textProgress
          translateY = (1 - textProgress) * 24
          if (opacity > 0.5) pe = 'auto'
        }

        text.style.opacity = String(opacity)
        text.style.transform = `translateY(${translateY}px)`
        text.style.pointerEvents = pe
      })
    },
  })
}
