export const tweetUrls = [
  "https://x.com/milindmishra_/status/2048047595948568873",
  "https://x.com/milindmishra_/status/2047718663533584854",
  "https://x.com/milindmishra_/status/2047317807625625624",
  "https://x.com/milindmishra_/status/2047146108061925441",
  "https://x.com/milindmishra_/status/2047126440458801589",
]

export function extractTweetId(url: string): string {
  const match = url.match(/\/status\/(\d+)/)
  if (!match) throw new Error(`Invalid tweet URL: ${url}`)
  return match[1]
}

export const tweetIds = tweetUrls.map(extractTweetId)
