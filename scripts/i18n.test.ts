import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test, { after } from "node:test";
import { isLocale, localizePath } from "../src/i18n";
import { localizedPageParams, resolvePageRoute } from "../src/lib/page-routes";
import { sitePages } from "../src/lib/seo";
import { startServer } from "./serve-next";

const server = await startServer();
after(() => server.close());

test("Studio and its images are available in production with localized metadata", async () => {
  const sitemap = await (await fetch(`${server.url}/sitemap-0.xml`)).text();
  for (const prefix of ["", "/hi"]) {
    const response = await fetch(`${server.url}${prefix}/studio/`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-frame-options"), "DENY");
    const html = await response.text();
    assert.ok(html.includes(`lang="${prefix ? "hi" : "en"}"`));
    assert.ok(html.includes(`https://milindmishra.com${prefix}/studio/`));
    assert.ok(html.includes("CollectionPage"));
    assert.ok(html.includes(`${prefix}/studio/og.png`));
    assert.equal((html.match(/name="twitter:card"/g) ?? []).length, 1);
    assert.ok(html.includes('name="twitter:card" content="player"'));
    assert.ok(
      html.includes(
        `name="twitter:player" content="https://milindmishra.com${prefix}/studio/embed/"`,
      ),
    );
    assert.ok(html.includes('name="twitter:player:width" content="640"'));
    assert.ok(html.includes('name="twitter:player:height" content="640"'));
    assert.ok(!html.includes('name="twitter:player:stream"'));
    assert.ok(html.includes('name="robots" content="index, follow"'));
    const url = `https://milindmishra.com${prefix}/studio/`;
    const entry = [...sitemap.matchAll(/<url>(.*?)<\/url>/g)].find((match) =>
      match[1]!.includes(`<loc>${url}</loc>`),
    )?.[1];
    assert.ok(entry, url);
    for (const locale of ["en", "hi"]) {
      assert.ok(
        entry.includes(`hreflang="${locale === "en" ? "en-US" : "hi-IN"}"`),
      );
      assert.ok(
        entry.includes(
          `href="https://milindmishra.com${locale === "hi" ? "/hi" : ""}/studio/"`,
        ),
      );
    }
    assert.ok(!html.includes("googletagmanager.com/gtag/js"));
    const image = await fetch(`${server.url}${prefix}/studio/og.png`);
    assert.equal(image.status, 200);
    assert.equal(image.headers.get("content-type"), "image/png");
    assert.ok(!image.headers.get("x-robots-tag")?.includes("noindex"));
    for (const sample of [
      "about",
      "footer",
      "tooltip",
      "tooltip-meta",
      "code",
    ]) {
      const preview = await fetch(
        `${server.url}${prefix}/studio/preview/?sample=${sample}`,
      );
      assert.equal(preview.status, 200, sample);
      assert.equal(preview.headers.get("x-frame-options"), "SAMEORIGIN");
      const policy = preview.headers.get("content-security-policy")!;
      assert.ok(policy.includes("frame-ancestors 'self'"));
      assert.ok(!policy.includes("'unsafe-eval'"));
      assert.ok(
        (await preview.text()).includes(
          'name="robots" content="noindex, nofollow"',
        ),
      );
    }
  }
  assert.ok(!sitemap.includes("/studio/preview/"));
});

test("Studio embeds and nested previews are available with scoped X framing", async () => {
  for (const path of [
    "/",
    "/hi/",
    "/work/",
    "/hi/work/",
    "/studio/",
    "/hi/studio/",
  ]) {
    const response = await fetch(server.url + path);
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-frame-options"), "DENY", path);
    assert.ok(
      response.headers
        .get("content-security-policy")
        ?.includes("frame-ancestors 'none'"),
      path,
    );
  }
  const sitemap = await (await fetch(`${server.url}/sitemap-0.xml`)).text();
  assert.ok(!sitemap.includes("/studio/embed/"));
  for (const prefix of ["", "/hi"]) {
    const response = await fetch(`${server.url}${prefix}/studio/embed/`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-frame-options"), null);
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
    const policy = response.headers.get("content-security-policy")!;
    assert.ok(
      policy.includes(
        "frame-ancestors 'self' https://x.com https://*.x.com https://twitter.com https://*.twitter.com;",
      ),
    );
    assert.ok(!policy.includes("'unsafe-eval'"));
    const html = await response.text();
    assert.ok(html.includes(`lang="${prefix ? "hi" : "en"}"`));
    assert.ok(html.includes('data-embedded="true"'));
    assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
    assert.ok(!html.includes("data-studio-image"));
    assert.ok(!html.includes("googletagmanager.com/gtag/js"));
    for (const sample of [
      "about",
      "footer",
      "tooltip",
      "tooltip-meta",
      "code",
    ]) {
      const path = `${prefix}/studio/embed/preview/?sample=${sample}`;
      assert.ok(html.includes(path));
      const preview = await fetch(server.url + path);
      assert.equal(preview.status, 200, path);
      assert.equal(preview.headers.get("x-frame-options"), null, path);
      assert.equal(
        preview.headers.get("content-security-policy"),
        policy,
        path,
      );
      assert.ok(
        (await preview.text()).includes(
          'name="robots" content="noindex, nofollow"',
        ),
      );
    }
    const alias = await fetch(`${server.url}/en/studio/embed/?test=1`, {
      redirect: "manual",
    });
    assert.equal(alias.status, 308);
    assert.equal(
      new URL(alias.headers.get("location")!, server.url).pathname,
      "/studio/embed/",
    );
  }
  for (const path of [
    "/studio/embedder/",
    "/studio/embed/missing/",
    "/hi/studio/embed/missing/",
  ]) {
    const response = await fetch(server.url + path);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get("x-frame-options"), "DENY", path);
    assert.ok(
      response.headers
        .get("content-security-policy")
        ?.includes("frame-ancestors 'none'"),
      path,
    );
  }
  for (const path of [
    "/studio/embed/preview/?sample=unknown",
    "/hi/studio/embed/preview/",
  ]) {
    assert.equal((await fetch(server.url + path)).status, 404, path);
  }
});

test("invalid Studio samples and obsolete canvas routes remain unavailable", async () => {
  for (const path of [
    "/studio/preview/",
    "/hi/studio/preview/?sample=unknown",
    "/component-canvas/",
    "/hi/component-canvas/",
  ]) {
    const response = await fetch(server.url + path);
    assert.equal(response.status, 404, path);
    if (path.includes("/preview/")) continue;
    assert.equal(response.headers.get("x-frame-options"), "DENY", path);
    assert.ok(
      response.headers
        .get("content-security-policy")
        ?.includes("frame-ancestors 'none'"),
      path,
    );
  }
});

test("locale and route resolution reject unsupported and malformed paths", () => {
  assert.equal(isLocale("en"), true);
  assert.equal(isLocale("hi"), true);
  for (const locale of ["fr", "EN", "toString", "constructor"])
    assert.equal(isLocale(locale), false);
  for (const params of [
    { locale: "fr", path: [] },
    { locale: "hi", path: ["404"] },
    { locale: "en", path: ["missing"] },
    { locale: "en", path: ["work", "extra"] },
    { locale: "en", path: ["blog", "post", "extra"] },
    { locale: "en", path: ["constructor", "post"] },
  ])
    assert.equal(resolvePageRoute(params), undefined);
  assert.equal(resolvePageRoute({ locale: "hi" })?.path, "/");
  assert.equal(
    resolvePageRoute({ locale: "en", path: ["work"] })?.path,
    "/work/",
  );
  const article = resolvePageRoute({
    locale: "hi",
    path: ["blog", "probably-the-best-work"],
  });
  assert.equal(article?.kind, "content");
  if (article?.kind === "content") {
    assert.equal(article.section, "blog");
    assert.equal(article.prop, "post");
  }
});

test("one registry retains every public page and prerenders every locale", async () => {
  const params = await localizedPageParams();
  const paths = params.map(
    ({ locale, path = [] }) =>
      localizePath("/" + path.join("/"), locale).replace(/\/$/, "") || "/",
  );
  assert.equal(new Set(paths).size, paths.length);
  const baseline = JSON.parse(
    await readFile("scripts/fixtures/astro-parity.json", "utf8"),
  );
  const expected = Object.keys(baseline.pages)
    .filter((file) => !file.startsWith("whatsapp") && file !== "404.html")
    .map(
      (file) =>
        ("/" + file.replace(/index\.html$/, "")).replace(/\/$/, "") || "/",
    );
  assert.deepEqual(paths.toSorted(), expected.toSorted());
  assert.deepEqual(
    params
      .filter(({ locale, path }) => locale === "en" && path.length <= 1)
      .map(({ path }) => "/" + path.join("/"))
      .toSorted(),
    sitePages.map(({ path }) => path).toSorted(),
  );
  for (const page of sitePages)
    assert.ok(
      resolvePageRoute({
        locale: "en",
        path: page.path.split("/").filter(Boolean),
      }),
    );
  const manifest = JSON.parse(
    await readFile(".next/prerender-manifest.json", "utf8"),
  );
  for (const { locale, path = [] } of params) {
    const internal = `/${locale}${path.length ? "/" + path.join("/") : ""}`;
    assert.ok(Object.hasOwn(manifest.routes, internal), internal);
  }
});

test("localized URLs preserve document language, canonicals, and alternates", async () => {
  for (const path of ["", "work", "blog/probably-the-best-work"]) {
    for (const locale of ["en", "hi"] as const) {
      const pathname = localizePath("/" + path, locale);
      const response = await fetch(new URL(pathname, server.url));
      assert.equal(response.status, 200, pathname);
      const html = await response.text();
      assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
      const canonical = `https://milindmishra.com${pathname.replace(/\/?$/, "/")}`;
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`), pathname);
      assert.match(html, /hrefLang="en"/);
      assert.match(html, /hrefLang="hi"/);
      assert.doesNotMatch(html, /href="https:\/\/milindmishra\.com\/en\//);
    }
  }
});

test("default-locale aliases redirect without losing queries", async () => {
  for (const path of ["", "work", "blog/probably-the-best-work"]) {
    const response = await fetch(
      new URL(`/en/${path}${path ? "/" : ""}?source=i18n`, server.url),
      { redirect: "manual" },
    );
    assert.equal(response.status, 308);
    const location = new URL(response.headers.get("location")!, server.url);
    assert.equal(location.pathname, path ? `/${path}/` : "/");
    assert.equal(location.search, "?source=i18n");
  }
});

test("unknown locales, pages, and articles return real 404 responses", async () => {
  for (const path of [
    "/missing/",
    "/404/",
    "/hi/missing/",
    "/fr/work/",
    "/toString/",
    "/hi/404/",
    "/blog/does-not-exist/",
    "/hi/blog/does-not-exist/",
    "/hi/blog/probably-the-best-work/extra/",
  ]) {
    const response = await fetch(new URL(path, server.url));
    assert.equal(response.status, 404, path);
    assert.match(await response.text(), /This page wandered off/);
  }
});

test("localized HTML rewrites leave Markdown and resource routes intact", async () => {
  for (const path of [
    "/",
    "/hi/",
    "/blog/probably-the-best-work/",
    "/hi/blog/probably-the-best-work/",
  ]) {
    const response = await fetch(new URL(path, server.url), {
      headers: { Accept: "text/markdown" },
    });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type")!, /text\/markdown/);
    assert.match(await response.text(), /^# /);
  }
  for (const path of [
    "/robots.txt",
    "/rss.xml",
    "/og.png",
    "/og/hi.png",
    "/share/hi/probably-the-best-work.png",
    "/manifest.webmanifest",
    "/sw.js",
  ]) {
    const response = await fetch(new URL(path, server.url));
    assert.equal(response.status, 200, path);
  }
});
