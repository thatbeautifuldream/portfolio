"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../../i18n";

export default function IsolatedPreview({
  sample,
  locale,
}: {
  sample: string;
  locale: Locale;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [height, setHeight] = useState(200);
  useEffect(() => {
    const frame = frameRef.current!;
    const document = frame.contentDocument;
    const content = document?.querySelector<HTMLElement>(
      "[data-isolated-preview]",
    );
    if (!document || !content) return;
    const measure = () =>
      setHeight(Math.min(1600, Math.ceil(content.offsetHeight + 8)));
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    measure();
    const syncTheme = () => {
      if (
        document.documentElement.classList.contains("dark") !==
        window.document.documentElement.classList.contains("dark")
      )
        document.getElementById("theme-toggle")?.click();
    };
    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(window.document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    syncTheme();
    const syncHostTheme = () => {
      if (
        document.documentElement.classList.contains("dark") !==
        window.document.documentElement.classList.contains("dark")
      )
        window.document.getElementById("theme-toggle")?.click();
    };
    const hostThemeObserver = new MutationObserver(syncHostTheme);
    hostThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const navigation = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.nodeType === 1 ? target.closest("a[href]") : null;
      if (!link) return;
      event.preventDefault();
      event.stopPropagation();
      const href = link.getAttribute("href");
      if (href?.startsWith("#"))
        window.dispatchEvent(
          new CustomEvent("canvas-group-navigation", { detail: href.slice(1) }),
        );
    };
    const focus = () =>
      frame.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    document.addEventListener("click", navigation, true);
    document.addEventListener("auxclick", navigation, true);
    document.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      hostThemeObserver.disconnect();
      document.removeEventListener("click", navigation, true);
      document.removeEventListener("auxclick", navigation, true);
      document.removeEventListener("focusin", focus);
    };
  }, [loaded]);
  return (
    <iframe
      ref={frameRef}
      src={`${locale === "hi" ? "/hi" : ""}/studio/preview/?sample=${sample}`}
      title={`${sample} component preview`}
      onLoad={() => setLoaded((count) => count + 1)}
      style={{ width: "100%", height, border: 0, display: "block" }}
    />
  );
}
