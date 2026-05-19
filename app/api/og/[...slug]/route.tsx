import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  const url = new URL(request.url)
  url.pathname = `/og/${slug.join("/")}`

  return Response.redirect(url, 308)
}
