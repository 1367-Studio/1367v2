import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from 'react';

// Core Web Vitals: Three.js + the USDZ loader are ~600 KB of JS and the model
// is several MB. Load both only when the viewer is about to scroll into view,
// so they never compete with the hero on first load.
const USDZViewer = lazy(() => import('./USDZViewer'));

type Props = ComponentProps<typeof USDZViewer>;

export default function LazyUSDZViewer(props: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      {visible && (
        <Suspense fallback={null}>
          <USDZViewer {...props} />
        </Suspense>
      )}
    </div>
  );
}
