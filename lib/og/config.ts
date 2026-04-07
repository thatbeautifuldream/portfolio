export const ogConfig = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Familjen Grotesk",
      weight: 600,
      style: "normal" as const,
    },
  ],
}

export const colors = {
  background: "#0a0a0a",
  primary: "#fafafa",
  secondary: "#a3a3a3",
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "long" })
  const year = date.getFullYear()

  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return n + (s[(v - 20) % 10] || s[v] || s[0])
  }

  return `${getOrdinal(day)} ${month}, ${year}`
}
