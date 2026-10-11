export interface APIContext<Props = any> {
  props: Props;
  params: Record<string, string | undefined>;
  site: URL;
  request: Request;
}
export type APIRoute<Props = any> = (
  context: APIContext<Props>,
) => Response | Promise<Response>;
export type GetStaticPaths = () =>
  | Promise<{ params: Record<string, string>; props?: unknown }[]>
  | { params: Record<string, string>; props?: unknown }[];
export type InferGetStaticPropsType<T extends (...args: any[]) => any> =
  Awaited<ReturnType<T>>[number]["props"];
