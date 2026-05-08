"use client"

import { Children, isValidElement, type ReactNode } from "react"
import { Streamdown } from "streamdown"
import { code } from "@streamdown/code"
import { mermaid } from "@streamdown/mermaid"
import { Tweet } from "react-tweet"

type StreamdownWrapperProps = {
  content: string
}

const TWEET_URL = /^https?:\/\/(?:x|twitter)\.com\/[^/]+\/status\/(\d+)/

function extractTweetId(node: ReactNode): string | null {
  if (!isValidElement(node)) return null
  const props = node.props as { href?: string; children?: ReactNode }
  if (typeof props.href !== "string") return null
  const match = props.href.match(TWEET_URL)
  return match ? match[1] : null
}

export function StreamdownWrapper({ content }: StreamdownWrapperProps) {
  return (
    <Streamdown
      mode="static"
      plugins={{ code, mermaid }}
      components={{
        p: ({ children, ...props }) => {
          const kids = Children.toArray(children).filter(
            (child) => !(typeof child === "string" && child.trim() === "")
          )
          if (kids.length === 1) {
            const id = extractTweetId(kids[0])
            if (id) {
              return (
                <div className="not-prose my-6 [&_.react-tweet-theme]:mx-0 [&_.react-tweet-theme]:my-0">
                  <Tweet id={id} />
                </div>
              )
            }
          }
          return <p {...props}>{children}</p>
        },
      }}
    >
      {content}
    </Streamdown>
  )
}
