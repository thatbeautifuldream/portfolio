"use client";
import { useEffect, useRef } from "react";
// Enhance the rendered document after hydration. Regular anchors intentionally
// retain full-document navigation and the site's native view transitions.
export default function ClientScript({
  id,
  code,
  vars = {},
}: {
  id: string;
  code: string;
  vars?: Record<string, unknown>;
}) {
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const declarations = Object.entries(vars)
      .map(
        ([name, value]) =>
          `const ${name}=${JSON.stringify(value) ?? "undefined"};`,
      )
      .join("\n");
    const script = document.createElement("script");
    script.dataset.enhancement = id;
    script.textContent = `(()=>{${declarations}\n${code}\n})();`;
    document.body.append(script);
    script.remove();
  }, [id, code, vars]);
  return null;
}
