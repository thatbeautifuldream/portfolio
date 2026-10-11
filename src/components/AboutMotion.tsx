"use client";
import { useEffect } from "react";
export default function AboutMotion() {
  useEffect(() => {
    const controller = new AbortController();
    const root = document.querySelector<HTMLElement>("[data-animated-about]");
    if (root)
      void import("../scripts/about-motion").then(({ initializeAbout }) =>
        initializeAbout(root, controller.signal),
      );
    return () => controller.abort();
  }, []);
  return null;
}
