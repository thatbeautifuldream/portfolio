import { WAKATIME_URLS } from "@/lib/wakatime/constants"
import { fetchWakatimeData } from "@/lib/wakatime/fetch"

const endpoints: Record<string, string> = {
  "coding-activity": WAKATIME_URLS.CODING_ACTIVITY,
  languages: WAKATIME_URLS.LANGUAGES,
  editors: WAKATIME_URLS.EDITORS,
  "operating-systems": WAKATIME_URLS.OPERATING_SYSTEMS,
  categories: WAKATIME_URLS.CATEGORIES,
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params
  const url = endpoints[endpoint]

  if (!url) {
    return new Response("Not found", { status: 404 })
  }

  try {
    const data = await fetchWakatimeData(url, endpoint)
    return Response.json(data)
  } catch {
    return new Response("Internal server error", { status: 500 })
  }
}
