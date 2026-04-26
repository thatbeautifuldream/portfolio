import type {
  TContributionsResponse,
  TGitHubContributionsAPIResponse,
  TGitHubContributionsInput,
} from "./types";

export const GITHUB_CONTRIBUTIONS_REVALIDATE_SECONDS = 60 * 60 * 24;

export async function getCachedContributions(
  params: TGitHubContributionsInput
): Promise<TContributionsResponse> {
  const {
    username = "thatbeautifuldream",
    year = "last",
    format = "flat",
  } = params;

  const url = new URL(
    `/v4/${username}`,
    "https://github-contributions-api.jogruber.de"
  );

  if (year !== "all") {
    url.searchParams.set("y", year);
  }

  if (format === "nested") {
    url.searchParams.set("format", "nested");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent": "GitHub-Contributions-API-Client",
    },
    next: {
      revalidate: GITHUB_CONTRIBUTIONS_REVALIDATE_SECONDS,
      tags: [
        "github-contributions",
        `github-contributions:${username}:${year}:${format}`,
      ],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch contributions: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as TGitHubContributionsAPIResponse;

  const years = Object.keys(data.total);
  const totalContributions = Object.values(data.total).reduce(
    (sum, count) => sum + count,
    0
  );

  return {
    contributions: data.contributions,
    total: totalContributions,
    years: years.sort(),
  };
}