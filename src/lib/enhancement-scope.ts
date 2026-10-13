export function createEnhancementScope() {
  const controller = new AbortController();
  const cleanups = new Set<() => void>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const onCleanup = (cleanup: () => void) => cleanups.add(cleanup);
  const timeout = (callback: () => void, delay: number) => {
    const handle = setTimeout(() => {
      timers.delete(handle);
      if (!controller.signal.aborted) callback();
    }, delay);
    timers.add(handle);
    return handle;
  };
  const cancelTimeout = (handle: ReturnType<typeof setTimeout> | undefined) => {
    if (handle !== undefined) {
      clearTimeout(handle);
      timers.delete(handle);
    }
  };
  return {
    signal: controller.signal,
    onCleanup,
    timeout,
    cancelTimeout,
    listen(
      target: EventTarget,
      type: string,
      callback: EventListener,
      options?: AddEventListenerOptions,
    ) {
      target.addEventListener(type, callback, {
        ...options,
        signal: controller.signal,
      });
    },
    dispose() {
      controller.abort();
      for (const cleanup of cleanups) cleanup();
      for (const handle of timers) clearTimeout(handle);
      cleanups.clear();
      timers.clear();
    },
  };
}

export type EnhancementScope = ReturnType<typeof createEnhancementScope>;

export function deferUntilInteraction(
  scope: EnhancementScope,
  callback: () => void,
) {
  const start = () => {
    const interaction = new AbortController();
    scope.onCleanup(() => interaction.abort());
    let fired = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = () => {
      if (fired || scope.signal.aborted) return;
      fired = true;
      interaction.abort();
      scope.cancelTimeout(timer);
      callback();
    };
    for (const event of ["pointerdown", "keydown", "touchstart", "scroll"]) {
      window.addEventListener(event, run, {
        passive: true,
        once: true,
        signal: interaction.signal,
      });
    }
    timer = scope.timeout(run, 10_000);
  };
  const activate = () => {
    if (document.readyState === "complete") start();
    else scope.listen(window, "load", start, { once: true });
  };
  if ((document as Document & { prerendering?: boolean }).prerendering) {
    scope.listen(document, "prerenderingchange", activate, { once: true });
  } else activate();
}
