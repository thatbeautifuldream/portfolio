import SiteLink from "./SiteLink";
import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientScript from "./ClientScript";
import { Icon } from "../lib/ui";
import { contactEmail } from "../data/portfolio";
import { getLocale, useTranslations } from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const { className } = props;
  const t = useTranslations(getLocale(context.locale));
  return (
    <>
      <p
        className={classes(["flex flex-wrap items-center gap-x-2", className])}
      >
        <SiteLink
          href={`mailto:${contactEmail}`}
          data-email-link
          className="break-all"
        >
          {contactEmail}
        </SiteLink>
        <button
          type="button"
          data-email-copy
          className="text-faint hover:text-foreground inline-flex cursor-pointer items-center"
          data-email={contactEmail}
          aria-label={t.copyEmail}
          data-copy-label={t.copyEmail}
          data-copied-label={t.copied}
        >
          <span className="t-icon-swap" data-state="a" data-email-swap>
            <Icon
              name="ri:file-copy-line"
              className="t-icon size-5 sm:size-4"
              data-icon="a"
            />
            <Icon
              name="ri:check-line"
              className="t-icon size-5 sm:size-4"
              data-icon="b"
            />
          </span>
        </button>
      </p>

      <ClientScript
        id="src/components/EmailLink.tsx:0"
        code={
          '"use strict";\nfunction setupEmailCopy() {\n    document.querySelectorAll("[data-email-copy]").forEach((button) => {\n        if (button.dataset.emailBound)\n            return;\n        button.dataset.emailBound = "true";\n        onCleanup(() => { delete button.dataset.emailBound; });\n        const swap = button.querySelector("[data-email-swap]");\n        const link = button.parentElement?.querySelector("[data-email-link]");\n        link?.addEventListener("click", () => {\n            window.posthog?.capture("email_clicked");\n        });\n        let timer;\n        button.addEventListener("click", async () => {\n            const email = button.dataset.email;\n            if (!email)\n                return;\n            try {\n                await navigator.clipboard.writeText(email);\n                window.posthog?.capture("email_copied");\n                swap?.setAttribute("data-state", "b");\n                button.setAttribute("aria-label", button.dataset.copiedLabel);\n                button.classList.add("text-foreground");\n                clearTimeout(timer);\n                timer = setTimeout(() => {\n                    swap?.setAttribute("data-state", "a");\n                    button.setAttribute("aria-label", button.dataset.copyLabel);\n                    button.classList.remove("text-foreground");\n                }, 1500);\n            }\n            catch { }\n        });\n    });\n}\nif (document.readyState !== "loading")\n    setupEmailCopy();\nelse\n    document.addEventListener("DOMContentLoaded", setupEmailCopy);\n'
        }
        vars={{}}
      />
    </>
  );
}
