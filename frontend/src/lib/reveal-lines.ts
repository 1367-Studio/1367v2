import SplitType from 'split-type'

/**
 * Ensures the font an element will actually render with is loaded, by
 * requesting it directly instead of relying on `document.fonts.ready`.
 *
 * `document.fonts.ready` only ever resolves once per document. Barba swaps
 * page content without a real navigation, so on any transition after the
 * first, that promise is already settled — `.then()` fires immediately,
 * before the browser has necessarily started loading a font this new page
 * needs but the previous one didn't. `buildMaskedLines` would then measure
 * line wraps against the fallback face. Requesting the element's own
 * computed font directly sidesteps that: it resolves once *that* font is
 * actually ready, on every navigation, not just the first.
 */
export async function waitForFonts(el: HTMLElement): Promise<void> {
  const style = getComputedStyle(el)
  const spec = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  try {
    await document.fonts.load(spec)
  } catch {
    // Best effort — fall through and measure with whatever's available.
  }
}

/**
 * Splits an element into lines, each wrapped in its own clipping mask, ready to
 * be slid up from underneath (see `.reveal-mask` / `.reveal-line` in global.css).
 *
 * The mask and the line have to stay separate elements: a line cannot clip
 * itself while it is the thing being animated.
 *
 * Two splitting strategies, because SplitType only understands rendered wraps:
 * text authored with literal "\n" (the Sanity convention, rendered via
 * `whitespace-pre-line`) is split on those newlines, since SplitType treats
 * them as ordinary whitespace and would collapse the break. Everything else is
 * measured from how it actually wraps.
 *
 * Idempotent — safe to call again on an element that is already split.
 */
export function buildMaskedLines(el: HTMLElement): HTMLElement[] {
  if (el.dataset.revealInit === '1') {
    return Array.from(el.querySelectorAll<HTMLElement>('.reveal-line'))
  }

  const text = el.textContent ?? ''
  if (!text.trim()) return []
  el.dataset.revealInit = '1'

  // The split markup is decorative; keep the sentence intact for screen readers
  // rather than exposing a pile of aria-hidden line divs.
  el.setAttribute('aria-label', text.replace(/\s+/g, ' ').trim())

  const lines = text.includes('\n') ? linesFromNewlines(el, text) : linesFromWrapping(el)

  lines.forEach((line) => {
    const mask = document.createElement('div')
    mask.className = 'reveal-mask'
    mask.setAttribute('aria-hidden', 'true')
    line.parentNode?.insertBefore(mask, line)
    mask.appendChild(line)
  })

  return lines
}

/** Lines split on the literal newlines authored in Sanity ("a\nb"). */
function linesFromNewlines(el: HTMLElement, text: string): HTMLElement[] {
  el.textContent = ''
  return text
    .split('\n')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const line = document.createElement('div')
      line.className = 'reveal-line'
      line.textContent = part
      el.appendChild(line)
      return line
    })
}

/** Lines measured from how the text actually wraps. */
function linesFromWrapping(el: HTMLElement): HTMLElement[] {
  const split = new SplitType(el, { types: 'lines', lineClass: 'reveal-line' })
  return (split.lines ?? []) as HTMLElement[]
}
