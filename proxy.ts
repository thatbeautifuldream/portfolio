import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAICrawler, logAICrawlerRequest } from "@/lib/ai-crawler-logger"

export function proxy(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") ?? ""
  const { pathname } = request.nextUrl

  if (isAICrawler(userAgent)) {
    logAICrawlerRequest(pathname, userAgent)
  }

  const acceptHeader = request.headers.get("accept") ?? ""

  if (!acceptHeader.includes("text/markdown")) {
    return NextResponse.next()
  }

  const cleanPath = pathname.replace(/\/$/, "")

  logAICrawlerRequest(cleanPath, userAgent, {
    event: "content_negotiation",
    accept: "text/markdown",
  })

  const mdPath = `${cleanPath}.md`
  const url = request.nextUrl.clone()
  url.pathname = mdPath

  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    "/",
    "/work",
    "/projects",
    "/talks",
    "/blog/:path*",
    "/gist/:path*",
    "/tweets",
    "/contact",
    "/guestbook",
    "/spotify",
    "/wakatime",
    "/llms.txt",
    "/llms-full.txt",
  ],
}
