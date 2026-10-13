import fs from "node:fs/promises";
import satori from "satori";
import { ImageResponse } from "next/og";
import { decodeHTMLStrict } from "entities";

export type OGPage = { title: string; description?: string };
let fonts:
  | Promise<
      { name: string; data: Buffer; weight: 400 | 500; style: "normal" }[]
    >
  | undefined;
function loadFonts() {
  return (fonts ??= Promise.all(
    ["inter", "noto-sans-devanagari"].flatMap((family) =>
      ([400, 500] as const).map(async (weight) => ({
        name: family === "inter" ? "Inter" : "Noto Sans Devanagari",
        data: await fs.readFile(
          `${process.cwd()}/src/assets/fonts/${family}-${weight}.ttf`,
        ),
        weight,
        style: "normal" as const,
      })),
    ),
  ));
}

// Keep the original card's type, palette, text measure and spacing.
export async function createOGImage(page: OGPage) {
  const indic = /\p{Script=Devanagari}/u.test(
    page.title + (page.description ?? ""),
  );
  const indicTitle = /\p{Script=Devanagari}/u.test(page.title);
  const latinTitle = /[\p{Script=Latin}\p{Number}]/u.test(page.title);
  const markup = (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fdfdfc",
        padding: 96,
        paddingTop: indicTitle ? 105 : 98,
        fontFamily: "Inter, Noto Sans Devanagari",
        fontSize: 44,
        lineHeight: "59.4px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 912 }}>
        <div
          style={{
            display: "flex",
            color: "#111111",
            fontWeight: 500,
          }}
        >
          {decodeHTMLStrict(page.title)}
        </div>
        <div
          style={{
            display: "flex",
            color: "#989897",
            fontWeight: 400,
            // HarfBuzz measures Noto-only lines differently from mixed Latin lines.
            marginTop: indicTitle ? (latinTitle ? 38 : 64) : 33,
          }}
        >
          {decodeHTMLStrict(page.description ?? "")}
        </div>
      </div>
    </div>
  );
  const options = { width: 1200, height: 630, fonts: await loadFonts() };
  if (indic) {
    // Next's bundled Satori predates HarfBuzz. Shape Indic glyphs with the
    // current Satori before handing the vector card to native ImageResponse.
    const svg = await satori(markup, options);
    return new ImageResponse(
      <img
        width={1200}
        height={630}
        src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`}
      />,
      options,
    );
  }
  return new ImageResponse(markup, options);
}

export async function createStoryImage(page: OGPage & { link: string }) {
  const card = Buffer.from(await (await createOGImage(page)).arrayBuffer());
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#fdfdfc",
        fontFamily: "Inter",
        flexDirection: "column",
        paddingLeft: 72,
        paddingTop: 669,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 936,
          height: 491,
          borderRadius: 20,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <img
          src={`data:image/png;base64,${card.toString("base64")}`}
          width={936}
          height={491}
          style={{ width: 936, height: 491, flexShrink: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 936,
            height: 491,
            borderRadius: 20,
            border: "2px solid rgba(0,0,0,0.07)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 48,
          width: 936,
          color: "#989897",
          fontSize: 32,
          lineHeight: 1.35,
        }}
      >
        {page.link}
      </div>
    </div>,
    { width: 1080, height: 1920, fonts: await loadFonts() },
  );
}
