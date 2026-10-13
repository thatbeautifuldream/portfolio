import type { Result } from "lighthouse";

export function computeMedianRun(results: Result[]): Result {
  if (!results.length) throw new Error("No Lighthouse runs provided");
  const metric = (result: Result, name: string) => {
    const value = result.audits[name]?.numericValue;
    if (value === undefined || !Number.isFinite(value))
      throw new Error(`Missing Lighthouse metric: ${name}`);
    return value;
  };
  const median = (values: number[]) => {
    const sorted = values.toSorted((first, second) => first - second);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[middle]!
      : (sorted[middle - 1]! + sorted[middle]!) / 2;
  };
  const firstPaint = median(
    results.map((result) => metric(result, "first-contentful-paint")),
  );
  const interactive = median(
    results.map((result) => metric(result, "interactive")),
  );
  const distance = (result: Result) =>
    (metric(result, "first-contentful-paint") - firstPaint) ** 2 +
    (metric(result, "interactive") - interactive) ** 2;
  return results.toSorted(
    (first, second) =>
      distance(first) - distance(second) ||
      metric(first, "interactive") - metric(second, "interactive"),
  )[0]!;
}
