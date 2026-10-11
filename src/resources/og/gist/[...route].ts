import { OGImageRoute } from "../../../lib/og-renderer";
import { getCollection } from "../../../lib/content";
import { ogImageOptions } from "../../../lib/og";
import { getLocalizedCollection } from "../../../i18n/content";

const gists = await getCollection("gists");
const hiGists = await getLocalizedCollection("gists", "hi");

// Map each gist id -> the data the card needs, plus the Hindi cards under `hi/`.
const pages = Object.fromEntries([
  ...gists.map((gist) => [
    gist.id,
    { title: gist.data.title, description: gist.data.description ?? "" },
  ]),
  ...hiGists.map((gist) => [
    `hi/${gist.id}`,
    { title: gist.data.title, description: gist.data.description ?? "" },
  ]),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_id, page: (typeof pages)[string]) => ogImageOptions(page),
});
