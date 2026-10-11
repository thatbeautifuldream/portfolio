import type { APIRoute } from "../lib/resource";
import { API_VERSION } from "../lib/agent-api";
import { contentJsonSchemas } from "../lib/content-api";
import { getSiteOrigin, siteConfig } from "../lib/seo";

export const prerender = true;

const errorSchema = {
  type: "object",
  additionalProperties: false,
  required: ["error"],
  properties: {
    error: {
      type: "object",
      additionalProperties: false,
      required: ["code", "message", "hint"],
      properties: {
        code: { type: "string", description: "Stable machine-readable code." },
        message: { type: "string", description: "Human-readable explanation." },
        hint: { type: "string", description: "Action an agent can take next." },
      },
    },
  },
} as const;

const errorRef = { $ref: "#/components/schemas/Error" };

const response = (description: string, schema: object, status = "200") => ({
  [status]: {
    description,
    headers: {
      "RateLimit-Limit": {
        description: "Maximum requests in the current one-minute window.",
        schema: { type: "integer", minimum: 1 },
      },
      "RateLimit-Remaining": {
        description: "Advisory requests remaining in the current window.",
        schema: { type: "integer", minimum: 0 },
      },
      "RateLimit-Reset": {
        description: "Seconds until the current window resets.",
        schema: { type: "integer", minimum: 0 },
      },
      ...(status === "429"
        ? {
            "Retry-After": {
              description: "Seconds to wait before retrying.",
              schema: { type: "integer", minimum: 1 },
            },
          }
        : {}),
    },
    content: {
      "application/json": { schema },
    },
  },
});

const schemaRef = (name: string) => ({
  $ref: `#/components/schemas/${name}`,
});

const standardResponses = (description: string, schemaName: string) => ({
  ...response(description, schemaRef(schemaName)),
  ...response("The requested resource does not exist.", errorRef, "404"),
  ...response("Rate limit exceeded.", errorRef, "429"),
  ...response("Unexpected API error.", errorRef, "500"),
});

const operation = (
  operationId: string,
  summary: string,
  description: string,
  schemaName: string,
  parameters?: object[],
) => ({
  get: {
    operationId,
    summary,
    description,
    ...(parameters ? { parameters } : {}),
    responses: standardResponses(summary, schemaName),
  },
});

const slugParameter = (description: string) => ({
  name: "slug",
  in: "path",
  required: true,
  description,
  schema: { type: "string", pattern: "^[a-z0-9-]+$" },
});

const profileSchema = {
  type: "object",
  required: [
    "type",
    "name",
    "description",
    "url",
    "jobTitle",
    "worksFor",
    "location",
    "knowsAbout",
    "sameAs",
    "contact",
    "resources",
    "apiVersion",
  ],
  properties: {
    type: { type: "string", example: "Person" },
    name: { type: "string", example: siteConfig.name },
    alternateName: { type: "string", example: siteConfig.shortName },
    description: { type: "string" },
    url: { type: "string", format: "uri" },
    jobTitle: { type: "string" },
    worksFor: {
      type: "object",
      required: ["name", "url"],
      properties: {
        name: { type: "string" },
        url: { type: "string", format: "uri" },
      },
    },
    location: {
      type: "object",
      required: ["city", "region", "country", "countryCode", "timezone"],
      properties: {
        city: { type: "string" },
        region: { type: "string" },
        country: { type: "string" },
        countryCode: { type: "string" },
        timezone: { type: "string" },
        timezoneLabel: { type: "string" },
      },
    },
    knowsAbout: { type: "array", items: { type: "string" } },
    sameAs: { type: "array", items: { type: "string", format: "uri" } },
    contact: {
      type: "object",
      required: ["email", "contactType"],
      properties: {
        email: { type: "string", format: "email" },
        contactType: { type: "string" },
      },
    },
    resources: {
      type: "object",
      required: ["llms", "fullContext", "openapi", "docs"],
      properties: {
        llms: { type: "string", format: "uri" },
        fullContext: { type: "string", format: "uri" },
        openapi: { type: "string", format: "uri" },
        docs: { type: "string", format: "uri" },
      },
    },
    apiVersion: { type: "string", example: API_VERSION },
  },
} as const;

