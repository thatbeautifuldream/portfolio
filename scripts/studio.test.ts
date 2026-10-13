import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { headers, rewrites } from "../src/lib/routing";
import { studioMetadata } from "../src/lib/metadata";
import {
  buildStudioSchema,
  siteConfig,
  sitePages,
  studioEmbedPath,
  studioPlayerSize,
} from "../src/lib/seo";
import { getOGPages, getStoryPages } from "../src/lib/og-data";
import { getStudioImages, imageGroups } from "../src/views/studio/images";
import {
  constrain,
  defaultCamera,
  fitCamera,
  loadCamera,
  legacyStorageKey,
  storageKey,
  saveCamera,
  readCamera,
  zoomAt,
} from "../src/views/studio/camera";
import { inventory, primitiveInventory } from "../src/views/studio/inventory";
import icons from "@iconify-json/ri/icons.json";

test("Studio controls use existing project icons rendered on the server", () => {
  const samples = readFileSync("src/views/studio/samples.tsx", "utf8");
  const canvas = readFileSync("src/views/studio/canvas.tsx", "utf8");
  const controls = {
    zoomOut: "subtract-line",
    zoomIn: "add-line",
    fit: "fullscreen-line",
    reset: "restart-line",
    theme: "moon-line",
  } as const;
  for (const [control, name] of Object.entries(controls)) {
    assert.ok(icons.icons[name as keyof typeof icons.icons]);
    assert.ok(samples.includes(`<Icon name="ri:${name}"`));
    assert.ok(canvas.includes(`{controlIcons.${control}}`));
  }
  assert.ok(samples.includes('<Icon name="ri:sun-line"'));
  assert.ok(!canvas.includes("../../lib/ui"));
});

test("canvas accounts for every component and renders each listed variant", () => {
  const files = readdirSync("src/components")
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""));
  assert.deepEqual(inventory.map((item) => item.file).sort(), files.sort());
  const samples =
    readFileSync("src/views/studio/samples.tsx", "utf8") +
    readFileSync("src/views/studio/preview-samples.tsx", "utf8");
  for (const item of [...inventory, ...primitiveInventory]) {
    if ("omitted" in item) {
      assert.ok(item.omitted);
      continue;
    }
    assert.ok(samples.includes(`id="${item.group}"`), item.group);
    for (const variant of item.variants)
      assert.ok(samples.includes(`"${variant}"`), variant);
  }
});

test("Studio gallery includes every OG and story resource without duplicates", async () => {
  const expected = [
    siteConfig.defaultImage,
    "/studio/og.png",
    "/hi/studio/og.png",
    ...Object.keys(await getOGPages()).map((route) => `/og/${route}`),
  ];
  for (const locale of ["en", "hi"] as const) {
    expected.push(
      ...Object.keys(await getStoryPages(locale)).map(
        (filename) => `/share/${locale === "hi" ? "hi/" : ""}${filename}`,
      ),
    );
  }
  const images = await getStudioImages();
  assert.deepEqual(
    images.map((image) => image.src).toSorted(),
    expected.toSorted(),
  );
  assert.equal(new Set(images.map((image) => image.src)).size, images.length);
  for (const image of images) {
    assert.equal(image.width, image.kind === "og" ? 1200 : 1080);
    assert.equal(image.height, image.kind === "og" ? 630 : 1920);
    if (image.src.includes("/hi/") || image.src === "/og/hi.png")
      assert.equal(image.locale, "hi");
  }
  const groups = imageGroups(images);
  assert.equal(new Set(groups.map((group) => group.id)).size, groups.length);
  assert.deepEqual(
    groups
      .flatMap((group) => group.images.map((image) => image.src))
      .toSorted(),
    expected.toSorted(),
  );
  assert.ok(
    groups.every(
      (group) => group.images.length > 0 && group.images.length <= 4,
    ),
  );
});

