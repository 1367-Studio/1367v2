import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smooth-scroll'
import { initTextReveal } from '@/lib/text-reveal'
import { initHero, destroyHero } from '@/lib/animations/hero'
import { initEntryReveal, destroyEntryReveal } from '@/lib/animations/entry-reveal'
import { initStatement } from '@/lib/animations/statement'
import { initFocusAreas } from '@/lib/animations/focus-areas'
import { initGlobe, destroyGlobe } from '@/lib/animations/globe'
import { initTestimonials, destroyTestimonials } from '@/lib/animations/testimonials'
import { initFeaturedCaseStack } from '@/lib/animations/featured-case-stack'
import { initContactForm } from '@/lib/animations/contact-form'
import { initGravityText, destroyGravityText } from '@/lib/animations/gravity-text'

gsap.registerPlugin(ScrollTrigger)

let transitioned = false

/** True once Barba has completed at least one page transition. */
export function hasBarbaTransitioned(): boolean {
  return transitioned
}

export function markBarbaTransitioned(): void {
  transitioned = true
}

/**
 * Runs every per-section init. Each one self-guards on the elements it
 * needs, so it's safe (and cheap) to call all of them on every page — only
 * the ones whose markup is actually present in the current container do
 * anything.
 */
export function initPage(): void {
  initSmoothScroll()
  initTextReveal()
  initHero()
  void initEntryReveal()
  void initStatement()
  initFocusAreas()
  void initGlobe()
  initTestimonials()
  initFeaturedCaseStack()
  initContactForm()
  initGravityText()
}

/**
 * Tears down everything global/persistent that `initPage()` may have set up,
 * before Barba swaps in the next page's container.
 */
export function destroyPage(): void {
  destroySmoothScroll()
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  destroyHero()
  destroyEntryReveal()
  destroyTestimonials()
  destroyGlobe()
  destroyGravityText()
}
