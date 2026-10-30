import barba from '@barba/core'
import { gsap } from 'gsap'
import { destroyPage, initPage, markBarbaTransitioned } from '@/lib/page-lifecycle'
import { trackPageView } from '@/lib/tracking'

// Same spring the hero video's "First Fold" intro uses, from the Figma prototype.
const SPRING = { mass: 1, stiffness: 115.2, damping: 24 }

function smallScale(): number {
  return window.innerWidth < 1024 ? 0.65 : 0.55
}

function lockScroll() {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
}

/**
 * Frosted scrim that sits between the outgoing page and the incoming card, so
 * the old content reads as blurred glass instead of a legible second page.
 */
function createGlass(): HTMLElement {
  // Drop any scrim left behind by a transition that got interrupted.
  document.querySelectorAll('[data-barba-glass]').forEach((el) => el.remove())

  const glass = document.createElement('div')
  glass.setAttribute('data-barba-glass', '')
  Object.assign(glass.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '9998',
    opacity: '0',
    pointerEvents: 'none',
    // Pure defocus — no tint. The page underneath keeps its own colour and
    // just goes out of focus, which is what makes it read as glass rather
    // than as a dimmed overlay.
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
  } as Partial<CSSStyleDeclaration>)
  document.body.appendChild(glass)
  return glass
}

/**
 * Runs the small-card spring-grow (same damped-oscillator math as the hero
 * intro) on `el`, calling `onDone` once it settles at full scale.
 */
function springGrow(el: HTMLElement, onDone: () => void) {
  let pos = 0
  let vel = 0
  let lastTs: number | null = null
  const scale0 = smallScale()

  const tick = () => {
    const now = performance.now()
    const dt = lastTs === null ? 0 : Math.min(0.05, (now - lastTs) / 1000)
    lastTs = now

    const substeps = 4
    const h = dt / substeps
    for (let i = 0; i < substeps; i++) {
      const displacement = pos - 1
      const accel = (-SPRING.stiffness * displacement - SPRING.damping * vel) / SPRING.mass
      vel += accel * h
      pos += vel * h
    }

    const clamped = Math.min(1, Math.max(0, pos))
    gsap.set(el, {
      scale: scale0 + (1 - scale0) * clamped,
    })

    if (Math.abs(pos - 1) < 0.001 && Math.abs(vel) < 0.001) {
      gsap.ticker.remove(tick)
      onDone()
    }
  }

  gsap.ticker.add(tick)
}

export function initBarba(): void {
  // True hard load — no navigation happened yet.
  initPage()

  if (!document.querySelector('[data-barba="wrapper"]')) return

  barba.init({
    // @barba/core defaults to a 2000ms fetch timeout, then force-navigates
    // natively as a fallback. Astro's dev server compiles routes on demand,
    // which routinely takes longer than that on a route's first visit —
    // raise it well clear of that (production serves pre-built pages, so
    // this only ever matters as a ceiling for a genuinely broken request).
    timeout: 15000,
    transitions: [
      {
        name: 'reveal-grow',
        sync: true,
        beforeLeave() {
          destroyPage()
        },
        leave() {
          // The outgoing page just stays put and visible — it's only removed
          // once the incoming page has fully grown to cover the screen.
        },
        enter({ current, next }) {
          return new Promise<void>((resolve) => {
            const el = next.container as HTMLElement

            const glass = createGlass()

            lockScroll()
            el.style.position = 'fixed'
            el.style.inset = '0'
            el.style.zIndex = '9999'
            el.style.overflow = 'hidden'
            el.style.transformOrigin = '50% 50%'
            el.style.boxShadow = '0 24px 64px rgba(0, 0, 0, 0.18)'
            gsap.set(el, {
              scale: smallScale(),
              yPercent: 100,
              opacity: 0,
            })

            gsap.timeline()
              // Phase A — the scrim frosts over the old page while the incoming
              // card slides up from below with a fade, landing small & centered.
              .to(glass, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
              .to(el, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0)
              // The 800ms pause from the Figma prototype before the spring kicks in.
              .to({}, { duration: 0.8 })
              .call(() => {
                springGrow(el, () => {
                  el.style.position = ''
                  el.style.inset = ''
                  el.style.zIndex = ''
                  el.style.overflow = ''
                  el.style.transformOrigin = ''
                  el.style.boxShadow = ''
                  gsap.set(el, { clearProps: 'transform,opacity' })

                  glass.remove()
                  current.container.remove()
                  window.scrollTo(0, 0)
                  unlockScroll()
                  resolve()
                })
              })
          })
        },
        afterEnter() {
          markBarbaTransitioned()
          initPage()
          trackPageView()
          // Header is persistent and re-derives its light/dark theme from a
          // 'scroll' listener (elementsFromPoint below the pill) — nudge it
          // to recheck against the new page instead of waiting for the user
          // to scroll first.
          window.dispatchEvent(new Event('scroll'))
        },
      },
    ],
  })
}
