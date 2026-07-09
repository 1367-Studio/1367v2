import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
    __lenisLocked?: boolean;
  }
}

let rafDriver: ((time: number) => void) | null = null;

/**
 * Initialise Lenis smooth scrolling and sync it with GSAP's ScrollTrigger.
 * Safe to call again after `destroySmoothScroll()` — e.g. once per Barba
 * page transition, since each page swap needs its own Lenis instance.
 */
export function initSmoothScroll(): Lenis {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Drive Lenis from GSAP's ticker for a single, synced RAF loop.
  lenis.on("scroll", ScrollTrigger.update);

  rafDriver = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(rafDriver);
  gsap.ticker.lagSmoothing(0);

  // Exposed so other components (e.g. VideoProjectSection's scroll lock) can
  // call lenis.stop()/.start() — native overflow toggling has no effect on
  // Lenis since it drives scroll itself and preventDefaults wheel/touch events.
  window.__lenis = lenis;
  // A component may have requested a lock before this ran (script order isn't
  // guaranteed relative to page components), so honor it immediately.
  if (window.__lenisLocked) lenis.stop();

  return lenis;
}

export function destroySmoothScroll(): void {
  if (rafDriver) {
    gsap.ticker.remove(rafDriver);
    rafDriver = null;
  }
  window.__lenis?.destroy();
  window.__lenis = undefined;
}
