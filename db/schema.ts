import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod"
import { z } from "zod"

export const guestbook = pgTable("guestbook", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const selectGuestbookSchema = createSelectSchema(guestbook)
export const insertGuestbookSchema = createInsertSchema(guestbook)
export const updateGuestbookSchema = createUpdateSchema(guestbook)
export const guestbookParamsSchema = z.object({
  id: z.uuid(),
})

export type TGuestbook = z.infer<typeof selectGuestbookSchema>
export type TInsertGuestbook = z.infer<typeof insertGuestbookSchema>
export type TUpdateGuestbook = z.infer<typeof updateGuestbookSchema>
export type TGuestbookParams = z.infer<typeof guestbookParamsSchema>
