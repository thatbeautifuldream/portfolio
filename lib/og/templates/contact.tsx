import { BaseTemplate } from "./base"

export function ContactTemplate() {
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
        Contact
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
          }}
        >
          github.com/thatbeautifuldream
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
          }}
        >
          linkedin.com/in/mishramilind
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "#a3a3a3",
          }}
        >
          x.com/milindmishra_
        </div>
      </div>
    </BaseTemplate>
  )
}
