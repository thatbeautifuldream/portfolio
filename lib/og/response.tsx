import { ImageResponse } from "next/og"
import { allPosts } from "content-collections"
import {
  HomeTemplate,
  BlogPostTemplate,
  BlogIndexTemplate,
  ProjectsTemplate,
  WorkTemplate,
  TalksTemplate,
  ContactTemplate,
} from "@/lib/og/templates"

const imageHeaders = {
  "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800",
}

export async function generateOgImage(request: Request, slug: string[]) {
  const [section, ...rest] = slug
  let jsx: React.ReactNode

  switch (section) {
    case "home":
      jsx = <HomeTemplate />
      break

    case "blog": {
      const postSlug = rest.join("/")

      if (postSlug) {
        const post = allPosts.find((p) => p.slug === postSlug)

        if (!post) {
          return new Response("Post not found", { status: 404 })
        }

        jsx = (
          <BlogPostTemplate
            title={post.title}
            description={post.description}
            category={post.category}
            date={post.date}
          />
        )
      } else {
        jsx = <BlogIndexTemplate />
      }

      break
    }

    case "projects":
      jsx = <ProjectsTemplate />
      break

    case "work":
      jsx = <WorkTemplate />
      break

    case "talks":
      jsx = <TalksTemplate />
      break

    case "contact":
      jsx = <ContactTemplate />
      break

    default:
      return new Response("Invalid type", { status: 400 })
  }

  return new ImageResponse(jsx, {
    width: 1200,
    height: 630,
    headers: imageHeaders,
    fonts: [
      {
        name: "Familjen Grotesk",
        data: await fetch(
          new URL("/fonts/FamiljenGrotesk-SemiBold.ttf", request.url)
        ).then((res) => res.arrayBuffer()),
        weight: 600,
        style: "normal",
      },
    ],
  })
}
