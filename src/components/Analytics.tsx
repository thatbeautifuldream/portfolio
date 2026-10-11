import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientScript from "./ClientScript";

export default async function View(props: ComponentProps) {
  const context = props.context;
  const CLARITY_ID = "sz0cgixbfc";
  const GA_ID = "G-W9JFLQ2YJR";
  const enabled = process.env.PUBLIC_DISABLE_ANALYTICS !== "true";
  return (
    <>
      <ClientScript
        id="src/components/Analytics.tsx:0"
        code={
          '"use strict";\nfunction sendPageView() {\n    if (!window.gtag)\n        return;\n    gtag("event", "page_view", {\n        page_title: document.title,\n        page_location: location.href,\n        page_path: location.pathname + location.search,\n    });\n}\nfunction loadAnalytics() {\n    if (window.__analyticsLoaded)\n        return;\n    window.__analyticsLoaded = true;\n    // Microsoft Clarity\n    (function (c, l, a, r, i, t, y) {\n        c[a] =\n            c[a] ||\n                function () {\n                    (c[a].q = c[a].q || []).push(arguments);\n                };\n        t = l.createElement(r);\n        t.async = 1;\n        t.src = "https://www.clarity.ms/tag/" + i;\n        y = l.getElementsByTagName(r)[0];\n        y.parentNode.insertBefore(t, y);\n    })(window, document, "clarity", "script", CLARITY_ID);\n    // Google Analytics 4\n    window.dataLayer = window.dataLayer || [];\n    window.gtag = function () {\n        dataLayer.push(arguments);\n    };\n    gtag("js", new Date());\n    // Disable the automatic pageview so View Transition navigations aren\'t double-counted.\n    gtag("config", GA_ID, { send_page_view: false });\n    var s = document.createElement("script");\n    s.async = true;\n    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;\n    document.head.appendChild(s);\n    sendPageView();\n}\n// Load analytics on the first real interaction, with a long idle fallback.\n// This keeps the third-party scripts out of the critical path entirely (and\n// out of synthetic-audit trace windows) while still tracking real visitors.\nfunction start() {\n    const events = ["pointerdown", "keydown", "touchstart", "scroll"];\n    let timer;\n    function go() {\n        events.forEach((e) => removeEventListener(e, go, { passive: true }));\n        clearTimeout(timer);\n        loadAnalytics();\n    }\n    events.forEach((e) => addEventListener(e, go, { passive: true, once: true }));\n    timer = setTimeout(loadAnalytics, 10000);\n}\nfunction startWhenActive() {\n    if (document.prerendering) {\n        document.addEventListener("prerenderingchange", startWhenActive, {\n            once: true,\n        });\n        return;\n    }\n    if (document.readyState === "complete")\n        start();\n    else\n        window.addEventListener("load", start);\n}\nif (enabled)\n    startWhenActive();\n'
        }
        vars={{ CLARITY_ID, GA_ID, enabled }}
      />
    </>
  );
}
