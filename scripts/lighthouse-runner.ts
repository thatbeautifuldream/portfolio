// Composable Lighthouse runner. Knows nothing about how the URL is served —
// give it a URL and it audits it. `withChrome` manages a shared Chrome so many
// audits reuse one browser; `runMedian` stabilises scores across noisy runs.
import lighthouse, { desktopConfig } from "lighthouse";
import { computeMedianRun } from "./lighthouse-median.ts";
import * as chromeLauncher from "chrome-launcher";
import type * as LH from "lighthouse/types/lh.js";

export type FormFactor = "mobile" | "desktop";

export const DEFAULT_CATEGORIES = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
] as const;

export interface RunOptions {
  /** Debugging port of an already-launched Chrome (from `withChrome`). */
  port: number;
  categories?: readonly string[];
}

export interface ChromeHandle {
  port: number;
  kill: () => void | Promise<void>;
}

/** Launch headless Chrome and guarantee it is killed when `fn` settles. */
export async function withChrome<T>(
  fn: (chrome: ChromeHandle) => Promise<T>,
  chromeFlags: string[] = ["--headless", "--no-sandbox", "--disable-gpu"],
): Promise<T> {
  const chrome = await chromeLauncher.launch({ chromeFlags });
  const handle: ChromeHandle = {
    port: chrome.port,
    kill: () => chrome.kill(),
  };
  try {
    return await fn(handle);
  } finally {
    await chrome.kill();
  }
}

/** Run Lighthouse once against `url` for one form factor. */
export async function runOnce(
  url: string,
  formFactor: FormFactor,
  opts: RunOptions,
): Promise<LH.Result> {
  const flags: LH.Flags = {
    port: opts.port,
    logLevel: "silent",
    output: "json",
    onlyCategories: [...(opts.categories ?? DEFAULT_CATEGORIES)],
  };
  const config = formFactor === "desktop" ? desktopConfig : undefined;
  const result = await lighthouse(url, flags, config);
  if (!result?.lhr) throw new Error(`Lighthouse returned no result for ${url}`);
  return result.lhr;
}

/** Run `runs` times and return the median run (stable across run-to-run noise). */
export async function runMedian(
  url: string,
  formFactor: FormFactor,
  opts: RunOptions & { runs?: number },
): Promise<LH.Result> {
  const runs = opts.runs ?? 3;
  if (!Number.isInteger(runs) || runs < 1)
    throw new Error("Runs must be a positive integer");
  const results: LH.Result[] = [];
  for (let index = 0; index < runs; index++)
    results.push(await runOnce(url, formFactor, opts));
  return runs > 1 ? computeMedianRun(results) : results[0]!;
}

export interface CategoryScores {
  [category: string]: number;
}

export interface AuditGap {
  id: string;
  score: number;
  displayValue?: string;
}

export interface CategoryGaps {
  title: string;
  gaps: AuditGap[];
}

/** Whole-number category scores (0–100) from an LHR. */
export function scores(lhr: LH.Result): CategoryScores {
  return Object.fromEntries(
    Object.entries(lhr.categories).map(([k, c]) => [
      k,
      Math.round((c.score ?? 0) * 100),
    ]),
  );
}

/**
 * Per-category, the non-informative audits scoring below 100%. Categories with
 * no gaps are omitted.
 */
export function gapsByCategory(lhr: LH.Result): CategoryGaps[] {
  const out: CategoryGaps[] = [];
  for (const cat of Object.values(lhr.categories)) {
    const gaps: AuditGap[] = [];
    for (const ref of cat.auditRefs) {
      const a = lhr.audits[ref.id];
      if (
        a &&
        a.score !== null &&
        a.score !== undefined &&
        a.score < 1 &&
        a.scoreDisplayMode !== "informative"
      ) {
        gaps.push({
          id: a.id,
          score: Math.round(a.score * 100),
          displayValue: a.displayValue,
        });
      }
    }
    if (gaps.length) out.push({ title: cat.title, gaps });
  }
  return out;
}
