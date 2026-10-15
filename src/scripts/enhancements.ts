import type { EnhancementScope } from "../lib/enhancement-scope";

type BasicKind =
  | "external-links"
  | "gist-list"
  | "blog-list"
  | "contact"
  | "talks"
  | "footer"
  | "code-copy"
  | "email-copy"
  | "tooltip"
  | "github-chart";
interface BlogOptions {
  slug: string;
  title: string;
  sharePrefix: string;
  copiedLabel: string;
  shareLabel: string;
}
export type EnhancementProps =
  { kind: BasicKind } | { kind: "blog-article"; vars: BlogOptions };

function captureClicks(
  scope: EnhancementScope,
  selector: string,
  event: string,
  properties: (link: HTMLElement) => Record<string, unknown>,
) {
  for (const link of document.querySelectorAll<HTMLElement>(selector)) {
    scope.listen(link, "click", () =>
      window.posthog?.capture(event, properties(link)),
    );
  }
}

function initializeCodeCopy(scope: EnhancementScope) {
  const copyIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const checkIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>';
  const target =
    '<span class="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2" aria-hidden="true"></span>';
  for (const pre of document.querySelectorAll<HTMLElement>(".prose pre")) {
    if (pre.parentElement?.dataset.codeBlock || !pre.parentNode) continue;
    const wrapper = document.createElement("div");
    wrapper.dataset.codeBlock = "true";
    wrapper.className = "group relative";
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    scope.onCleanup(() => wrapper.replaceWith(pre));
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", "Copy code");
    button.className =
      "text-faint hover:text-foreground absolute top-2 right-2 inline-flex size-8 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100";
    button.innerHTML = copyIcon + target;
    let timer: ReturnType<typeof setTimeout> | undefined;
    scope.listen(button, "click", async () => {
      const code = pre.querySelector<HTMLElement>("code");
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code.innerText);
        if (scope.signal.aborted) return;
        window.posthog?.capture("code_copied", { path: location.pathname });
        button.innerHTML = checkIcon;
        button.setAttribute("aria-label", "Copied");
        scope.cancelTimeout(timer);
        timer = scope.timeout(() => {
          button.innerHTML = copyIcon + target;
          button.setAttribute("aria-label", "Copy code");
        }, 2000);
      } catch {}
    });
    wrapper.appendChild(button);
  }
}

function initializeEmailCopy(scope: EnhancementScope) {
  for (const button of document.querySelectorAll<HTMLElement>(
    "[data-email-copy]",
  )) {
    const swap = button.querySelector("[data-email-swap]");
    const link = button.parentElement?.querySelector("[data-email-link]");
    if (link)
      scope.listen(link, "click", () =>
        window.posthog?.capture("email_clicked"),
      );
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reset = () => {
      swap?.setAttribute("data-state", "a");
      button.setAttribute(
        "aria-label",
        button.dataset.copyLabel ?? "Copy email",
      );
      button.classList.remove("text-foreground");
    };
    scope.onCleanup(reset);
    scope.listen(button, "click", async () => {
      if (!button.dataset.email) return;
      try {
        await navigator.clipboard.writeText(button.dataset.email);
        if (scope.signal.aborted) return;
        window.posthog?.capture("email_copied");
        swap?.setAttribute("data-state", "b");
        button.setAttribute(
          "aria-label",
          button.dataset.copiedLabel ?? "Copied",
        );
        button.classList.add("text-foreground");
        scope.cancelTimeout(timer);
        timer = scope.timeout(reset, 1500);
      } catch {}
    });
  }
}

