// @barba/core ships real .d.ts files but its package.json "types" field points
// to a path that doesn't exist in the published package, so TS can't resolve
// them automatically. Minimal ambient declaration covering the API we use.
declare module '@barba/core' {
  interface BarbaPageView {
    container: HTMLElement
    namespace?: string
    url?: { href: string; path: string }
  }

  interface BarbaData {
    current: BarbaPageView
    next: BarbaPageView
    trigger?: unknown
  }

  interface BarbaTransition {
    name?: string
    sync?: boolean
    beforeLeave?: (data: BarbaData) => void | Promise<void>
    leave?: (data: BarbaData) => void | Promise<void>
    afterLeave?: (data: BarbaData) => void | Promise<void>
    beforeEnter?: (data: BarbaData) => void | Promise<void>
    enter?: (data: BarbaData) => void | Promise<void>
    afterEnter?: (data: BarbaData) => void | Promise<void>
    before?: (data: BarbaData) => void | Promise<void>
    after?: (data: BarbaData) => void | Promise<void>
  }

  interface BarbaInitOptions {
    transitions?: BarbaTransition[]
    debug?: boolean
    [key: string]: unknown
  }

  interface Barba {
    init(options: BarbaInitOptions): void
    destroy(): void
  }

  const barba: Barba
  export default barba
}
