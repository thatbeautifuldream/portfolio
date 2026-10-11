import type { APIRoute } from "../../../lib/resource";
import { generateStoryImage } from "../../../lib/og";
import { absoluteUrl } from "../../../lib/seo";
import { getLocalizedCollection } from "../../../i18n/content";

export async function getStaticPaths() {
  const posts = await getLocalizedCollection("posts", "hi");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props, site }) => {
  const { post } = props;
  const link = absoluteUrl(`/hi/blog/${post.id}`, site).replace(
    /^https?:\/\//,
    "",
  );
  const png = await generateStoryImage({
    title: post.data.title,
    description: post.data.description,
    link,
  });
  return new Response(png, { headers: { "Content-Type": "image/png" } });
};
