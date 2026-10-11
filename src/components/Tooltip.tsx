import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientScript from "./ClientScript";

export default async function View(props: ComponentProps) {
  const { className } = props;
  return (
    <>
      <div className={classes(["tip-root relative", className])}>
        {props.children}
        <div
          className="tip bg-foreground text-background pointer-events-none absolute top-0 left-0 overflow-hidden rounded-md px-2 py-1 text-sm whitespace-nowrap"
          aria-hidden="true"
          data-show="false"
        >
          <span className="tip-inner flex w-max items-baseline gap-1">
            <span className="tip-label font-medium tabular-nums"></span>
            <span className="tip-meta tabular-nums opacity-60"></span>
          </span>
        </div>
      </div>

      <ClientScript
        id="src/components/Tooltip.tsx:0"
        code={
          '"use strict";\ndocument.querySelectorAll(".tip-root").forEach((root) => {\n    const tip = root.querySelector(":scope > .tip");\n    const inner = tip.querySelector(".tip-inner");\n    const label = tip.querySelector(".tip-label");\n    const meta = tip.querySelector(".tip-meta");\n    let active;\n    const hide = () => {\n        tip.dataset.show = "false";\n        active?.classList.remove("is-active");\n        active = undefined;\n    };\n    const show = (event) => {\n        const target = event.target.closest("[data-tip]");\n        if (!target || target === active)\n            return;\n        active?.classList.remove("is-active");\n        active = target;\n        target.classList.add("is-active");\n        label.textContent = target.dataset.tip;\n        meta.textContent = target.dataset.tipMeta ?? "";\n        meta.hidden = !target.dataset.tipMeta;\n        const style = getComputedStyle(tip);\n        const width = Math.ceil(inner.offsetWidth +\n            parseFloat(style.paddingLeft) +\n            parseFloat(style.paddingRight));\n        const bounds = root.getBoundingClientRect();\n        const box = target.getBoundingClientRect();\n        const center = box.left - bounds.left + box.width / 2;\n        const x = Math.min(Math.max(center - width / 2, 0), bounds.width - width);\n        const y = box.top - bounds.top - tip.offsetHeight - 8;\n        const place = () => {\n            tip.style.width = `${width}px`;\n            tip.style.setProperty("--tip-x", `${x}px`);\n            tip.style.setProperty("--tip-y", `${y}px`);\n            tip.style.setProperty("--tip-origin", `${center - x}px`);\n        };\n        if (tip.dataset.show === "true") {\n            place();\n        }\n        else {\n            tip.style.transition = "none";\n            place();\n            void tip.offsetWidth;\n            tip.style.transition = "";\n        }\n        tip.dataset.show = "true";\n    };\n    root.addEventListener("pointerover", show);\n    root.addEventListener("focusin", show);\n    root.addEventListener("pointerleave", hide);\n    root.addEventListener("focusout", hide);\n});\n'
        }
        vars={{}}
      />
    </>
  );
}
