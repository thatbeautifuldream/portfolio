import { BaseTemplate } from "./base"

export function ProjectsTemplate() {
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
        Projects
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#a3a3a3",
          lineHeight: 1.35,
          width: "850px",
        }}
      >
        Products and tools that show what I build when polish actually matters.
      </div>
    </BaseTemplate>
  )
}
