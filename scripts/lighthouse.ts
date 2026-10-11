// Verification loop CLI: build, serve the production Next.js app, and
// audit mobile + desktop via the Lighthouse Node API, reporting the median of N
// runs plus every audit below 100%. Composes scripts/serve-next.ts (the app) and
// scripts/lighthouse-runner.ts (the audit) — either can be used independently.
// Usage: node scripts/lighthouse.ts [--url https://prod] [--no-build] [--runs 3]
import { spawn } from "node:child_process";
import { startServer, type ServerHandle } from "./serve-next.ts";
import {
  withChrome,
  runMedian,
  scores,
  gapsByCategory,
  type FormFactor,
  type CategoryScores,
} from "./lighthouse-runner.ts";
import type * as LH from "lighthouse/types/lh.js";

const args = process.argv.slice(2);
const flag = (name: string): string | null =>
  args.includes(name) ? (args[args.indexOf(name) + 1] ?? null) : null;

const externalUrl = flag("--url");
const noBuild = args.includes("--no-build");
const runs = Math.max(1, Number(flag("--runs")) || 3);
const PORT = 0;
const FORM_FACTORS: FormFactor[] = ["mobile", "desktop"];

const run = (cmd: string, cmdArgs: string[]): Promise<void> =>
  new Promise((res, rej) => {
    const p = spawn(cmd, cmdArgs, { stdio: "inherit" });
    p.on("exit", (code) =>
      code === 0 ? res() : rej(new Error(`${cmd} exited ${code}`)),
    );
  });

function report(formFactor: FormFactor, lhr: LH.Result): CategoryScores {
  const line = Object.values(lhr.categories)
    .map((c) => `${c.title}: ${Math.round((c.score ?? 0) * 100)}`)
    .join("  |  ");
  console.log(`\n=== ${formFactor.toUpperCase()} ===\n${line}\n`);
  for (const { title, gaps } of gapsByCategory(lhr)) {
    const lines = gaps.map(
      (g) =>
        `    - ${g.id}: ${g.score}%${g.displayValue ? ` (${g.displayValue})` : ""}`,
    );
    console.log(`  ${title} gaps:\n${lines.join("\n")}`);
  }
  return scores(lhr);
}

async function main() {
  if (!externalUrl && !noBuild) await run("pnpm", ["build"]);

  let server: ServerHandle | undefined;
  let url = externalUrl;
  if (!url) {
    server = await startServer({ port: PORT });
    url = server.url;
  }

  try {
    const summary: Record<string, CategoryScores> = {};
    await withChrome(async ({ port }) => {
      for (const ff of FORM_FACTORS)
        summary[ff] = report(ff, await runMedian(url!, ff, { port, runs }));
    });
    console.log(`\n=== SUMMARY (median of ${runs}) ===`);
    console.table(summary);
  } finally {
    await server?.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
