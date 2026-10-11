import type { APIRoute } from "../../../lib/resource";
import { apiError } from "../../../lib/agent-api";

export const prerender = true;

export const GET: APIRoute = () =>
  apiError(
    "NOT_FOUND",
    "The requested API resource does not exist.",
    "Read /openapi.json for the supported endpoints.",
    404,
  );