test("Studio metadata is localized, complete, and allows indexing", () => {
  for (const locale of ["en", "hi"] as const) {
    const path = locale === "hi" ? "/hi/studio/" : "/studio/";
    const metadata = studioMetadata(locale);
    const graph = metadata.openGraph;
    assert.ok(graph && "url" in graph && "locale" in graph);
    assert.equal(graph.url, siteConfig.url + path);
    assert.equal(graph.locale, locale === "hi" ? "hi_IN" : "en_US");
    assert.equal(metadata.alternates?.canonical, siteConfig.url + path);
    assert.deepEqual(metadata.robots, {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
    assert.ok(metadata.twitter && "card" in metadata.twitter);
    assert.equal(metadata.twitter.card, "player");
    assert.ok("players" in metadata.twitter);
    assert.deepEqual(metadata.twitter.players, []);
    assert.equal(
      metadata.other?.["twitter:player"],
      siteConfig.url + studioEmbedPath(locale),
    );
    assert.equal(
      metadata.other?.["twitter:player:width"],
      String(studioPlayerSize.width),
    );
    assert.equal(
      metadata.other?.["twitter:player:height"],
      String(studioPlayerSize.height),
    );
    assert.ok(!Object.hasOwn(metadata.other!, "twitter:player:stream"));
    assert.deepEqual(graph.images, [
      { url: `${path}og.png`, width: 1200, height: 630, alt: metadata.title },
    ]);
    assert.ok(metadata.description);
    assert.equal(buildStudioSchema(locale)["@type"], "CollectionPage");
    assert.equal(buildStudioSchema(locale).inLanguage, locale);
    assert.ok(!sitePages.some((page) => String(page.path).includes("studio")));
  }
});

test("Studio embeds reuse previews without indexing, gallery work, or shared camera storage", () => {
  for (const locale of ["en", "hi"] as const) {
    const metadata = studioMetadata(locale, true);
    assert.deepEqual(metadata.robots, {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    });
    assert.equal(metadata.other, undefined);
    assert.ok(metadata.twitter && "card" in metadata.twitter);
    assert.equal(metadata.twitter.card, "summary_large_image");
    assert.equal(
      metadata.alternates?.canonical,
      siteConfig.url + (locale === "hi" ? "/hi" : "") + "/studio/",
    );
  }
  const samples = readFileSync("src/views/studio/samples.tsx", "utf8");
  const canvas = readFileSync("src/views/studio/canvas.tsx", "utf8");
  const preview = readFileSync("src/views/studio/isolated-preview.tsx", "utf8");
  assert.ok(
    samples.includes("embedded ? [] : imageGroups(await getStudioImages())"),
  );
  assert.equal((samples.match(/embedded=\{embedded\}/g) ?? []).length, 6);
  assert.ok(canvas.includes("embedded ? undefined : loadCamera"));
  assert.ok(canvas.includes("if (!embedded)"));
  assert.ok(preview.includes('embedded ? "embed/" : ""'));
});

test("camera migrates the old canvas key and fits the complete gallery on mobile", () => {
  const values = new Map([
    [legacyStorageKey, JSON.stringify({ version: 2, camera: defaultCamera })],
  ]);
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
  };
  assert.deepEqual(
    loadCamera(() => storage),
    defaultCamera,
  );
  assert.ok(!values.has(legacyStorageKey));
  assert.equal(
    saveCamera(() => storage, defaultCamera),
    true,
  );
  assert.ok(values.has(storageKey));
  const bounds = { x: 64, y: 36, width: 640, height: 30000 };
  const camera = fitCamera(bounds, 390, 844);
  assert.ok(camera.scale < 0.1);
  assert.ok((bounds.y + bounds.height) * camera.scale + camera.y <= 844 - 24);
});

test("unavailable and quota-limited camera storage fail safely", () => {
  const unavailable = () => {
    throw new Error("Storage unavailable");
  };
  assert.equal(loadCamera(unavailable), undefined);
  assert.equal(saveCamera(unavailable, defaultCamera), false);
  let saved = "";
  let removed = false;
  const storage = {
    getItem: () => "malformed",
    setItem: (_key: string, value: string) => {
      saved = value;
    },
    removeItem: () => {
      removed = true;
    },
  };
  assert.equal(
    loadCamera(() => storage),
    undefined,
  );
  assert.ok(removed);
  assert.equal(
    saveCamera(() => storage, defaultCamera),
    true,
  );
  assert.deepEqual(JSON.parse(saved), { version: 2, camera: defaultCamera });
  assert.equal(
    saveCamera(
      () => ({
        ...storage,
        setItem: () => {
          throw new Error("Quota exceeded");
        },
      }),
      defaultCamera,
    ),
    false,
  );
});

test("camera rejects invalid storage and migrates its known older format", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "{}",
    "x".repeat(1025),
    '{"version":3,"camera":{"x":1,"y":2,"scale":1}}',
    '{"version":2,"camera":{"x":"1","y":0,"scale":1}}',
  ])
    assert.equal(readCamera(raw), undefined);
  assert.deepEqual(
    readCamera('{"version":1,"x":10,"y":20,"scale":0.5,"positions":[]}'),
    { x: 10, y: 20, scale: 0.5 },
  );
  assert.deepEqual(
    readCamera(JSON.stringify({ version: 2, camera: defaultCamera })),
    defaultCamera,
  );
  assert.deepEqual(constrain({ x: Infinity, y: -200000, scale: 9 }), {
    x: 0,
    y: -100000,
    scale: 3,
  });
});

