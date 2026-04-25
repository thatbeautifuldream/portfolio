import { unstable_cache } from "next/cache"
import { getTweet as _getTweet } from "react-tweet/api"
import { EmbeddedTweet, TweetNotFound } from "react-tweet"
import { tweetIds } from "@/lib/tweets-data"
import { createMetadata } from "@/lib/metadata"
import { JsonLd } from "@/components/json-ld"

export const metadata = createMetadata({
  title: "Tweets",
  description: "A collection of thoughts and observations.",
  canonical: "https://milindmishra.com/tweets",
  ogType: "tweets",
})

const tweetsSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Milind Mishra - Tweets",
  description: "A collection of thoughts and observations.",
  url: "https://milindmishra.com/tweets",
  author: {
    "@type": "Person",
    name: "Milind Mishra",
    url: "https://milindmishra.com",
  },
}

const getTweet = unstable_cache(
  async (id: string) => _getTweet(id),
  ["tweet"],
  { revalidate: 3600 * 24 }
)

export default async function TweetsPage() {
  const tweets = await Promise.all(
    tweetIds.map((id) => getTweet(id).catch(() => undefined))
  )

  return (
    <>
      <JsonLd data={tweetsSchema} />

      <main className="isolate">
        <section className="section-shell">
          <div className="section-inner">
            <div
              className="animate-fade-up grid gap-4"
              style={{ animationDelay: "100ms" }}
            >
              <p className="text-sm text-muted-foreground">Tweets</p>
              <h1 className="max-w-[24ch] text-3xl font-semibold tracking-tight text-balance md:text-5xl">
                Thoughts and observations.
              </h1>
            </div>
          </div>
        </section>

        <section className="pb-6 md:pb-8">
          <div
            className="animate-fade-up mx-auto max-w-7xl columns-1 px-4 sm:columns-2 sm:px-6 lg:columns-3 lg:px-8"
            style={{ animationDelay: "150ms" }}
          >
            {tweets.map((tweet, index) => (
              <div key={tweetIds[index]} className="mb-3 break-inside-avoid">
                {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
