const DURATION = 6000

let activeTimer: ReturnType<typeof setTimeout> | undefined

/**
 * Testimonials carousel: auto-advances every 6s with a progress bar.
 * The setTimeout chain must be explicitly cleared on page leave — otherwise
 * it keeps rescheduling itself forever against a detached DOM after every
 * Barba navigation away from a page that rendered this section.
 */
export function initTestimonials(): void {
  const section = document.getElementById('testimonials-section')
  if (!section) return

  const slides = section.querySelectorAll<HTMLElement>('.testimonial-slide')
  const progress = document.getElementById('testimonial-progress') as HTMLElement | null
  let current = 0

  function goTo(index: number) {
    slides.forEach((s, i) => {
      s.style.display = i === index ? '' : 'none'
    })
    current = index
    startProgress()
  }

  function startProgress() {
    if (!progress) return
    clearTimeout(activeTimer)
    progress.style.transition = 'none'
    progress.style.width = '0%'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${DURATION}ms linear`
        progress.style.width = '100%'
      })
    })
    activeTimer = setTimeout(() => {
      goTo((current + 1) % slides.length)
    }, DURATION)
  }

  if (slides.length > 0) goTo(0)
}

export function destroyTestimonials(): void {
  clearTimeout(activeTimer)
  activeTimer = undefined
}
