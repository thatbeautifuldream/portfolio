export { generateOpenGraphImage } from "./og-canvas/generateOpenGraphImage.js";
import { generateOpenGraphImage } from "./og-canvas/generateOpenGraphImage.js";
export async function OGImageRoute({
  param,
  pages,
  getImageOptions,
}: {
  param: string;
  pages: Record<string, any>;
  getImageOptions: (id: string, page: any) => any;
}) {
  return {
    getStaticPaths: () =>
      Object.entries(pages).map(([id, page]) => ({
        params: { [param]: `${id}.png` },
        props: { id, page },
      })),
    GET: async ({ props }: { props: { id: string; page: any } }) =>
      new Response(
        await generateOpenGraphImage(getImageOptions(props.id, props.page)),
        { headers: { "Content-Type": "image/png" } },
      ),
  };
}
