import type { APIRoute } from "../../../lib/resource";
import { API_VERSION, jsonResponse } from "../../../lib/agent-api";

export const prerender = true;

export const GET: APIRoute = () =>
  jsonResponse({
    status: "ok",
    service: "milindmishra.com",
    version: API_VERSION,
  });
