import { colors } from "../config"

interface BaseTemplateProps {
  children: React.ReactNode
  category?: string
}

export function BaseTemplate({ children, category }: BaseTemplateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: colors.background,
        color: colors.primary,
        padding: "64px 96px",
        fontFamily: "Familjen Grotesk, sans-serif",
        fontFeatureSettings:
          '"cv02" 1, "cv03" 1, "cv04" 1, "cv11" 1, "ss01" 1, "ss03" 1',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "48px",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: colors.secondary,
          }}
        >
          MILINDMISHRA.COM
        </div>
        {category && (
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: colors.secondary,
              textTransform: "uppercase" as const,
              letterSpacing: "0.1em",
            }}
          >
            {category}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          gap: "24px",
        }}
      >
        {children}
      </div>
    </div>
  )
}
