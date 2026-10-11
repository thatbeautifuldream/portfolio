import type { APIRoute } from "../../../lib/resource";
import { absoluteUrl, siteConfig } from "../../../lib/seo";
import { API_VERSION, jsonResponse } from "../../../lib/agent-api";

export const prerender = true;

export const GET: APIRoute = ({ site }) =>
  jsonResponse({
    name: siteConfig.name,
    description: "Machine-readable resources for agents and developers.",
    apiVersion: API_VERSION,
    openapi: absoluteUrl("/openapi.json", site),
    endpoints: [
      {
        name: "Profile",
        url: absoluteUrl("/api/v1/profile.json", site),
      },
      {
        name: "Posts",
        url: absoluteUrl("/api/v1/posts.json", site),
      },
      {
        name: "Gists",
        url: absoluteUrl("/api/v1/gists.json", site),
      },
      {
        name: "Health",
        url: absoluteUrl("/api/v1/health.json", site),
      },
    ],
    errors: {
      schema: absoluteUrl("/openapi.json#/components/schemas/Error", site),
      example: absoluteUrl("/api/v1/error.json", site),
    },
  });
