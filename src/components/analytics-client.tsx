"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { PostHog } from "posthog-js";
import {
  createEnhancementScope,
  deferUntilInteraction,
} from "../lib/enhancement-scope";

declare global {
  interface Window {
    posthog?: Pick<PostHog, "capture">;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
    __analyticsLoaded?: boolean;
  }
}

let posthogLoading: Promise<PostHog> | undefined;
let loadedPosthog: PostHog | undefined;
const pendingCaptures: Parameters<PostHog["capture"]>[] = [];
let lastGooglePageView: string | undefined;
let lastPosthogPageView: string | undefined;
type Props =
  | { provider: "google" }
  | { provider: "posthog"; token: string; host?: string };

export default function AnalyticsClient(props: Props) {
  const pathname = usePathname();
  const token = props.provider === "posthog" ? props.token : undefined;
  const host = props.provider === "posthog" ? props.host : undefined;
  useEffect(() => {
    const scope = createEnhancementScope();
    const sendPageView = () => {
      if (!window.gtag || lastGooglePageView === location.href) return;
      lastGooglePageView = location.href;
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: location.href,
        page_path: location.pathname + location.search,
      });
    };
    if (props.provider === "google") {
      if (window.__analyticsLoaded) sendPageView();
      else
        deferUntilInteraction(scope, () => {
          if (window.__analyticsLoaded) return;
          window.__analyticsLoaded = true;
          window.clarity ??= Object.assign(
            (...args: unknown[]) => {
              window.clarity!.q!.push(args);
            },
            { q: [] as unknown[][] },
          );
          window.dataLayer ??= [];
          window.gtag = (...args: unknown[]) => window.dataLayer!.push(args);
          window.gtag("js", new Date());
          window.gtag("config", "G-W9JFLQ2YJR", { send_page_view: false });
          for (const src of [
            "https://www.clarity.ms/tag/sz0cgixbfc",
            "https://www.googletagmanager.com/gtag/js?id=G-W9JFLQ2YJR",
          ]) {
            const script = document.createElement("script");
            script.async = true;
            script.src = src;
            document.head.appendChild(script);
          }
          sendPageView();
        });
    } else if (token) {
      window.posthog ??= {
        capture: (...args) => {
          pendingCaptures.push(args);
          return undefined;
        },
      };
      const capturePageView = (client: PostHog) => {
        if (scope.signal.aborted || lastPosthogPageView === location.href)
          return;
        lastPosthogPageView = location.href;
        client.capture("$pageview", { $current_url: location.href });
      };
      if (loadedPosthog) capturePageView(loadedPosthog);
      else
        deferUntilInteraction(scope, () => {
          posthogLoading ??= import("posthog-js").then(
            ({ default: client }) => {
              client.init(token, {
                api_host: host || "https://us.i.posthog.com",
                defaults: "2026-01-30",
                capture_pageview: false,
                session_recording: { maskAllInputs: true },
              });
              window.posthog = client;
              loadedPosthog = client;
              for (const args of pendingCaptures.splice(0))
                client.capture(...args);
              return client;
            },
          );
          void posthogLoading.then(capturePageView).catch(() => {
            posthogLoading = undefined;
          });
        });
    }
    return () => scope.dispose();
  }, [props.provider, token, host, pathname]);
  return null;
}
