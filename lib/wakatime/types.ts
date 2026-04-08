import { z } from "zod"

export const GrandTotalSchema = z.object({
  ai_additions: z.number(),
  ai_deletions: z.number(),
  decimal: z.string(),
  digital: z.string(),
  hours: z.number(),
  human_additions: z.number(),
  human_deletions: z.number(),
  minutes: z.number(),
  text: z.string(),
  total_seconds: z.number(),
})
export type TGrandTotal = z.infer<typeof GrandTotalSchema>

export const RangeSchema = z.object({
  date: z.string(),
  end: z.string(),
  start: z.string(),
  text: z.string(),
  timezone: z.string(),
})
export type TRange = z.infer<typeof RangeSchema>

export const DailyDataSchema = z.object({
  grand_total: GrandTotalSchema,
  range: RangeSchema,
})
export type TDailyData = z.infer<typeof DailyDataSchema>

export const CodingActivityResponseSchema = z.object({
  data: z.array(DailyDataSchema),
})
export type TCodingActivityResponse = z.infer<
  typeof CodingActivityResponseSchema
>

export const LanguageDataSchema = z.object({
  color: z.string(),
  name: z.string(),
  percent: z.number(),
})
export type TLanguageData = z.infer<typeof LanguageDataSchema>

export const LanguagesResponseSchema = z.object({
  data: z.array(LanguageDataSchema),
})
export type TLanguagesResponse = z.infer<typeof LanguagesResponseSchema>

export const EditorDataSchema = z.object({
  color: z.string(),
  name: z.string(),
  percent: z.number(),
})
export type TEditorData = z.infer<typeof EditorDataSchema>

export const EditorsResponseSchema = z.object({
  data: z.array(EditorDataSchema),
})
export type TEditorsResponse = z.infer<typeof EditorsResponseSchema>

export const OperatingSystemDataSchema = z.object({
  name: z.string(),
  percent: z.number(),
  color: z.string(),
})
export type TOperatingSystemData = z.infer<typeof OperatingSystemDataSchema>

export const OperatingSystemResponseSchema = z.object({
  data: z.array(OperatingSystemDataSchema),
})
export type TOperatingSystemResponse = z.infer<
  typeof OperatingSystemResponseSchema
>

export const CategoryDataSchema = z.object({
  name: z.string(),
  percent: z.number(),
  color: z.string(),
})
export type TCategoryData = z.infer<typeof CategoryDataSchema>

export const CategoriesResponseSchema = z.object({
  data: z.array(CategoryDataSchema),
})
export type TCategoriesResponse = z.infer<typeof CategoriesResponseSchema>
