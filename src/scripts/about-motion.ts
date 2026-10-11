import { TextMorph } from "torph";

export async function initializeAbout(root: HTMLElement, signal: AbortSignal) {
  await document.fonts.ready;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (signal.aborted) return;
  const heading = root.querySelector<HTMLHeadingElement>("h1")!;
  const headingFlow = heading.parentElement!;
  const followHeadingHeight = () => {
    headingFlow.style.height = `${heading.getBoundingClientRect().height}px`;
  };
  followHeadingHeight();
  const headingObserver = new ResizeObserver(followHeadingHeight);
  headingObserver.observe(heading);
  const instances: TextMorph[] = [];
  const morph = (element: HTMLElement) => {
    const instance = new TextMorph({
      element,
      locale: document.documentElement.lang,
      duration: 550,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    instance.update(element.textContent?.trim() ?? "");
    instances.push(instance);
    return instance;
  };

  let visible = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let turn = 0;
  const words = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-morph-words]"),
  ).map((button) => {
    const values: string[] = JSON.parse(button.dataset.morphWords!);
    const instance = morph(
      button.querySelector<HTMLElement>("[data-morph-text]")!,
    );
    const icons = Array.from(
      button.querySelectorAll<HTMLElement>("[data-morph-icon]"),
    );
    let index = 0;
    const next = () => {
      index = (index + 1) % values.length;
      instance.update(values[index]!);
      icons.forEach((icon, i) => {
        icon.hidden = i !== index;
      });
      button.setAttribute(
        "aria-label",
        `${button.dataset.label}: ${values[index]}`,
      );
    };
    button.addEventListener(
      "click",
      () => {
        next();
        syncPlayback();
      },
      { signal },
    );
    return next;
  });

  function syncPlayback() {
    clearInterval(timer);
    if (
      reducedMotion.matches ||
      !visible ||
      document.hidden ||
      root!.querySelector("[data-morph-words]:focus-visible")
    )
      return;
    timer = setInterval(() => {
      // Give each change its own moment, rather than moving the whole page at once.
      words[turn % words.length]!();
      turn++;
    }, 10_000);
  }

  root.addEventListener("focusin", syncPlayback, { signal });
  root.addEventListener("focusout", () => queueMicrotask(syncPlayback), {
    signal,
  });
  document.addEventListener("visibilitychange", syncPlayback, { signal });
  reducedMotion.addEventListener("change", syncPlayback, { signal });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting;
    syncPlayback();
  });
  observer.observe(root.querySelector("h1")!);
  syncPlayback();

  signal.addEventListener(
    "abort",
    () => {
      clearInterval(timer);
      observer.disconnect();
      headingObserver.disconnect();
      instances.forEach((instance) => instance.destroy());
    },
    { once: true },
  );
}
