import { BaseTemplate } from "./base"
import { formatDate } from "../config"

interface BlogPostTemplateProps {
  title: string
  description: string
  category: string
  date: string
}

export function BlogPostTemplate({
  title,
  description,
  category,
  date,
}: BlogPostTemplateProps) {
  return (
    <BaseTemplate category={category}>
      <div
        style={{
          fontSize: "72px",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          width: "900px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "28px",
          color: "#a3a3a3",
          lineHeight: 1.4,
          width: "850px",
        }}
      >
        {description}
      </div>
      <div
        style={{
          fontSize: "20px",
          fontFamily: "monospace",
          color: "#737373",
          marginTop: "16px",
        }}
      >
        {formatDate(date)}
      </div>
    </BaseTemplate>
  )
}
