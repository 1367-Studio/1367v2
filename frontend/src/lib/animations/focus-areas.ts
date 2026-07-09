import { gsap } from 'gsap'

/**
 * Focus Areas: text dimming on hover/click, plus a cursor-following image
 * reveal (mwg_effect030 style) — new masked image slides in per row hover,
 * stacked up to 20 before the oldest is dropped. All listeners live on
 * elements inside `#focus-list`, which Barba replaces wholesale on every
 * navigation, so nothing here needs explicit teardown.
 */
export function initFocusAreas(): void {
  const list = document.getElementById('focus-list')
  const items = list?.querySelectorAll<HTMLElement>('.focus-item')

  if (!list || !items) return

  function setActive(index: number) {
    items!.forEach((el, i) => {
      const content = el.querySelector<HTMLElement>('.focus-content')
      if (content) content.style.opacity = i === index ? '1' : '0.3'
    })
  }

  setActive(0)

  items.forEach((el, i) => {
    el.addEventListener('click', () => setActive(i))
  })

  list.addEventListener('mouseleave', () => setActive(0))

  // --- Cursor-following image reveal (mwg_effect030 style) ---

  const mediaContainer = document.getElementById('media-container')
  const mediasRoot = document.querySelector<HTMLElement>('.focus-medias')

  if (!mediaContainer || !mediasRoot) return

  const mediasUrl: (string | undefined)[] = []
  mediasRoot.querySelectorAll<HTMLImageElement>('img').forEach((img) => {
    mediasUrl[Number(img.dataset.index)] = img.getAttribute('src') ?? undefined
  })

  function createMedia(index: number) {
    const url = mediasUrl[index]
    if (!url || !mediaContainer) return

    const div = document.createElement('div')
    const image = document.createElement('img')
    image.src = url
    image.alt = ''

    div.appendChild(image)
    mediaContainer.appendChild(div)

    gsap.to([div, image], {
      y: 0,
      duration: 0.6,
      ease: 'expo.inOut',
    })

    if (mediaContainer.children.length > 20) {
      mediaContainer.children[0].remove()
    }
  }

  items.forEach((el, i) => {
    el.addEventListener('mouseenter', () => {
      setActive(i)
      createMedia(i)
    })
  })

  // Horizontally centered (left: 50%), vertically centered on the cursor position.
  gsap.set(mediaContainer, { xPercent: -50, yPercent: -50 })
  const yTo = gsap.quickTo(mediaContainer, 'y', {
    duration: 0.5,
    ease: 'power4',
  })

  const getCursorY = (clientY: number) => {
    const parent = mediaContainer.offsetParent as HTMLElement | null
    const parentTop = parent ? parent.getBoundingClientRect().top : 0
    return clientY - parentTop
  }

  list.addEventListener('mouseenter', (e: MouseEvent) => {
    mediaContainer.classList.add('on')
    gsap.set(mediaContainer, { y: getCursorY(e.clientY) })
  })

  list.addEventListener('mousemove', (e: MouseEvent) => {
    yTo(getCursorY(e.clientY))
  })

  list.addEventListener('mouseleave', () => {
    mediaContainer.classList.remove('on')
    Array.from(mediaContainer.children).forEach((el) => el.remove())
  })
}
