import SplitType from "split-type";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Split every element matching `selector` into lines and reveal them on scroll.
 * Add `data-reveal` (or pass a custom selector) to any heading/paragraph.
 */
export function initTextReveal(selector = "[data-reveal]"): void {
  const targets = document.querySelectorAll<HTMLElement>(selector);

  targets.forEach((el) => {
    const split = new SplitType(el, { types: "lines", lineClass: "split-line" });

    gsap.from(split.lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
      },
    });
  });
}
