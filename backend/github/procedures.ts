import { os } from "@orpc/server";
import { getCachedContributions } from "./helpers";
import {
  ContributionsResponseSchema,
  GitHubContributionsInputSchema,
} from "./types";

export const getContributions = os
  .input(GitHubContributionsInputSchema)
  .output(ContributionsResponseSchema)
  .handler(async ({ input }) => {
    try {
      const contributions = await getCachedContributions(input);
      return contributions;
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      throw new Error("Failed to fetch GitHub contributions");
    }
  });