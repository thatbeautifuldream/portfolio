"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const scopeKey = `${id}:${pathname}:${serialized}`;
  useEffect(() => {
    let scope = scopes.get(scopeKey);
    if (!scope) {
      const key = `enhancement-${scopeKey}`;
      const declarations = Object.entries(JSON.parse(serialized))
        .map(
          ([name, value]) =>
            `const ${name}=${JSON.stringify(value) ?? "undefined"};`,
        )
        .join("\n");
      const script = document.createElement("script");
      script.dataset.enhancement = id;
      // Scoped APIs avoid leaving document listeners and clocks running after
      // Next.js replaces the page or Strict Mode replays effects.
      const scopedCode = code.replace(
        /([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)(?:\?\.|\.)addEventListener\(/g,
        "listen($1,",
      );
      script.textContent = `(()=>{
        const controller=new AbortController(), timers=new Set(), observers=new Set(), cleanups=new Set();
        const onCleanup=callback=>cleanups.add(callback);
        class IntersectionObserver extends window.IntersectionObserver { constructor(...args) { super(...args); observers.add(this); } }
        const listen=(target,type,callback,options)=>target?.addEventListener(type,callback,{...(typeof options==='boolean'?{capture:options}:options),signal:controller.signal});
        const addEventListener=(...args)=>listen(window,...args);
        const removeEventListener=(...args)=>window.removeEventListener(...args);
        const setTimeout=(callback,delay,...args)=>{const handle=window.setTimeout(()=>{timers.delete(handle);if(!controller.signal.aborted)callback(...args);},delay);timers.add(handle);return handle;};
        const setInterval=(callback,delay,...args)=>{const handle=window.setInterval(callback,delay,...args);timers.add(handle);return handle;};
        window[${JSON.stringify(key)}]=()=>{controller.abort();cleanups.forEach(cleanup=>cleanup());observers.forEach(observer=>observer.disconnect());timers.forEach(handle=>{window.clearTimeout(handle);window.clearInterval(handle);});delete window[${JSON.stringify(key)}];};
        ${declarations}\n${scopedCode}\n})();`;
      document.body.append(script);
      script.remove();
      scope = {
        users: 0,
        dispose: () => {
          (window as any)[key]?.();
        },
      };
      scopes.set(scopeKey, scope);
    }
    scope.users++;
    return () => {
      if (--scope.users === 0) {
        scope.dispose();
        scopes.delete(scopeKey);
      }
    };
  }, [id, code, serialized, scopeKey]);
  return null;
}
