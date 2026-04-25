import { Octokit, type RestEndpointMethodTypes } from "@octokit/rest";

export type GistListResponse =
  RestEndpointMethodTypes["gists"]["listForUser"]["response"]["data"];
export type GistResponse =
  RestEndpointMethodTypes["gists"]["get"]["response"]["data"];
export type RepositoryContentResponse =
  RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];

const octokit = new Octokit();

const DEFAULT_PER_PAGE = 100;

export async function getGists(
  username: string
): Promise<GistListResponse> {
  try {
    const response = await octokit.rest.gists.listForUser({
      username,
      per_page: DEFAULT_PER_PAGE,
    });

    const publicGists = response.data.filter((gist) => gist.public === true);

    return publicGists;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch gists: ${errorMessage}`);
  }
}

export async function fetchGistContent(
  gistId: string
): Promise<GistResponse | null> {
  try {
    const response = await octokit.rest.gists.get({
      gist_id: gistId,
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch gist content: ${errorMessage}`);
  }
}

export async function getRepositoryContents(
  owner: string,
  repo: string,
  path = ""
): Promise<RepositoryContentResponse> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch repository contents: ${errorMessage}`);
  }
}

export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      mediaType: {
        format: "raw",
      },
    });

    return response.data as unknown as string;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Failed to fetch file content: ${errorMessage}`);
  }
}

export const githubService = {
  getGists,
  fetchGistContent,
  getRepositoryContents,
  getFileContent,
} as const;

export default githubService;