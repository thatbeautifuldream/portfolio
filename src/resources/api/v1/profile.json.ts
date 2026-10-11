import type { APIRoute } from "../../../lib/resource";
import { buildProfileResponse, jsonResponse } from "../../../lib/agent-api";

export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  jsonResponse(buildProfileResponse(site));
