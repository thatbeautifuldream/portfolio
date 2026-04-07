import { BaseTemplate } from "./base"

export function HomeTemplate() {
  return (
    <BaseTemplate>
      <div
        style={{
          fontSize: "96px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          width: "800px",
        }}
      >
        Milind Mishra
      </div>
      <div
        style={{
          fontSize: "32px",
          color: "#a3a3a3",
          lineHeight: 1.3,
          width: "850px",
        }}
      >
        Product engineer building AI-native interfaces and tools people return
        to.
      </div>
    </BaseTemplate>
  )
}
