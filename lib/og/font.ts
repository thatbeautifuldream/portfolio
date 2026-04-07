import { readFile } from "fs/promises"
import { join } from "path"

let familjenGroteskFont: ArrayBuffer | null = null

export async function getFamiljenGroteskFont(): Promise<ArrayBuffer> {
  if (familjenGroteskFont) {
    return familjenGroteskFont
  }

  const fontPath = join(
    process.cwd(),
    "public",
    "fonts",
    "FamiljenGrotesk-SemiBold.ttf"
  )
  const fontData = await readFile(fontPath)
  familjenGroteskFont = fontData.buffer.slice(
    fontData.byteOffset,
    fontData.byteOffset + fontData.byteLength
  )

  return familjenGroteskFont
}
