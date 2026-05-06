import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") ?? ""

  if (!acceptHeader.includes("text/markdown")) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl
  const cleanPath = pathname.replace(/\/$/, "")

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