const indexSchema = {
  type: "object",
  required: [
    "name",
    "description",
    "apiVersion",
    "openapi",
    "endpoints",
    "errors",
  ],
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    apiVersion: { type: "string" },
    openapi: { type: "string", format: "uri" },
    endpoints: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "url"],
        properties: {
          name: { type: "string" },
          url: { type: "string", format: "uri" },
        },
      },
    },
    errors: {
      type: "object",
      required: ["schema", "example"],
      properties: {
        schema: { type: "string", format: "uri-reference" },
        example: { type: "string", format: "uri" },
      },
    },
  },
} as const;

const healthSchema = {
  type: "object",
  required: ["status", "service", "version"],
  properties: {
    status: { type: "string", enum: ["ok"] },
    service: { type: "string" },
    version: { type: "string" },
  },
} as const;

export const GET: APIRoute = ({ site }) => {
  const origin = getSiteOrigin(site);
  const docs = (path: string) => `${origin}${path}`;

  return new Response(
    JSON.stringify({
      openapi: "3.1.0",
      info: {
        title: `${siteConfig.name} Agent API`,
        version: API_VERSION,
        description:
          "Read-only, machine-readable profile, blog post, gist, and availability endpoints for agents and developers.",
        contact: { name: siteConfig.name, email: siteConfig.email },
      },
      servers: [{ url: origin }],
      externalDocs: {
        description: "Interactive Scalar API reference",
        url: docs("/docs"),
      },
      "x-api-versioning": {
        strategy: "URL path",
        current: API_VERSION,
        canonicalPrefix: "/api/v1/",
      },
      paths: {
        "/api/v1/index.json": operation(
          "getApiIndexV1",
          "Discover the public API",
          "Returns versioned endpoint URLs and the documented error response shape.",
          "ApiIndex",
        ),
        "/api/v1/profile.json": operation(
          "getProfileV1",
          "Get Milind Mishra's professional profile",
          "Returns identity, role, expertise, contact, and canonical resource links.",
          "Profile",
        ),
        "/api/v1/health.json": operation(
          "getHealthV1",
          "Check API availability",
          "Returns a small status payload when the API is available.",
          "Health",
        ),
        "/api/v1/posts.json": operation(
          "listPostsV1",
          "List blog posts",
          "Returns every blog post, newest first, without content.",
          "PostList",
        ),
        "/api/v1/posts/{slug}.json": operation(
          "getPostV1",
          "Get a blog post",
          "Returns one blog post with its content as rendered HTML and source Markdown.",
          "Post",
          [slugParameter("Post slug from `listPostsV1`.")],
        ),
        "/api/v1/gists.json": operation(
          "listGistsV1",
          "List public gists",
          "Returns every public gist, newest first, without content.",
          "GistList",
        ),
        "/api/v1/gists/{slug}.json": operation(
          "getGistV1",
          "Get a gist",
          "Returns one public gist with its content as rendered HTML and source Markdown.",
          "Gist",
          [slugParameter("Gist slug from `listGistsV1`.")],
        ),
        "/api/v1/error.json": {
          get: {
            operationId: "getApiErrorExampleV1",
            summary: "Read the not-found error contract",
            description:
              "Returns the JSON shape clients should expect for unsupported API resources.",
            responses: {
              ...response("Not-found error example", errorRef, "404"),
              ...response("Rate limit exceeded.", errorRef, "429"),
            },
          },
        },
      },
      components: {
        schemas: {
          Error: errorSchema,
          Profile: profileSchema,
          ApiIndex: indexSchema,
          Health: healthSchema,
          ...contentJsonSchemas(),
        },
      },
    }),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
};
