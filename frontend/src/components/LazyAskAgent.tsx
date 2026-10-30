import { lazy, Suspense, useEffect, useState } from 'react';

// Core Web Vitals: the agent panel pulls in ~190 KB of JS (AI SDK, icons).
// Nothing of it is visible until someone opens it, so it loads when the
// browser is idle (or immediately on the first "agent:open"), off the
// critical path of every page's first render.
const AskAgent = lazy(() => import('./AskAgent'));

interface Props {
  welcomeMessage?: string;
  suggestedQuestions?: string[];
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

export default function LazyAskAgent(props: Props) {
  const [load, setLoad] = useState(false);
  const [openOnMount, setOpenOnMount] = useState(false);

  useEffect(() => {
    if (load) return;
    const w = window as IdleWindow;
    const onOpen = () => {
      setOpenOnMount(true);
      setLoad(true);
    };
    window.addEventListener('agent:open', onOpen);
    const start = () => setLoad(true);
    // Wait for the page to finish loading, then for an idle slot.
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const schedule = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(start, { timeout: 6000 });
      else timeoutId = window.setTimeout(start, 3000);
    };
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
    return () => {
      window.removeEventListener('agent:open', onOpen);
      window.removeEventListener('load', schedule);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [load]);

  if (!load) return null;
  return (
    <Suspense fallback={null}>
      <AskAgent {...props} initialOpen={openOnMount} />
    </Suspense>
  );
}
