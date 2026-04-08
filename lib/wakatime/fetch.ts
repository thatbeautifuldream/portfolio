export async function fetchWakatimeData<T>(
  url: string,
  errorContext: string
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Wakatime ${errorContext} API error: ${response.status} - ${errorText}`
      )
    }

    return await response.json()
  } catch {
    throw new Error(`Failed to fetch Wakatime ${errorContext} data`)
  }
}
