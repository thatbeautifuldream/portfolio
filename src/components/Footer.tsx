import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientScript from "./ClientScript";
import { execSync } from "node:child_process";
import { Icon } from "../lib/ui";
import { siteLinks } from "../data/portfolio";
import Tooltip from "./Tooltip";
import {
  getLocale,
  isTranslated,
  localizePath,
  stripLocale,
  useTranslations,
} from "../i18n";
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale);
  const path = stripLocale(context.url.pathname);
  const otherLocale = locale === "hi" ? "en" : "hi";
  const otherHref = localizePath(isTranslated(path) ? path : "/", otherLocale);
  const repoUrl = "https://github.com/thatbeautifuldream/portfolio-astro";
  let commitHash = process.env.VERCEL_GIT_COMMIT_SHA ?? "";
  if (!commitHash) {
    try {
      commitHash = execSync("git rev-parse HEAD").toString().trim();
    } catch {
      commitHash = "";
    }
  }
  const shortHash = commitHash.slice(0, 7);
  let commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE ?? "";
  if (!commitMessage) {
    try {
      commitMessage = execSync("git log -1 --format=%s").toString().trim();
    } catch {
      commitMessage = "";
    }
  }
  commitMessage = commitMessage.split("\n")[0]!;
  const links = [
    { href: siteLinks.github.href, label: "GitHub", icon: "ri:github-fill" },
    {
      href: siteLinks.linkedin.href,
      label: "LinkedIn",
      icon: "ri:linkedin-box-fill",
    },
    { href: siteLinks.x.href, label: "X", icon: "ri:twitter-x-fill" },
    {
      href: siteLinks.chatgpt.href,
      label: siteLinks.chatgpt.label,
      icon: "ri:openai-fill",
    },
  ];
  return (
    <>
      <footer className="grid gap-9 pb-20">
        <div aria-hidden="true" className="bg-rule h-px w-12.5"></div>
        <div className="text-faint grid gap-3">
          <Tooltip
            context={context}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
          >
            <p className="tabular-nums">
              <span
                data-local-time
                data-separator={t.footer.timeSeparator}
              ></span>
              {t.footer.location}
            </p>
            <a
              href={shortHash ? `${repoUrl}/commit/${commitHash}` : repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                shortHash ? t.footer.latestCommit(shortHash) : undefined
              }
              data-tip={commitMessage || undefined}
              className="hover:text-foreground flex items-center gap-1.5 font-normal tabular-nums no-underline"
            >
              <Icon
                name="ri:git-commit-line"
                className="size-5 shrink-0 sm:size-4"
              />
              {shortHash || t.footer.source}
            </a>
          </Tooltip>
          <Tooltip
            context={context}
            className="flex items-center justify-between gap-4"
          >
            <ul role="list" className="flex items-center gap-x-4">
              {links.map(({ href, label, icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-footer-social={label}
                    aria-label={label}
                    data-tip={label}
                    className="hover:text-foreground flex font-normal no-underline"
                  >
                    <Icon name={icon} className="size-5 shrink-0 sm:size-4" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-x-4">
              <a
                href={otherHref}
                hrefLang={otherLocale}
                lang={otherLocale}
                aria-label={t.footer.switchLanguage}
                data-tip={t.footer.switchLanguage}
                className="hover:text-foreground flex font-normal no-underline"
              >
                <Icon
                  name="ri:translate-2"
                  className="size-5 shrink-0 sm:size-4"
                />
              </a>
              <button
                type="button"
                id="theme-toggle"
                data-tip={t.footer.toggleTheme}
                className="hover:text-foreground flex cursor-pointer"
              >
                <Icon
                  name="ri:moon-line"
                  className="size-5 shrink-0 sm:size-4 dark:hidden"
                  role="img"
                  aria-label={t.footer.darkMode}
                />
                <Icon
                  name="ri:sun-line"
                  className="size-5 shrink-0 not-dark:hidden sm:size-4"
                  role="img"
                  aria-label={t.footer.lightMode}
                />
              </button>
            </div>
          </Tooltip>
        </div>
      </footer>

      <ClientScript
        id="src/components/Footer.tsx:0"
        code={
          '"use strict";\ndocument.querySelectorAll("footer [data-footer-social]").forEach((link) => {\n    link.addEventListener("click", () => {\n        window.posthog?.capture("footer_social_clicked", {\n            platform: link.dataset.footerSocial,\n        });\n    });\n});\n(() => {\n    const el = document.querySelector("[data-local-time]");\n    if (!el)\n        return;\n    const format = new Intl.DateTimeFormat("en-US", {\n        hour: "numeric",\n        minute: "2-digit",\n        timeZone: "Asia/Kolkata",\n    });\n    const tick = () => {\n        el.textContent = `${format.format(new Date()).replace(" ", "").toLowerCase()}${el.dataset.separator}`;\n    };\n    tick();\n    setInterval(tick, 30_000);\n})();\n(() => {\n    let activeTransition = null;\n    document.getElementById("theme-toggle")?.addEventListener("click", () => {\n        const root = document.documentElement;\n        const next = root.classList.contains("dark") ? "light" : "dark";\n        window.posthog?.capture("theme_toggled", { theme: next });\n        const apply = () => {\n            root.classList.toggle("dark", next === "dark");\n            localStorage.setItem("theme", next);\n        };\n        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;\n        if (!document.startViewTransition || reduced) {\n            apply();\n            return;\n        }\n        root.classList.add("theme-transition");\n        const transition = document.startViewTransition(apply);\n        activeTransition = transition;\n        // A rapid second toggle skips this transition and fires its finished\n        // callback while the new one is still running — only the latest\n        // transition may clean up the class, or the page-transition CSS takes\n        // over mid-wipe.\n        transition.finished.finally(() => {\n            if (activeTransition === transition) {\n                activeTransition = null;\n                root.classList.remove("theme-transition");\n            }\n        });\n    });\n})();\n'
        }
        vars={{}}
      />
    </>
  );
}
