"use server"

import { cookies } from "next/headers"

export async function markIntroPlayed() {
  const cookieStore = await cookies()
  cookieStore.set("intro-played", "1", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
