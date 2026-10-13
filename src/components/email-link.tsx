import SiteLink from "./site-link";
import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientEnhancement from "./client-enhancement";
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
          className="inline-flex cursor-pointer items-center text-faint hover:text-foreground"
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

      <ClientEnhancement kind="email-copy" />
    </>
  );
}