function initializeTooltips(scope: EnhancementScope) {
  for (const root of document.querySelectorAll<HTMLElement>(".tip-root")) {
    const tip = root.querySelector<HTMLElement>(":scope > .tip");
    const inner = tip?.querySelector<HTMLElement>(".tip-inner");
    const label = tip?.querySelector<HTMLElement>(".tip-label");
    const meta = tip?.querySelector<HTMLElement>(".tip-meta");
    if (!tip || !inner || !label || !meta) continue;
    let active: HTMLElement | undefined;
    const hide = () => {
      tip.dataset.show = "false";
      active?.classList.remove("is-active");
      active = undefined;
    };
    const show = (event: Event) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-tip]")
          : null;
      if (!target || !root.contains(target) || target === active) return;
      active?.classList.remove("is-active");
      active = target;
      target.classList.add("is-active");
      label.textContent = target.dataset.tip ?? "";
      meta.textContent = target.dataset.tipMeta ?? "";
      meta.hidden = !target.dataset.tipMeta;
      const bounds = root.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const gap = 8;
      const place = () => {
        const fitContent = root.dataset.tipFit === "content";
        const style = getComputedStyle(tip);
        if (fitContent) tip.style.removeProperty("width");
        const natural = Math.ceil(
          inner.offsetWidth +
            parseFloat(style.paddingLeft) +
            parseFloat(style.paddingRight),
        );
        const width = fitContent ? natural : Math.min(natural, bounds.width);
        const center = box.left - bounds.left + box.width / 2;
        const horizontal = fitContent
          ? center - width / 2
          : Math.min(
              Math.max(center - width / 2, 0),
              Math.max(0, bounds.width - width),
            );
        const above = box.top - bounds.top - tip.offsetHeight - gap;
        const below = box.bottom - bounds.top + gap;
        const placement = root.dataset.tipPlacement;
        const fitsBelow = below + tip.offsetHeight <= bounds.height - gap;
        const placeBelow =
          placement === "below"
            ? true
            : placement === "above"
              ? false
              : above < gap && fitsBelow;
        const vertical = placeBelow ? below : above;
        if (fitContent) tip.style.removeProperty("width");
        else tip.style.width = `${width}px`;
        tip.style.setProperty("--tip-x", `${horizontal}px`);
        tip.style.setProperty("--tip-y", `${vertical}px`);
        tip.style.setProperty("--tip-origin", `${center - horizontal}px`);
        tip.style.setProperty("--tip-anchor", placeBelow ? "0%" : "100%");
      };
      if (tip.dataset.show === "true") place();
      else {
        tip.style.transition = "none";
        place();
        void tip.offsetWidth;
        tip.style.transition = "";
      }
      tip.dataset.show = "true";
    };
    scope.onCleanup(hide);
    scope.listen(root, "pointerover", show);
    scope.listen(root, "focusin", show);
    scope.listen(root, "pointerleave", hide);
    scope.listen(root, "focusout", hide);
  }
}

function initializeBlogArticle(scope: EnhancementScope, options: BlogOptions) {
  const { slug, title, sharePrefix, copiedLabel, shareLabel } = options;
  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();
  const onScroll = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const percent = scrollable <= 0 ? 100 : (scrollY / scrollable) * 100;
    for (const milestone of milestones) {
      if (percent >= milestone && !fired.has(milestone) && window.posthog) {
        fired.add(milestone);
        window.posthog.capture("blog_read_depth", {
          post_slug: slug,
          post_title: title,
          depth: milestone,
        });
      }
    }
    if (fired.size === milestones.length)
      window.removeEventListener("scroll", onScroll);
  };
  scope.listen(window, "scroll", onScroll, { passive: true });
  onScroll();
  let story: File | undefined;
  if (typeof navigator.canShare === "function") {
    void fetch(`${sharePrefix}/${slug}.png`, { signal: scope.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Story image unavailable");
        return response.blob();
      })
      .then((blob) => {
        story = new File([blob], `${slug}.png`, { type: "image/png" });
      })
      .catch(() => {});
  }
  const button = document.querySelector<HTMLElement>("[data-share]");
  const label = button?.querySelector<HTMLElement>("[data-share-label]");
  if (!button || !label) return;
  scope.onCleanup(() => {
    label.textContent = shareLabel;
  });
  scope.listen(button, "click", async () => {
    const url = location.origin + location.pathname;
    const files = story ? [story] : [];
    try {
      let method: string;
      if (files.length && navigator.canShare?.({ files })) {
        await navigator.share({ files, title, text: `${title} ${url}` });
        method = "story";
      } else if (navigator.share) {
        await navigator.share({ title, url });
        method = "link";
      } else {
        await navigator.clipboard.writeText(url);
        if (scope.signal.aborted) return;
        label.textContent = copiedLabel;
        scope.timeout(() => {
          label.textContent = shareLabel;
        }, 2000);
        method = "copy";
      }
      if (!scope.signal.aborted)
        window.posthog?.capture("blog_shared", { post_slug: slug, method });
    } catch {}
  });
}

