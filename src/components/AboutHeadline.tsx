import { Fragment } from "react";
import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import AboutMotion from "./AboutMotion";
import { Icon } from "../lib/ui";
import { aboutCopy } from "../data/about";
import type { Locale } from "../i18n";
interface Props {
  locale: Locale;
}
export default async function View(props: ComponentProps & Props) {
  const context = props.context;
  const { locale } = props;
  const copy = aboutCopy[locale];
  const groups = [
    {
      before: copy.before,
      punctuation: locale === "en" ? "," : "",
      values: copy.subjects,
      label: copy.changeSubject,
      icons: ["ri:layout-4-fill", "ri:apps-2-fill", "ri:lightbulb-flash-fill"],
      colors: ["text-sky-500", "text-violet-500", "text-amber-500"],
    },
    {
      before: copy.between,
      punctuation: locale === "en" ? "," : "",
      values: copy.tools,
      label: copy.changeTool,
      logos: ["react", "nextjs", "tanstack", "expo"],
    },
    {
      before: copy.after,
      punctuation: locale === "en" ? "." : "।",
      values: copy.qualities,
      label: copy.changeQuality,
      icons: ["ri:cursor-fill", "ri:magic-fill", "ri:heart-3-fill"],
      colors: ["text-emerald-500", "text-violet-500", "text-rose-500"],
    },
  ];
  return (
    <>
      <div className="grid gap-4">
        <p className="text-muted-foreground text-base/7 sm:text-sm/6">
          {copy.greeting}
        </p>
        <div className="about-heading-flow">
          <h1 className="about-heading max-w-[35ch] text-3xl font-medium tracking-tight sm:text-4xl">
            {groups.map((group) => (
              <Fragment key={group.label}>
                {group.before}{" "}
                <span className="inline-flex items-baseline whitespace-nowrap">
                  <button
                    type="button"
                    className="morph-word"
                    data-morph-words={JSON.stringify(group.values)}
                    aria-label={`${group.label}: ${group.values[0]}`}
                    data-label={group.label}
                  >
                    <span className="morph-icon-slot" aria-hidden="true">
                      {group.values.map((_, index) => (
                        <span
                          key={index}
                          className="morph-icon"
                          data-morph-icon={index}
                          hidden={index !== 0}
                        >
                          {group.logos ? (
                            <>
                              <img
                                src={`/icons/about/${group.logos[index]}-light.svg`}
                                alt=""
                                width="36"
                                height="36"
                                className="dark:hidden"
                              />
                              <img
                                src={`/icons/about/${group.logos[index]}-dark.svg`}
                                alt=""
                                width="36"
                                height="36"
                                className="not-dark:hidden"
                              />
                            </>
                          ) : (
                            <Icon
                              name={group.icons![index]!}
                              className={group.colors![index]}
                            />
                          )}
                        </span>
                      ))}
                    </span>
                    <span data-morph-text>{group.values[0]}</span>
                  </button>
                  <span>{group.punctuation}</span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>
        </div>
      </div>

      <AboutMotion />
    </>
  );
}
