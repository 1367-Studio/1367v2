function closeDropdown() {
  document.getElementById('source-list')?.classList.add('hidden')
  const trigger = document.getElementById('source-trigger')
  trigger?.removeAttribute('data-open')
  trigger?.setAttribute('aria-expanded', 'false')
  document.getElementById('source-chevron')?.classList.remove('rotate-180')
}

let documentListenersBound = false

function bindDocumentListenersOnce() {
  if (documentListenersBound) return
  documentListenersBound = true

  // Bound once for the whole SPA session; both handlers re-query the DOM by id
  // on every call, so they keep working correctly across Barba navigations
  // even though the dropdown markup itself gets replaced each time.
  document.addEventListener('click', (e) => {
    if (!document.getElementById('source-dropdown')?.contains(e.target as Node)) {
      closeDropdown()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown()
  })
}

/**
 * Contact page: "how did you hear about us" custom dropdown + form submit.
 * The two document-level listeners (outside-click / Escape) are bound only
 * once for the whole session — see bindDocumentListenersOnce.
 */
export function initContactForm(): void {
  bindDocumentListenersOnce()

  const trigger = document.getElementById('source-trigger') as HTMLButtonElement | null
  const list = document.getElementById('source-list') as HTMLUListElement | null
  const chevron = document.getElementById('source-chevron') as SVGElement | null
  const hidden = document.getElementById('source-value') as HTMLInputElement | null

  if (!trigger || !list) return

  trigger.addEventListener('click', () => {
    const isOpen = !list.classList.contains('hidden')
    if (isOpen) {
      closeDropdown()
    } else {
      list.classList.remove('hidden')
      trigger.setAttribute('data-open', '')
      trigger.setAttribute('aria-expanded', 'true')
      chevron?.classList.add('rotate-180')
    }
  })

  list.addEventListener('click', (e) => {
    const item = (e.target as HTMLElement).closest('[data-value]') as HTMLElement | null
    if (!item) return
    const value = item.dataset.value ?? ''
    const label = item.textContent?.trim() ?? ''
    if (hidden) hidden.value = value
    trigger.textContent = label
    trigger.setAttribute('data-filled', '')
    list.querySelectorAll('[role=option]').forEach((el) => el.setAttribute('aria-selected', 'false'))
    item.setAttribute('aria-selected', 'true')
    closeDropdown()
  })

  // Contact form submit
  const form = document.getElementById('contact-form') as HTMLFormElement | null
  const status = document.getElementById('contact-status')

  form?.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!status) return

    status.textContent = 'Sending…'
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      status.textContent = res.ok
        ? 'Thanks, your message was sent.'
        : 'Something went wrong. Please try again.'
      if (res.ok) form.reset()
    } catch {
      status.textContent = 'Network error. Please try again.'
    }
  })
}
