export const tweetUrls = [
  "https://x.com/milindmishra_/status/2048047595948568873",
]

export function extractTweetId(url: string): string {
  const match = url.match(/\/status\/(\d+)/)
  if (!match) throw new Error(`Invalid tweet URL: ${url}`)
  return match[1]
}

export const tweetIds = tweetUrls.map(extractTweetId)
