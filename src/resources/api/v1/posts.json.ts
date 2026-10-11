import type { APIRoute } from "../../../lib/resource";
import { jsonResponse } from "../../../lib/agent-api";
import { buildPostList, getPosts } from "../../../lib/content-api";

export const prerender = true;

export const GET: APIRoute = async ({ site }) =>
  jsonResponse(buildPostList(await getPosts(), site));