test("zoom is cursor anchored and fit is bounded without rearranging content", () => {
  const camera = { x: 20, y: 40, scale: 0.5 };
  const next = zoomAt(camera, 2, 300, 200);
  assert.equal((300 - next.x) / next.scale, (300 - camera.x) / camera.scale);
  assert.equal((200 - next.y) / next.scale, (200 - camera.y) / camera.scale);
  const bounds = { x: 64, y: 36, width: 1344, height: 2000 };
  const fitted = fitCamera(bounds, 1280, 800);
  assert.ok(bounds.x * fitted.scale + fitted.x >= 32);
  assert.ok(bounds.y * fitted.scale + fitted.y >= 72);
  assert.ok((bounds.y + bounds.height) * fitted.scale + fitted.y <= 800 - 24);
});

test("Studio is public with validated locales and a dedicated canvas route", () => {
  const entry = readFileSync("src/app/[locale]/studio/page.tsx", "utf8");
  assert.ok(!entry.includes("NODE_ENV"));
  assert.ok(
    entry.indexOf("notFound();") <
      entry.indexOf('import("../../../views/studio/samples")'),
  );
  assert.ok(!readFileSync("src/lib/page-routes.ts", "utf8").includes("studio"));
});

test("Studio framing exceptions stay scoped in every environment", async (context) => {
  const previous = process.env.NODE_ENV;
  context.after(() => {
    if (previous === undefined) Reflect.deleteProperty(process.env, "NODE_ENV");
    else Object.assign(process.env, { NODE_ENV: previous });
  });
  for (const environment of ["development", "production"]) {
    Object.assign(process.env, { NODE_ENV: environment });
    const rules = await headers();
    const allowed = rules.filter((rule) =>
      rule.headers.some(
        (header) =>
          header.key === "X-Frame-Options" && header.value === "SAMEORIGIN",
      ),
    );
    assert.deepEqual(
      allowed.map((rule) => rule.source),
      ["/studio/preview", "/:locale(en|hi)/studio/preview"],
    );
    for (const rule of allowed) {
      const policy = rule.headers.find(
        (header) => header.key === "Content-Security-Policy",
      )!.value;
      assert.ok(policy.includes("frame-ancestors 'self'"));
      assert.equal(
        policy.includes("'unsafe-eval'"),
        environment === "development",
      );
    }
    assert.ok(
      rules.some((rule) =>
        rule.headers.some(
          (header) =>
            header.key === "X-Frame-Options" && header.value === "DENY",
        ),
      ),
    );
    const embeds = rules.filter((rule) =>
      rule.headers.some((header) => header.key === "X-Robots-Tag"),
    );
    assert.deepEqual(
      embeds.map((rule) => rule.source),
      [
        "/studio/embed",
        "/:locale(en|hi)/studio/embed",
        "/studio/embed/preview",
        "/:locale(en|hi)/studio/embed/preview",
      ],
    );
    for (const rule of embeds) {
      assert.ok(
        !rule.headers.some((header) => header.key === "X-Frame-Options"),
      );
      const policy = rule.headers.find(
        (header) => header.key === "Content-Security-Policy",
      )!.value;
      assert.ok(
        policy.includes(
          "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com;",
        ),
      );
      assert.equal(
        policy.includes("'unsafe-eval'"),
        environment === "development",
      );
    }
    const routing = await rewrites();
    assert.ok(!Array.isArray(routing));
    assert.equal(
      routing.beforeFiles?.some((rule) => rule.source === "/studio") ?? false,
      true,
    );
  }
});
