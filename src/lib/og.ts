import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { generateOpenGraphImage } from "./og-renderer";

// Shared Open Graph card style, matching the site.
export function ogImageOptions(page: { title: string; description?: string }) {
  return {
    title: page.title,
    description: page.description ?? "",
    bgGradient: [[253, 253, 252]] as [number, number, number][],
    border: { width: 0 },
    padding: 96,
    font: {
      title: {
        color: [17, 17, 17] as [number, number, number],
        size: 44,
        weight: "Medium" as const,
        lineHeight: 1.35,
        families: ["Inter", "Noto Sans Devanagari"],
      },
      description: {
        color: [152, 152, 151] as [number, number, number],
        size: 44,
        weight: "Normal" as const,
        lineHeight: 1.35,
        families: ["Inter", "Noto Sans Devanagari"],
      },
    },
    // CanvasKit can't read woff2, so OG cards use static TTF instances.
    // Noto Sans Devanagari covers the Hindi pages.
    fonts: [
      "./src/assets/fonts/Inter-400.ttf",
      "./src/assets/fonts/Inter-500.ttf",
      "./src/assets/fonts/NotoSansDevanagari-400.ttf",
      "./src/assets/fonts/NotoSansDevanagari-500.ttf",
    ],
  };
}

const require = createRequire(import.meta.url);
let canvasKit: Promise<any> | undefined;

function getCanvasKit() {
  canvasKit ??= import("canvaskit-wasm/full").then(({ default: init }) =>
    init({
      locateFile: (file: string) =>
        require.resolve(`canvaskit-wasm/bin/full/${file}`),
    }),
  );
  return canvasKit;
}

// 1080x1920 Instagram story: the post's OG card with its link underneath.
export async function generateStoryImage(page: {
  title: string;
  description?: string;
  link: string;
}) {
  const [CanvasKit, og, ...fonts] = await Promise.all([
    getCanvasKit(),
    generateOpenGraphImage(ogImageOptions(page)),
    fs.readFile("./src/assets/fonts/Inter-400.ttf"),
    fs.readFile("./src/assets/fonts/Inter-500.ttf"),
  ]);
  const [width, height] = [1080, 1920];
  const padding = 72;
  const cardWidth = width - padding * 2;
  const cardHeight = Math.round((cardWidth * 630) / 1200);
  const gap = 48;
  const linkSize = 32;
  const top = Math.round((height - (cardHeight + gap + linkSize * 1.35)) / 2);

  const surface = CanvasKit.MakeSurface(width, height);
  const canvas = surface.getCanvas();
  canvas.clear(CanvasKit.Color(253, 253, 252, 1));

  const card = CanvasKit.XYWHRect(padding, top, cardWidth, cardHeight);
  const radius = 20;
  const image = CanvasKit.MakeImageFromEncoded(og);
  canvas.save();
  canvas.clipRRect(
    CanvasKit.RRectXY(card, radius, radius),
    CanvasKit.ClipOp.Intersect,
    true,
  );
  canvas.drawImageRect(
    image,
    CanvasKit.XYWHRect(0, 0, image.width(), image.height()),
    card,
    new CanvasKit.Paint(),
  );
  canvas.restore();

  const outline = new CanvasKit.Paint();
  outline.setStyle(CanvasKit.PaintStyle.Stroke);
  outline.setStrokeWidth(2);
  outline.setColor(CanvasKit.Color(0, 0, 0, 0.07));
  outline.setAntiAlias(true);
  canvas.drawRRect(
    CanvasKit.RRectXY(
      CanvasKit.XYWHRect(padding + 1, top + 1, cardWidth - 2, cardHeight - 2),
      radius - 1,
      radius - 1,
    ),
    outline,
  );

  const builder = CanvasKit.ParagraphBuilder.Make(
    new CanvasKit.ParagraphStyle({
      textStyle: {
        color: CanvasKit.Color(152, 152, 151, 1),
        fontFamilies: ["Inter"],
        fontSize: linkSize,
        heightMultiplier: 1.35,
      },
    }),
    CanvasKit.FontMgr.FromData(...fonts),
  );
  builder.addText(page.link);
  const paragraph = builder.build();
  paragraph.layout(cardWidth);
  canvas.drawParagraph(paragraph, padding, top + cardHeight + gap);

  const png = surface.makeImageSnapshot().encodeToBytes();
  surface.delete();
  return Buffer.from(png);
}
