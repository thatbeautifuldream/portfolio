import SiteLink from "./SiteLink";
import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import ClientScript from "./ClientScript";
import { siteLinks } from "../data/portfolio";
import Tooltip from "./Tooltip";
import { getLocale, locales, useTranslations } from "../i18n";
type Day = { date: string; count: number };
export default async function View(props: ComponentProps) {
  const context = props.context;
  const locale = getLocale(context.locale);
  const t = useTranslations(locale).github;
  const { dateLocale } = locales[locale];
  const opacity = [
    "fill-foreground/6",
    "fill-foreground/25",
    "fill-foreground/45",
    "fill-foreground/70",
    "fill-foreground",
  ];
  const handles = [siteLinks.github.href, "https://github.com/milind-foyer"];
  const days = new Map<string, Day & { row: number; col: number }>();
  let total = 0;
  for (const html of await Promise.all(
    handles.map((href) =>
      fetch(`https://github.com/users/${href.split("/").pop()}/contributions`)
        .then((res) => res.text())
        .catch(() => ""),
    ),
  )) {
    const labels = new Map(
      [
        ...html.matchAll(
          /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)/g,
        ),
      ].map(([, id, text]) => [id, text.trim()]),
    );
    for (const [td] of html.matchAll(
      /<td[^>]*ContributionCalendar-day[^>]*>/g,
    )) {
      const [id, row, col] = td.match(
        /contribution-day-component-(\d+)-(\d+)/,
      )!;
      const date = td.match(/data-date="([^"]+)"/)![1]!;
      const count = labels.get(id)?.match(/^\S+/)?.[0] ?? "";
      const day = days.get(date) ?? { date, count: 0, row: +row!, col: +col! };
      day.count += Number(count.replace(/,/g, "")) || 0;
      days.set(date, day);
    }
    total += Number(
      html
        .replace(/\s+/g, " ")
        .match(/([\d,]+) contributions? in the last year/)?.[1]
        ?.replace(/,/g, "") ?? 0,
    );
  }
  const sorted = [...days.values()]
    .map((day) => day.count)
    .filter(Boolean)
    .sort((a, b) => a - b);
  const quartiles = [0.25, 0.5, 0.75].map(
    (q) => sorted[Math.floor(q * (sorted.length - 1))]!,
  );
  const level = (count: number) =>
    count && 1 + quartiles.filter((q) => count > q).length;
  const weeks: Day[][] = [];
  for (const { row, col, ...day } of days.values()) {
    (weeks[col] ??= [])[row] = day;
  }
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(dateLocale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  const cell = 10;
  const gap = 3;
  const height = 7 * (cell + gap) - gap;
  return (
    <>
      {weeks.length > 0 && (
        <section className="@container grid min-w-0 gap-4">
          <h2 className="section-title">{t.title}</h2>
          <div className="gh-chart min-w-0">
            <Tooltip context={context}>
              <div className="flex justify-end overflow-hidden @max-[33.75rem]:block @max-[33.75rem]:overflow-x-auto">
                <svg
                  viewBox={`0 0 ${weeks.length * (cell + gap) - gap} ${height}`}
                  className="h-auto w-full min-w-135 shrink-0"
                  role="img"
                  aria-label={t.summary(total.toLocaleString(dateLocale))}
                >
                  {weeks.map((week, col) =>
                    week.map(
                      (day, row) =>
                        day && (
                          <rect
                            key={day.date}
                            x={col * (cell + gap)}
                            y={row * (cell + gap)}
                            width={cell}
                            height={cell}
                            rx="2"
                            className={opacity[level(day.count)]}
                            style={{ "--i": col + row } as React.CSSProperties}
                            data-tip={t.day(
                              day.count,
                              day.count.toLocaleString(dateLocale),
                            )}
                            data-tip-meta={formatDate(day.date)}
                          />
                        ),
                    ),
                  )}
                </svg>
              </div>
            </Tooltip>
          </div>
          <p className="text-faint flex items-baseline justify-between gap-4">
            <span className="tabular-nums">
              {t.total(total.toLocaleString(dateLocale))}
            </span>
            <span className="flex shrink-0 gap-3 max-sm:hidden">
              {handles.map((href) => (
                <SiteLink
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground no-underline"
                >
                  @{href.split("/").pop()}
                </SiteLink>
              ))}
            </span>
          </p>
        </section>
      )}

      <ClientScript
        id="src/components/GitHubChart.tsx:0"
        code={
          '"use strict";\ndocument.querySelectorAll(".gh-chart").forEach((chart) => {\n    const svg = chart.querySelector("svg");\n    chart.classList.add("is-pending");\n    new IntersectionObserver(([entry], observer) => {\n        if (!entry.isIntersecting)\n            return;\n        chart.classList.replace("is-pending", "is-in");\n        observer.disconnect();\n    }).observe(svg);\n});\n'
        }
        vars={{}}
      />
    </>
  );
}
