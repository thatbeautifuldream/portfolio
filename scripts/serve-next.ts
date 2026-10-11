// Run the actual production server so audits and tests exercise Next routing,
// metadata, image optimization, caching, and the same headers used on Vercel.
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

export interface ServerHandle {
  url: string;
  close(): Promise<void>;
}
export async function startServer({
  port = 0,
}: { port?: number } = {}): Promise<ServerHandle> {
  if (!port) {
    const socket = createServer();
    await new Promise<void>((resolve, reject) => {
      socket.once("error", reject);
      socket.listen(0, "127.0.0.1", resolve);
    });
    port = (socket.address() as { port: number }).port;
    await new Promise<void>((resolve, reject) =>
      socket.close((error) => (error ? reject(error) : resolve())),
    );
  }
  const child = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const url = `http://127.0.0.1:${port}`;
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });
  const close = async () => {
    if (child.exitCode !== null) return;
    await new Promise<void>((resolve) => {
      child.once("exit", () => resolve());
      child.kill("SIGTERM");
    });
  };
  try {
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      if (child.exitCode !== null)
        throw new Error(`Next.js exited ${child.exitCode}: ${output}`);
      try {
        const response = await fetch(url);
        if (response.ok) return { url, close };
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Next.js did not become ready: ${output}`);
  } catch (error) {
    await close();
    throw error;
  }
}
// Legacy fixture names map to their unchanged public URLs.
export function resourcePath(file: string) {
  if (file === "404.html") return "/404/";
  if (file === "index.html") return "/";
  return "/" + file.replace(/index\.html$/, "");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await startServer({ port: Number(process.argv[2]) || 4321 });
  console.log(`Next.js production server: ${server.url}`);
  for (const signal of ["SIGTERM", "SIGINT"] as const)
    process.once(signal, () => {
      void server.close().then(() => process.exit());
    });
}
