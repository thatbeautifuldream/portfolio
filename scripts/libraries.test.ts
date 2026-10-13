import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import type { Result } from "lighthouse";
import { analyticsEnabled, posthogEnabled } from "../src/lib/analytics-config";
import {
  createEnhancementScope,
  deferUntilInteraction,
} from "../src/lib/enhancement-scope";
import { parseFrontmatter } from "../src/lib/frontmatter";
import {
  contentSchemas,
  type CollectionEntry,
} from "../src/lib/content-schema";
import { computeMedianRun } from "./lighthouse-median.ts";

test("analytics opt-out applies to every provider and PostHog requires a token", () => {
  assert.equal(analyticsEnabled("true"), false);
  assert.equal(analyticsEnabled(undefined), true);
  assert.equal(posthogEnabled("true", "phc_test"), false);
  assert.equal(posthogEnabled(undefined, undefined), false);
  assert.equal(posthogEnabled(undefined, "   "), false);
  assert.equal(posthogEnabled(undefined, "phc_test"), true);
});

function deferredEnvironment(
  context: TestContext,
  readyState = "complete",
  prerendering = false,
) {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const browserWindow = new EventTarget();
  const browserDocument = Object.assign(new EventTarget(), {
    readyState,
    prerendering,
  });
  for (const [name, value] of [
    ["window", browserWindow],
    ["document", browserDocument],
  ] as const) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    context.after(() => {
      if (previous) Object.defineProperty(globalThis, name, previous);
      else delete (globalThis as Record<string, unknown>)[name];
    });
  }
  return { browserWindow, browserDocument };
}

test("deferred trackers start once on interaction and cancel their idle fallback", (context) => {
  const { browserWindow } = deferredEnvironment(context);
  const scope = createEnhancementScope();
  let loads = 0;
  deferUntilInteraction(scope, () => {
    loads++;
  });
  context.mock.timers.tick(9_999);
  assert.equal(loads, 0);
  browserWindow.dispatchEvent(new Event("pointerdown"));
  browserWindow.dispatchEvent(new Event("scroll"));
  context.mock.timers.tick(20_000);
  assert.equal(loads, 1);
  scope.dispose();
});

test("deferred trackers retain the 10-second fallback but never start after disposal", (context) => {
  const { browserWindow } = deferredEnvironment(context);
  let loads = 0;
  const first = createEnhancementScope();
  deferUntilInteraction(first, () => {
    loads++;
  });
  context.mock.timers.tick(10_000);
  assert.equal(loads, 1);
  first.dispose();
  const second = createEnhancementScope();
  deferUntilInteraction(second, () => {
    loads++;
  });
  second.dispose();
  browserWindow.dispatchEvent(new Event("keydown"));
  context.mock.timers.tick(10_000);
  assert.equal(loads, 1);
});

test("prerendered and loading documents wait until active and loaded before deferring", (context) => {
  const { browserWindow, browserDocument } = deferredEnvironment(
    context,
    "loading",
    true,
  );
  const scope = createEnhancementScope();
  let loads = 0;
  deferUntilInteraction(scope, () => {
    loads++;
  });
  browserWindow.dispatchEvent(new Event("pointerdown"));
  context.mock.timers.tick(20_000);
  assert.equal(loads, 0);
  browserDocument.prerendering = false;
  browserDocument.dispatchEvent(new Event("prerenderingchange"));
  context.mock.timers.tick(20_000);
  assert.equal(loads, 0);
  browserDocument.readyState = "complete";
  browserWindow.dispatchEvent(new Event("load"));
  browserWindow.dispatchEvent(new Event("pointerdown"));
  assert.equal(loads, 1);
  scope.dispose();
});

