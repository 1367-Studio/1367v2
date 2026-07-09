import { gsap } from 'gsap'

const SPRING = { stiffness: 60, damping: 14 }
const ROTATE_SPRING = { stiffness: 45, damping: 12 }
const PULL_RADIUS = 384
const MAX_PULL = 72

function damped(spring: { stiffness: number; damping: number }, mass = 1) {
  let pos = 0
  let vel = 0
  let target = 0
  return {
    setTarget(v: number) { target = v },
    step(dt: number) {
      const displacement = pos - target
      const accel = (-spring.stiffness * displacement - spring.damping * vel) / mass
      vel += accel * dt
      pos += vel * dt
      return pos
    },
  }
}

interface Instance {
  stage: HTMLElement
  tick: () => void
  measureRestCenters: () => void
}

const instances: Instance[] = []

/**
 * "Gravity" hover text: letters get pulled toward the cursor, strength
 * falling off with distance — as the cursor moves away (or leaves), the pull
 * eases back down via the same damped-oscillator spring used everywhere else
 * (hero intro, page transitions).
 *
 * Supports multiple instances on the same page (e.g. the About hero's, which
 * gets swapped by Barba on every navigation, and the Footer's, which is
 * persistent) — each `.gravity-text` stage is wired up once, guarded by a
 * `data-gravity-init` flag so a persistent instance already running doesn't
 * get double-initialised on the next `initPage()` call.
 */
export function initGravityText(): void {
  const stages = document.querySelectorAll<HTMLElement>('.gravity-text')

  stages.forEach((stage) => {
    if (stage.dataset.gravityInit === '1') return
    stage.dataset.gravityInit = '1'

    const letters = stage.querySelectorAll<HTMLElement>('.gravity-letter')
    if (letters.length === 0) return

    const springs = Array.from(letters).map(() => ({
      x: damped(SPRING),
      y: damped(SPRING),
      r: damped(ROTATE_SPRING),
    }))

    // Rest position of each letter from layout, immune to the transform we
    // apply to it — reading a live getBoundingClientRect() on an already
    // -displaced element would feed back into itself and collapse the pull.
    let restCenters: { x: number; y: number }[] = []
    const measureRestCenters = () => {
      restCenters = Array.from(letters).map((el) => ({
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 2,
      }))
    }
    measureRestCenters()
    window.addEventListener('resize', measureRestCenters)

    let pointer: { x: number; y: number } | null = null

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect()
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    })
    stage.addEventListener('mouseleave', () => { pointer = null })

    let lastTs: number | null = null
    const tick = () => {
      const now = performance.now()
      const dt = lastTs === null ? 0 : Math.min(0.05, (now - lastTs) / 1000)
      lastTs = now

      letters.forEach((el, i) => {
        const s = springs[i]
        if (pointer) {
          const { x: cx, y: cy } = restCenters[i]
          const dx = pointer.x - cx
          const dy = pointer.y - cy
          const dist = Math.hypot(dx, dy)
          const gravity = Math.max(0, 1 - dist / PULL_RADIUS)
          s.x.setTarget((dx / (dist || 1)) * gravity * MAX_PULL)
          s.y.setTarget((dy / (dist || 1)) * gravity * MAX_PULL)
          s.r.setTarget((dx / (dist || 1)) * gravity * 14.4)
        } else {
          s.x.setTarget(0)
          s.y.setTarget(0)
          s.r.setTarget(0)
        }
        const x = s.x.step(dt)
        const y = s.y.step(dt)
        const r = s.r.step(dt)
        el.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg)`
      })
    }

    gsap.ticker.add(tick)
    instances.push({ stage, tick, measureRestCenters })
  })
}

/**
 * Only tears down instances whose stage has actually left the document (e.g.
 * the About hero's, replaced by Barba) — a persistent instance (the Footer's)
 * stays connected and keeps running untouched, and keeps its `data-gravity-init`
 * flag so it's never re-wired on the next `initPage()`.
 */
export function destroyGravityText(): void {
  for (let i = instances.length - 1; i >= 0; i--) {
    const inst = instances[i]
    if (!inst.stage.isConnected) {
      gsap.ticker.remove(inst.tick)
      window.removeEventListener('resize', inst.measureRestCenters)
      instances.splice(i, 1)
    }
  }
}
