import type { ComponentProps } from "../lib/ui";
import ClientScript from "./ClientScript";

export default async function View(_props: ComponentProps) {
  return (
    <>
      <ClientScript
        id="src/components/CodeCopy.tsx:0"
        code={
          '"use strict";\nfunction setupCodeCopy() {\n    const copyIcon = \'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="size-4"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>\';\n    const checkIcon = \'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="size-4"><path d="M20 6 9 17l-5-5"/></svg>\';\n    document.querySelectorAll(".prose pre").forEach((pre) => {\n        if (pre.parentElement?.dataset.codeBlock)\n            return;\n        const wrapper = document.createElement("div");\n        wrapper.dataset.codeBlock = "true";\n        wrapper.className = "group relative";\n        pre.parentNode.insertBefore(wrapper, pre);\n        wrapper.appendChild(pre);\n        onCleanup(() => { wrapper.replaceWith(pre); });\n        const button = document.createElement("button");\n        button.type = "button";\n        button.setAttribute("aria-label", "Copy code");\n        button.className =\n            "text-faint hover:text-foreground absolute top-2 right-2 inline-flex size-8 cursor-pointer items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100";\n        button.innerHTML =\n            copyIcon +\n                \'<span className="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2" aria-hidden="true"></span>\';\n        let timer;\n        button.addEventListener("click", async () => {\n            const code = pre.querySelector("code");\n            try {\n                await navigator.clipboard.writeText(code.innerText);\n                window.posthog?.capture("code_copied", { path: location.pathname });\n                button.innerHTML = checkIcon;\n                button.setAttribute("aria-label", "Copied");\n                clearTimeout(timer);\n                timer = setTimeout(() => {\n                    button.innerHTML =\n                        copyIcon +\n                            \'<span className="pointer-fine:hidden absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2" aria-hidden="true"></span>\';\n                    button.setAttribute("aria-label", "Copy code");\n                }, 2000);\n            }\n            catch { }\n        });\n        wrapper.appendChild(button);\n    });\n}\nif (document.readyState !== "loading")\n    setupCodeCopy();\nelse\n    document.addEventListener("DOMContentLoaded", setupCodeCopy);\n'
        }
        vars={{}}
      />
    </>
  );
}