test("enhancement scopes dispose listeners, timers, and DOM/observer cleanups", (context) => {
  context.mock.timers.enable({ apis: ["setTimeout"] });
  const target = new EventTarget();
  const scope = createEnhancementScope();
  let events = 0;
  let timeouts = 0;
  let cleanups = 0;
  scope.listen(target, "click", () => {
    events++;
  });
  scope.timeout(() => {
    timeouts++;
  }, 100);
  const cancelled = scope.timeout(() => {
    timeouts++;
  }, 50);
  scope.cancelTimeout(cancelled);
  scope.onCleanup(() => {
    cleanups++;
  });
  target.dispatchEvent(new Event("click"));
  assert.equal(events, 1);
  context.mock.timers.tick(60);
  assert.equal(timeouts, 0);
  scope.dispose();
  scope.dispose();
  target.dispatchEvent(new Event("click"));
  context.mock.timers.tick(100);
  assert.equal(events, 1);
  assert.equal(timeouts, 0);
  assert.equal(cleanups, 1);
  assert.equal(scope.signal.aborted, true);
});

test("effect replay binds fresh listeners without retaining the disposed scope", () => {
  const target = new EventTarget();
  let events = 0;
  const previous = createEnhancementScope();
  previous.listen(target, "click", () => {
    events++;
  });
  previous.dispose();
  const current = createEnhancementScope();
  current.listen(target, "click", () => {
    events++;
  });
  target.dispatchEvent(new Event("click"));
  assert.equal(events, 1);
  current.dispose();
});

test("frontmatter preserves body and validates collection-specific fields", () => {
  const source =
    "\uFEFF---\r\ntitle: Test\r\ndescription: Example\r\ndate: 2026-10-13\r\ncategory: Engineering\r\ncoverImage: ./cover.png\r\n---\r\n# Body\r\n";
  const parsed = parseFrontmatter(source);
  assert.equal(parsed.content, "# Body\r\n");
  const post = contentSchemas.posts.parse(parsed.data);
  assert.equal(post.date.toISOString(), "2026-10-13T00:00:00.000Z");
  assert.equal(post.coverImage, "./cover.png");
  const gist = contentSchemas.gists.parse({
    title: "Test",
    gistId: "id",
    gistUrl: "https://example.com",
    isPublic: true,
  });
  assert.equal(gist.date, undefined);
  assert.equal("category" in gist, false);
  assert.equal(contentSchemas.projects.safeParse(parsed.data).success, false);
  assert.equal(
    contentSchemas.posts.safeParse({ ...post, date: "not-a-date" }).success,
    false,
  );
  const entry: CollectionEntry<"posts"> = {
    id: "test",
    collection: "posts",
    data: {
      ...post,
      coverImage: { src: "/cover.png", width: 100, height: 100 },
    },
    body: parsed.content,
    html: "<h1>Body</h1>",
  };
  assert.equal(entry.data.coverImage?.width, 100);
});

test("frontmatter rejects missing delimiters, duplicate keys, and non-mappings", () => {
  assert.throws(() => parseFrontmatter("# Body"), /frontmatter/);
  assert.throws(
    () => parseFrontmatter("---\ntitle: One\ntitle: Two\n---\n"),
    /unique/,
  );
  assert.throws(() => parseFrontmatter("---\n- item\n---\n"), /mapping/);
});

test("Lighthouse median selection retains a whole run near median FCP and TTI", () => {
  const result = (firstPaint: number, interactive: number) =>
    ({
      audits: {
        "first-contentful-paint": { numericValue: firstPaint },
        interactive: { numericValue: interactive },
      },
    }) as unknown as Result;
  const fast = result(100, 200);
  const middle = result(200, 400);
  const slow = result(900, 2000);
  assert.equal(computeMedianRun([slow, fast, middle]), middle);
  assert.equal(computeMedianRun([slow]), slow);
  assert.equal(computeMedianRun([slow, fast]), fast);
  assert.throws(() => computeMedianRun([]), /No Lighthouse/);
  assert.throws(
    () => computeMedianRun([result(NaN, 100)]),
    /Missing Lighthouse/,
  );
});
