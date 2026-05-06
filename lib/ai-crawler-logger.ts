const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Bytespider",
  "CCBot",
  "Meta-ExternalAgent",
  "Applebot",
  "Applebot-Extended",
  "facebookexternalhit",
  "LinkedInBot",
]

export function isAICrawler(userAgent: string): boolean {
  return AI_CRAWLERS.some((crawler) =>
    userAgent.toLowerCase().includes(crawler.toLowerCase())
  )
}

export function logAICrawlerRequest(
  path: string,
  userAgent: string,
  extra?: Record<string, string>
) {
  const timestamp = new Date().toISOString()
  console.info(
    JSON.stringify({
      type: "ai_crawler",
      path,
      userAgent,
      timestamp,
      ...extra,
    })
  )
}
