import { BaseTemplate } from "./base"

export function BlogIndexTemplate() {
  return (
    <BaseTemplate>
      <div
        style={{
          fontSize: "88px",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        Blog
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#a3a3a3",
          lineHeight: 1.35,
          width: "850px",
        }}
      >
        Notes on product engineering, AI interfaces, and building tools that
        respect your time.
      </div>
    </BaseTemplate>
  )
}
