import { BaseTemplate } from "./base"

export function WorkTemplate() {
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
        Work
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#a3a3a3",
          lineHeight: 1.35,
          width: "850px",
        }}
      >
        Product engineering across AI products and thoughtful systems.
      </div>
    </BaseTemplate>
  )
}
