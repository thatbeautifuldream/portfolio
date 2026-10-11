import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import test from "node:test";
import { startServer } from "./serve-dist.ts";

const worker = await fs.readFile("public/sw.js", "utf8");
function harness(network: typeof fetch = fetch) {
  const listeners = new Map<string, (event: any) => void>();
  const removed: string[] = [];
  const stored: Request[] = [];
  const offline = new Response("offline fallback");
  let skipped = false;
  let claimed = false;
  vm.runInNewContext(worker, {
    Request: class extends Request {
      constructor(input: string | URL | Request, init?: RequestInit) {
        super(
          typeof input === "string"
            ? new URL(input, "https://portfolio.test")
            : input,
          init,
        );
      }
    },
    Response,
    fetch: network,
    caches: {
      open: async () => ({
        add: async (request: Request) => stored.push(request),
      }),
      keys: async () => [
        "portfolio-pwa-offline-v0",
        "portfolio-pwa-offline-v1",
        "unrelated-cache",
      ],
      delete: async (key: string) => removed.push(key),
      match: async (url: string) =>
        url === "/offline.html" ? offline : undefined,
    },
    self: {
      addEventListener: (name: string, listener: (event: any) => void) =>
        listeners.set(name, listener),
      skipWaiting: async () => {
        skipped = true;
      },
      clients: {
        claim: async () => {
          claimed = true;
        },
      },
    },
  });
  return {
    listeners,
    removed,
    stored,
    offline,
    status: () => ({ skipped, claimed }),
  };
}

test("worker precaches only the fallback and cleans up its own obsolete caches", async () => {
  const h = harness();
  let pending: Promise<unknown>;
  const event = {
    waitUntil: (promise: Promise<unknown>) => {
      pending = promise;
    },
  };
  h.listeners.get("install")!(event);
  await pending!;
  assert.equal(h.stored.length, 1);
  assert.equal(h.stored[0].url, "https://portfolio.test/offline.html");
  assert.equal(h.stored[0].cache, "reload");
  assert.equal(h.status().skipped, true);
  h.listeners.get("activate")!(event);
  await pending!;
  assert.deepEqual(h.removed, ["portfolio-pwa-offline-v0"]);
  assert.equal(h.status().claimed, true);
});

test("failed document navigation returns the precached offline page", async () => {
  const h = harness(async () => {
    throw new TypeError("offline");
  });
  let response: Promise<Response> | undefined;
  h.listeners.get("fetch")!({
    request: { mode: "navigate", method: "GET" },
    respondWith: (promise: Promise<Response>) => {
      response = promise;
    },
  });
  assert.equal(await (await response!).text(), "offline fallback");
});

test("online navigation stays fresh and API, RSC, and asset requests are untouched", async () => {
  const online = new Response("fresh page");
  const h = harness(async () => online);
  let response: Promise<Response> | undefined;
  h.listeners.get("fetch")!({
    request: { mode: "navigate", method: "GET" },
    respondWith: (promise: Promise<Response>) => {
      response = promise;
    },
  });
  assert.equal(await response!, online);
  for (const request of [
    { mode: "cors", method: "GET" },
    { mode: "same-origin", method: "GET" },
    { mode: "navigate", method: "POST" },
  ]) {
    h.listeners.get("fetch")!({
      request,
      respondWith: () => assert.fail("must pass through"),
    });
  }
});

test("export serves worker update headers, offline page, and valid install icons", async () => {
  const server = await startServer({ port: 0 });
  try {
    const sw = await fetch(new URL("sw.js", server.url));
    assert.equal(sw.status, 200);
    assert.match(sw.headers.get("content-type")!, /application\/javascript/);
    assert.equal(
      sw.headers.get("cache-control"),
      "no-cache, no-store, must-revalidate",
    );
    assert.equal(
      sw.headers.get("content-security-policy"),
      "default-src 'self'; script-src 'self'",
    );
    const fallback = await fetch(new URL("offline.html", server.url));
    assert.equal(fallback.status, 200);
    assert.match(await fallback.text(), /href=""/);
    const manifest = await (
      await fetch(new URL("manifest.webmanifest", server.url))
    ).json();
    assert.equal(manifest.display, "standalone");
    for (const icon of manifest.icons) {
      const response = await fetch(new URL(icon.src, server.url));
      assert.equal(response.status, 200, icon.src);
      assert.equal(response.headers.get("content-type"), "image/png");
    }
  } finally {
    await server.close();
  }
});
