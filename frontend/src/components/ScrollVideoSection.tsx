import { useEffect, useRef } from 'react';

/* ── Scroll-scrubbed video (trial) ───────────────────────────────────────
   The outer wrapper is tall (SCROLL_HEIGHT) to give the page scroll room.
   An inner sticky layer pins to the viewport while you scroll through that
   range; scroll progress maps directly to the video's currentTime, so the
   clip scrubs frame-by-frame and only "releases" once every frame is done. */

/* All-keyframe (all-intra) re-encode so every scroll position seeks instantly.
   For production, upload this optimized file to the CDN and swap the URL. */
const VIDEO_SRC = '/cinematic-reflection.mp4';

/* Taller = slower, more controllable scrub. 300vh ≈ 2 extra screens of scroll. */
const SCROLL_HEIGHT = '300vh';

export default function ScrollVideoSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    let raf = 0;
    let targetTime = 0;
    let isSeeking = false;

    const computeTarget = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      // progress: 0 when the section's top hits the viewport top,
      // 1 when we've scrolled past the whole tall wrapper.
      const progress = scrollable > 0 ? -rect.top / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      const duration = video.duration || 0;
      targetTime = clamped * duration;
    };

    // Gate seeks on the previous one finishing. Issuing a new seek every
    // frame (faster than the decoder can serve) queues them up and stutters;
    // requesting the next seek only once "seeked" fires lets the scrub adapt
    // to decode speed and stay as smooth as the encoding allows.
    const onSeeked = () => {
      isSeeking = false;
    };

    const tick = () => {
      if (!isSeeking && Number.isFinite(targetTime)) {
        const diff = targetTime - video.currentTime;
        if (Math.abs(diff) > 0.033) {
          isSeeking = true;
          video.currentTime = targetTime;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => computeTarget();

    const start = () => {
      computeTarget();
      // iOS requires a play/pause cycle before currentTime seeks work on a
      // non-autoplay video. This unlocks the media element without visible playback.
      video.play().then(() => { video.pause(); raf = requestAnimationFrame(tick); }).catch(() => {
        raf = requestAnimationFrame(tick);
      });
    };

    video.addEventListener('seeked', onSeeked);

    if (video.readyState >= 1) {
      start();
    } else {
      video.addEventListener('loadedmetadata', start, { once: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      video.removeEventListener('loadedmetadata', start);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative bg-black"
      style={{ height: SCROLL_HEIGHT }}
    >
      {/* Sticky stage — pins to the viewport for the whole scroll range */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          autoPlay
          preload="auto"
          className="h-full w-full object-cover"
        />
      </div>
    </section>
  );
}
