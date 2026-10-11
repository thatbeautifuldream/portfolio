import type {
  APIRoute,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "../../../../lib/resource";
import { jsonResponse } from "../../../../lib/agent-api";
import { buildPost, getPosts } from "../../../../lib/content-api";

export const prerender = true;

export const getStaticPaths = (async () =>
  (await getPosts()).map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props, site }) =>
  jsonResponse(await buildPost(props.post, site));
