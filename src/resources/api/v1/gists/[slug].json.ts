import type {
  APIRoute,
  GetStaticPaths,
  InferGetStaticPropsType,
} from "../../../../lib/resource";
import { jsonResponse } from "../../../../lib/agent-api";
import { buildGist, getGists } from "../../../../lib/content-api";

export const prerender = true;

export const getStaticPaths = (async () =>
  (await getGists()).map((gist) => ({
    params: { slug: gist.id },
    props: { gist },
  }))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = async ({ props, site }) =>
  jsonResponse(await buildGist(props.gist, site));
