import { z } from "zod";

export const ContributionActivitySchema = z.object({
  date: z.string().describe("ISO date string (YYYY-MM-DD)"),
  count: z
    .number()
    .int()
    .min(0)
    .describe("Number of contributions on this date"),
  level: z
    .number()
    .int()
    .min(0)
    .max(4)
    .describe("Contribution intensity level (0-4)"),
});

export const ContributionsResponseSchema = z.object({
  contributions: z
    .array(ContributionActivitySchema)
    .describe("Array of daily contribution data"),
  total: z
    .number()
    .int()
    .min(0)
    .describe("Total contributions for the specified period"),
  years: z.array(z.string()).describe("Years included in the response"),
});

export const GitHubContributionsInputSchema = z.object({
  username: z.string().min(1).optional().default("thatbeautifuldream"),
  year: z
    .union([
      z
        .string()
        .regex(/^\d{4}$/)
        .describe("Specific year (e.g., '2023')"),
      z.literal("last").describe("GitHub's default view (last year)"),
      z.literal("all").describe("All years"),
    ])
    .optional()
    .default("last"),
  format: z.enum(["flat", "nested"]).optional().default("flat"),
});

export type TContributionActivity = z.infer<typeof ContributionActivitySchema>;
export type TContributionsResponse = z.infer<
  typeof ContributionsResponseSchema
>;
export type TGitHubContributionsInput = z.infer<
  typeof GitHubContributionsInputSchema
>;

export const GitHubContributionsAPIResponseSchema = z.object({
  total: z
    .record(z.string(), z.number())
    .describe("Total contributions by year"),
  contributions: z.array(
    z.object({
      date: z.string(),
      count: z.number().int().min(0),
      level: z.number().int().min(0).max(4),
    })
  ),
});

export type TGitHubContributionsAPIResponse = z.infer<
  typeof GitHubContributionsAPIResponseSchema
>;