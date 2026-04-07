import { readFile } from "fs/promises"
import { join } from "path"

let interFont: ArrayBuffer | null = null

export async function getInterFont(): Promise<ArrayBuffer> {
  if (interFont) {
    return interFont
  }

  const fontPath = join(process.cwd(), "public", "fonts", "Inter-SemiBold.ttf")
  const fontData = await readFile(fontPath)
  interFont = fontData.buffer.slice(
    fontData.byteOffset,
    fontData.byteOffset + fontData.byteLength
  )

  return interFont
}
