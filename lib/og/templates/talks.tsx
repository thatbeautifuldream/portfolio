import { BaseTemplate } from "./base"

export function TalksTemplate() {
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
        Talks
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#a3a3a3",
          lineHeight: 1.35,
          width: "850px",
        }}
      >
        Speaking about React, AI, and interface engineering.
      </div>
    </BaseTemplate>
  )
}
