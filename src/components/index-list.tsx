import SiteLink from "./site-link";
import type { ComponentProps } from "../lib/ui";
import { classes } from "../lib/ui";
import { Icon } from "../lib/ui";
interface Item {
  href: string;
  title: string;
  meta?: string;
  group?: string;
  external?: boolean;
  attrs?: Record<string, string>;
}
interface Props {
  title: string;
  items: Item[];
  class?: string;
}
export default async function View(props: ComponentProps & Props) {
  const { title, items, className } = props;
  const grouped = items.some((item) => item.group);
  const groups = items.reduce<{ label?: string; items: Item[] }[]>(
    (acc, item) => {
      const last = acc.at(-1);
      if (last && last.label === item.group) last.items.push(item);
      else acc.push({ label: item.group, items: [item] });
      return acc;
    },
    [],
  );
  return (
    <>
      <section className={classes(["min-w-0", className])}>
        <h2 className="section-title">{title}</h2>
        <ul role="list" className="index-list divide-border divide-y">
          {groups.map((group, index) => (
            <li key={group.label ?? index}>
              {grouped && group.label && (
                <p className="text-faint pt-6 pb-1 tabular-nums">
                  {group.label}
                </p>
              )}
              <ul role="list" className="divide-border divide-y">
                {group.items.map((item) => (
                  <li key={`${item.href}:${item.title}`}>
                    <SiteLink
                      href={item.href}
                      {...(item.external && {
                        target: "_blank",
                        rel: "noopener noreferrer",
                      })}
                      {...item.attrs}
                      className="group flex items-center justify-between gap-4 py-3 no-underline"
                    >
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <span className="min-w-0 truncate">{item.title}</span>
                        {item.external && (
                          <Icon
                            name="ri:arrow-right-up-line"
                            className="text-faint size-4 shrink-0 transition-transform group-hover:translate-x-0.5 sm:size-3.5"
                          />
                        )}
                      </span>
                      {item.meta && (
                        <span className="text-faint max-w-1/2 shrink-0 truncate tabular-nums">
                          {item.meta}
                        </span>
                      )}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
