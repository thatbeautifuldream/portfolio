"use client";

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    // Keep a production worker from caching or controlling the dev server.
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((error) =>
        console.error("Service worker registration failed:", error),
      );
  }, []);

  return null;
}
