import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

import { createMetadata } from "@/lib/metadata"
import { fetchWakatimeData } from "@/lib/wakatime/fetch"
import { WAKATIME_URLS } from "@/lib/wakatime/constants"
import type {
  TCategoriesResponse,
  TCodingActivityResponse,
  TEditorsResponse,
  TLanguagesResponse,
  TOperatingSystemResponse,
} from "@/lib/wakatime/types"
import { Wakatime } from "@/components/wakatime/wakatime"

export const metadata = createMetadata({
  title: "Wakatime",
  description:
    "Milind's coding activity from Wakatime: languages, editors, and daily coding habits.",
  canonical: "https://milindmishra.com/wakatime",
  ogType: "home",
})

export default async function WakatimePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["wakatime", "coding-activity"],
      queryFn: () =>
        fetchWakatimeData<TCodingActivityResponse>(
          WAKATIME_URLS.CODING_ACTIVITY,
          "coding-activity"
        ),
    }),
    queryClient.prefetchQuery({
      queryKey: ["wakatime", "languages"],
      queryFn: () =>
        fetchWakatimeData<TLanguagesResponse>(
          WAKATIME_URLS.LANGUAGES,
          "languages"
        ),
    }),
    queryClient.prefetchQuery({
      queryKey: ["wakatime", "editors"],
      queryFn: () =>
        fetchWakatimeData<TEditorsResponse>(WAKATIME_URLS.EDITORS, "editors"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["wakatime", "operating-systems"],
      queryFn: () =>
        fetchWakatimeData<TOperatingSystemResponse>(
          WAKATIME_URLS.OPERATING_SYSTEMS,
          "operating-systems"
        ),
    }),
    queryClient.prefetchQuery({
      queryKey: ["wakatime", "categories"],
      queryFn: () =>
        fetchWakatimeData<TCategoriesResponse>(
          WAKATIME_URLS.CATEGORIES,
          "categories"
        ),
    }),
  ])

  return (
    <main className="isolate">
      <section className="section-shell">
        <div className="section-inner grid gap-12">
          <div className="animate-fade-up grid gap-4 delay-100">
            <h1 className="max-w-[28ch] text-3xl font-semibold tracking-tight md:text-5xl">
              Wakatime
            </h1>
            <p className="max-w-[56ch] text-base text-pretty text-muted-foreground md:text-lg">
              Milind&apos;s coding activity from Wakatime.
            </p>
          </div>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Wakatime />
          </HydrationBoundary>
        </div>
      </section>
    </main>
  )
}
