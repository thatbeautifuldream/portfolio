import { NextRequest } from "next/server"
import { generateOgImage } from "@/lib/og/response"

export const runtime = "edge"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params

  try {
    return generateOgImage(request, slug)
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Error generating OG image", { status: 500 })
  }
}
