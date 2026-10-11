import { OGImageRoute } from "../../lib/og-renderer";
import { getCollection } from "../../lib/content";
import { ogImageOptions } from "../../lib/og";
import { useTranslations } from "../../i18n";
import { getLocalizedCollection } from "../../i18n/content";

const posts = await getCollection("posts");
const projects = await getCollection("projects");
const hiPosts = await getLocalizedCollection("posts", "hi");
const hiProjects = await getLocalizedCollection("projects", "hi");
const hi = useTranslations("hi");

// Map each blog post id and `project/<id>` -> the data the card needs, plus
// the Hindi cards under `hi/`.
const pages = Object.fromEntries([
  ...posts.map((post) => [
    post.id,
    { title: post.data.title, description: post.data.description },
  ]),
  ...projects.map((project) => [
    `project/${project.id}`,
    { title: project.data.title, description: project.data.description },
  ]),
  ["hi", { title: hi.name, description: hi.tagline }],
  ...hiPosts.map((post) => [
    `hi/${post.id}`,
    { title: post.data.title, description: post.data.description },
  ]),
  ...hiProjects.map((project) => [
    `hi/project/${project.id}`,
    { title: project.data.title, description: project.data.description },
  ]),
]);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_id, page: (typeof pages)[string]) => ogImageOptions(page),
});
