import type { CanvasKit, FontMgr } from "canvaskit-wasm/full";
import { Buffer } from "node:buffer";
export declare function getCanvasKit(): Promise<CanvasKit>;
declare class FontManager {
  #private;
  /**
   * Get a font manager instance for the provided fonts.
   *
   * Fonts are backed by an in-memory cache, so fonts are only downloaded once.
   *
   * Tries to avoid repeated instantiation of `CanvasKit.FontMgr` due to a memory leak
   * in their implementation. Will only reinstantiate if it sees a new font in the
   * `fontUrls` array.
   *
   * @param fontUrls Array of URLs to remote font files (TTF recommended).
   * @returns A font manager for all fonts loaded up until now.
   */
  get(fontUrls: string[]): Promise<FontMgr>;
  /** Get a short hash for a given font resource. */
  getHash(url: string): string;
}
export declare const fontManager: FontManager;
interface LoadedImage {
  /** Pixel buffer for the loaded image. */
  buffer: Buffer;
  /** Short hash of the image’s buffer. */
  hash: string;
}
/**
 * Load an image. Backed by an in-memory cache to avoid repeat disk-reads.
 * @param path Path to an image file, e.g. `./src/logo.png`.
 * @returns Buffer containing the image contents.
 */
export declare const loadImage: (path: string) => Promise<LoadedImage>;
export {};
