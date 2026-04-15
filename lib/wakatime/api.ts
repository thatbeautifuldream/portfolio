import type {
  TCodingActivityResponse,
  TLanguagesResponse,
  TEditorsResponse,
  TOperatingSystemResponse,
  TCategoriesResponse,
} from "@/lib/wakatime/types"

export async function fetchWakatime<T>(endpoint: string): Promise<T> {
  const res = await fetch(`/api/wakatime/${endpoint}`)
  if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`)
  return res.json()
}

export function useCodingActivity() {
  return fetchWakatime<TCodingActivityResponse>("coding-activity")
}

export function useLanguages() {
  return fetchWakatime<TLanguagesResponse>("languages")
}

export function useEditors() {
  return fetchWakatime<TEditorsResponse>("editors")
}

export function useOperatingSystems() {
  return fetchWakatime<TOperatingSystemResponse>("operating-systems")
}

export function useCategories() {
  return fetchWakatime<TCategoriesResponse>("categories")
}
