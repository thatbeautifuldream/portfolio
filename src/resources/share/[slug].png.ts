import type { APIRoute } from "../../lib/resource";
import { getCollection } from "../../lib/content";
import { generateStoryImage } from "../../lib/og";
import { absoluteUrl } from "../../lib/seo";

export async function getStaticPaths() {
  const posts = await getCollection("posts");
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

export const GET: APIRoute = async ({ props, site }) => {
  const { post } = props;
  const link = absoluteUrl(`/blog/${post.id}`, site).replace(
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
