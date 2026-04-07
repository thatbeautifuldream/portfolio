import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"
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

export const runtime = "edge"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const slug = searchParams.get("slug")

  try {
    let jsx: React.ReactNode

    switch (type) {
      case "home":
        jsx = <HomeTemplate />
        break

      case "blog":
        if (slug) {
          const post = allPosts.find((p) => p.slug === slug)
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
  } catch (error) {
    console.error("Error generating OG image:", error)
    return new Response("Error generating OG image", { status: 500 })
  }
}
