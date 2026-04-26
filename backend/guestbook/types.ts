import { z } from "zod";

export const ListGuestbookInputSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const UpdateGuestbookInputSchema = z.object({
  id: z.uuid(),
  data: z.object({}).passthrough(),
});

export const PaginationSchema = z.object({
  limit: z.number(),
  offset: z.number(),
  total: z.number(),
});

export const ListGuestbookOutputSchema = z.object({
  data: z.array(z.object({}).passthrough()),
  pagination: PaginationSchema,
});

export type TListGuestbookInput = z.infer<typeof ListGuestbookInputSchema>;
export type TUpdateGuestbookInput = z.infer<typeof UpdateGuestbookInputSchema>;
export type TPagination = z.infer<typeof PaginationSchema>;