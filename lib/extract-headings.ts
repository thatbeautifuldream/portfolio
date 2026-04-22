export type Heading = {
  id: string
  text: string
  level: 2 | 3
}

export function extractHeadings(markdown: string): Heading[] {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, "")
  const lines = withoutFences.split("\n")
  const seen = new Map<string, number>()
  const headings: Heading[] = []

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (!match) continue

    const level = match[1].length as 2 | 3
    const text = match[2].replace(/[*_`]/g, "").trim()
    const base = slugify(text)
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count}`

    headings.push({ id, text, level })
  }

  return headings
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}