export function initializeEnhancement(
  props: EnhancementProps,
  scope: EnhancementScope,
) {
  switch (props.kind) {
    case "external-links":
      for (const link of document.querySelectorAll<HTMLAnchorElement>(
        "a[href]",
      )) {
        if (
          link.protocol.startsWith("http") &&
          link.origin !== location.origin &&
          !link.hasAttribute("download")
        ) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
      }
      scope.listen(document, "keydown", (event) => {
        const keyboard = event as KeyboardEvent;
        if (
          (keyboard.metaKey || keyboard.ctrlKey) &&
          !keyboard.altKey &&
          !keyboard.shiftKey &&
          keyboard.key.toLowerCase() === "d"
        ) {
          keyboard.preventDefault();
          document.getElementById("theme-toggle")?.click();
        }
      });
      break;
    case "blog-list":
    case "gist-list": {
      const section = props.kind === "blog-list" ? "blog" : "gist";
      captureClicks(
        scope,
        `a[href^="/${section}/"], a[href^="/hi/${section}/"]`,
        section === "blog" ? "blog_post_clicked" : "gist_clicked",
        (link) => ({
          [`${section === "blog" ? "post" : "gist"}_slug`]: link
            .getAttribute("href")
            ?.replace(new RegExp(`^(?:/hi)?/${section}/`), "")
            .replace(/\/$/, ""),
          [`${section === "blog" ? "post" : "gist"}_title`]:
            (section === "blog"
              ? link.dataset.postTitle
              : link.dataset.gistTitle) ?? null,
        }),
      );
      break;
    }
    case "contact":
      captureClicks(
        scope,
        "[data-contact-label]",
        "contact_link_clicked",
        (link) => ({
          platform: link.dataset.contactLabel,
          href: link.getAttribute("href"),
        }),
      );
      break;
    case "talks":
      captureClicks(scope, "[data-talk-title]", "talk_clicked", (link) => ({
        talk_title: link.dataset.talkTitle,
        talk_event: link.dataset.talkEvent,
      }));
      captureClicks(
        scope,
        "[data-contribution-title]",
        "contribution_clicked",
        (link) => ({ contribution_title: link.dataset.contributionTitle }),
      );
      break;
    case "footer": {
      captureClicks(
        scope,
        "footer [data-footer-social]",
        "footer_social_clicked",
        (link) => ({ platform: link.dataset.footerSocial }),
      );
      const element = document.querySelector<HTMLElement>("[data-local-time]");
      if (!element) break;
      const format = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });
      const tick = () => {
        element.textContent = `${format.format(new Date()).replace(" ", "").toLowerCase()}${element.dataset.separator ?? ""}`;
        scope.timeout(tick, 30_000);
      };
      tick();
      break;
    }
    case "github-chart":
      for (const chart of document.querySelectorAll<HTMLElement>(".gh-chart")) {
        const svg = chart.querySelector("svg");
        if (!svg) continue;
        chart.classList.add("is-pending");
        const observer = new IntersectionObserver((entries) => {
          if (!entries[0]?.isIntersecting) return;
          chart.classList.replace("is-pending", "is-in");
          observer.disconnect();
        });
        scope.onCleanup(() => {
          observer.disconnect();
          chart.classList.remove("is-pending", "is-in");
        });
        observer.observe(svg);
      }
      break;
    case "code-copy":
      initializeCodeCopy(scope);
      break;
    case "email-copy":
      initializeEmailCopy(scope);
      break;
    case "tooltip":
      initializeTooltips(scope);
      break;
    case "blog-article":
      initializeBlogArticle(scope, props.vars);
      break;
  }
}
