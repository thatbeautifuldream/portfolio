"use client"

import { env } from "@/lib/env"
import clarity from "@microsoft/clarity"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics as VercelAnalytics } from "@vercel/analytics/react"
import { useEffect } from "react"

function ClarityProvider() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      clarity.init(env.NEXT_PUBLIC_CLARITY_ID)
    }
  }, [])

  return null
}

export function AnalyticsProvider() {
  return (
    <>
      <ClarityProvider />
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_ID} />
      <VercelAnalytics />
    </>
  )
}
