import { ORPCError, os } from "@orpc/server"
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers"
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { cookies, headers } from "next/headers"
import { env } from "@/lib/env"

export const requiredAuthMiddleware = os
  .$context<{
    session?: {
      headers?: ReadonlyHeaders
      cookies?: ReadonlyRequestCookies
    }
  }>()
  .middleware(async ({ context, next }) => {
    const session = context.session ?? (await getSession())

    if (!session.headers) {
      throw new ORPCError("NO_HEADERS_FOUND")
    }

    if (
      session.headers.get("authorization") !== `Bearer ${env.API_AUTH_TOKEN}`
    ) {
      throw new ORPCError("UNAUTHORIZED")
    }

    return next({
      context: { session },
    })
  })

async function getSession() {
  const headerList = await headers()
  const cookieList = await cookies()

  return { headers: headerList, cookies: cookieList }
}
