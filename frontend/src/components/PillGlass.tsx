import { useEffect, useRef, useState } from "react";
import { LiquidGlass } from "liquid-glass-web-react";

/**
 * Liquid-glass surface for the scrolled header pill.
 *
 * Renders as an absolutely-positioned layer that fills its parent
 * (`#header-pill`) and sits *behind* the nav (the nav stays readable on top).
 * It measures its own box and only shows once the page is scrolled past the
 * threshold, matching the existing `.is-scrolled` pill transition.
 *
 * The lib refracts its own children, so the child here is a translucent tint
 * panel; combined with a CSS backdrop blur on the pill it reads as glass.
 */
export default function PillGlass({ threshold = 80 }: { threshold?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Track the pill's rendered size (it morphs width/height on scroll).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        setSize({ w: Math.round(r.width), h: Math.round(r.height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Show the glass only once scrolled (mirrors `.is-scrolled`).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        overflow: "hidden",
        pointerEvents: "none",
        opacity: scrolled ? 1 : 0,
        transition: "opacity 0.3s ease",
        zIndex: 0,
      }}
    >
      {size && (
        <LiquidGlass
          width={size.w}
          height={size.h}
          radius={8}
          /* Figma "Glass": Refraction 96, Depth 52, Dispersion 0, Splay 80,
             Light -45deg / 80%. Frost is handled by the CSS backdrop blur. */
          strength={0.2}
          depth={14}
          chromaticAberration={0}
          splay={0.8}
          specular={1.4}
          specularAngle={-45}
          blur={0}
          glow={0.1}
          edgeHighlight={0.35}
          shadow={false}
          quality={512}
          style={{ position: "absolute", inset: 0 }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 55%)",
            }}
          />
        </LiquidGlass>
      )}
    </div>
  );
}
