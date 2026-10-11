"use client";
import { useEffect } from "react";

const scopes = new Map<string, { users: number; dispose: () => void }>();
export default function ClientScript({
  id,
  code,
  vars = {},
}: {
  id: string;
  code: string;
  vars?: Record<string, unknown>;
}) {
  const serialized = JSON.stringify(vars);
  useEffect(() => {
    let scope = scopes.get(id);
    if (!scope) {
      const key = `enhancement-${id}`;
      const declarations = Object.entries(JSON.parse(serialized))
        .map(
          ([name, value]) =>
            `const ${name}=${JSON.stringify(value) ?? "undefined"};`,
        )
        .join("\n");
      const script = document.createElement("script");
      script.dataset.enhancement = id;
      // Scoped APIs avoid leaving document listeners and clocks running after
      // Next.js replaces the page. Element listeners leave with their DOM nodes.
      const scopedCode = code
        .replaceAll("document.addEventListener(", "listen(document,")
        .replaceAll("window.addEventListener(", "listen(window,");
      script.textContent = `(()=>{
        const controller=new AbortController(), timers=new Set(), observers=new Set();
        class IntersectionObserver extends window.IntersectionObserver { constructor(...args) { super(...args); observers.add(this); } }
        const listen=(target,type,callback,options)=>target.addEventListener(type,callback,{...(typeof options==='boolean'?{capture:options}:options),signal:controller.signal});
        const addEventListener=(...args)=>listen(window,...args);
        const removeEventListener=(...args)=>window.removeEventListener(...args);
        const setTimeout=(callback,delay,...args)=>{const handle=window.setTimeout(()=>{timers.delete(handle);if(!controller.signal.aborted)callback(...args);},delay);timers.add(handle);return handle;};
        const setInterval=(callback,delay,...args)=>{const handle=window.setInterval(callback,delay,...args);timers.add(handle);return handle;};
        window[${JSON.stringify(key)}]=()=>{controller.abort();observers.forEach(observer=>observer.disconnect());timers.forEach(handle=>{window.clearTimeout(handle);window.clearInterval(handle);});delete window[${JSON.stringify(key)}];};
        ${declarations}\n${scopedCode}\n})();`;
      document.body.append(script);
      script.remove();
      scope = {
        users: 0,
        dispose: () => {
          (window as any)[key]?.();
        },
      };
      scopes.set(id, scope);
    }
    scope.users++;
    return () => {
      if (--scope.users === 0) {
        scope.dispose();
        scopes.delete(id);
      }
    };
  }, [id, code, serialized]);
  return null;
}
