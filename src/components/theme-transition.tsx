"use client";
import { usePathname } from "next/navigation";
import {
  addTransitionType,
  startTransition,
  useLayoutEffect,
  useState,
  useRef,
  ViewTransition,
  type ReactNode,
} from "react";

export default function ThemeTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const pendingTheme = useRef<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  useLayoutEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("theme");
    } catch {}
    const next =
      theme ??
      stored ??
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next === "dark");
    pendingTheme.current = null;
    if (theme !== null) {
      try {
        localStorage.setItem("theme", theme);
      } catch {}
    }
  }, [theme, pathname]);
  useLayoutEffect(() => {
    const toggle = (event: MouseEvent) => {
      if (
        !(event.target instanceof Element) ||
        !event.target.closest("#theme-toggle")
      )
        return;
      const current =
        pendingTheme.current ??
        (document.documentElement.classList.contains("dark")
          ? "dark"
          : "light");
      const next = current === "dark" ? "light" : "dark";
      pendingTheme.current = next;
      (
        window as Window & {
          posthog?: {
            capture: (
              event: string,
              properties: Record<string, unknown>,
            ) => void;
          };
        }
      ).posthog?.capture("theme_toggled", { theme: next });
      // The named page snapshot can be taller than the viewport. Keep the
      // wipe anchored to the visible screen, including at an article's footer.
      const root = document.documentElement;
      root.style.setProperty("--theme-scroll-y", `${window.scrollY}px`);
      root.style.setProperty("--theme-viewport-width", `${root.clientWidth}px`);
      root.style.setProperty(
        "--theme-viewport-height",
        `${window.innerHeight}px`,
      );
      startTransition(() => {
        addTransitionType("theme-toggle");
        setTheme(next);
      });
    };
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);
  return (
    <ViewTransition
      name="theme-surface"
      default="none"
      update={{ "theme-toggle": "theme-wipe", default: "none" }}
    >
      <div
        className="bg-background text-foreground min-h-svh"
        data-theme={theme ?? undefined}
      >
        {children}
      </div>
    </ViewTransition>
  );
}
