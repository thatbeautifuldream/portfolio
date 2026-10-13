import type { ComponentProps } from "../lib/ui";
import ClientScript from "./client-script";

export default async function View(_props: ComponentProps) {
  return (
    <>
      <ClientScript
        id="src/components/posthog.tsx:0"
        code={
          '"use strict";\n!(function (t, e) {\n    var o, n, p, r;\n    e.__SV ||\n        ((window.posthog = e),\n            (e._i = []),\n            (e.init = function (i, s, a) {\n                function g(t, e) {\n                    var o = e.split(".");\n                    (2 == o.length && ((t = t[o[0]]), (e = o[1])),\n                        (t[e] = function () {\n                            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));\n                        }));\n                }\n                (((p = t.createElement("script")).type = "text/javascript"),\n                    (p.crossOrigin = "anonymous"),\n                    (p.async = !0),\n                    (p.src = s.api_host + "/static/array.js"),\n                    (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));\n                var u = e;\n                for (void 0 !== a ? (u = e[a] = []) : (a = "posthog"),\n                    u.people = u.people || [],\n                    u.toString = function (t) {\n                        var e = "posthog";\n                        return ("posthog" !== a && (e += "." + a),\n                            t || (e += " (stub)"),\n                            e);\n                    },\n                    u.people.toString = function () {\n                        return u.toString(1) + ".people (stub)";\n                    },\n                    o =\n                        "capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys getNextSurveyStep onSessionId".split(" "),\n                    n = 0; n < o.length; n++)\n                    g(u, o[n]);\n                e._i.push([i, s, a]);\n            }),\n            (e.__SV = 1));\n})(document, window.posthog || []);\n// Defer the init (and its array.js/recorder network load) until the first\n// real interaction, with a long idle fallback. Keeps the third-party scripts\n// out of the critical path and synthetic-audit window while still tracking\n// real visitors. The stub above queues any early posthog.* calls.\nfunction loadPostHog() {\n    if (window.__posthogLoaded)\n        return;\n    window.__posthogLoaded = true;\n    posthog.init(apiKey || "", {\n        api_host: apiHost || "https://us.i.posthog.com",\n        defaults: "2026-01-30",\n        session_recording: { maskAllInputs: false },\n    });\n}\nfunction start() {\n    const events = ["pointerdown", "keydown", "touchstart", "scroll"];\n    let timer;\n    function go() {\n        events.forEach((e) => removeEventListener(e, go, { passive: true }));\n        clearTimeout(timer);\n        loadPostHog();\n    }\n    events.forEach((e) => addEventListener(e, go, { passive: true, once: true }));\n    timer = setTimeout(loadPostHog, 10000);\n}\nif (document.prerendering) {\n    document.addEventListener("prerenderingchange", start, { once: true });\n}\nelse if (document.readyState === "complete") {\n    start();\n}\nelse {\n    window.addEventListener("load", start);\n}\n'
        }
        vars={{
          apiKey: process.env.PUBLIC_POSTHOG_PROJECT_TOKEN,
          apiHost: process.env.PUBLIC_POSTHOG_HOST,
        }}
      />
    </>
  );
}
