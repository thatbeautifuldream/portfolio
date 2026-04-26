import { os } from "@orpc/server";
import { z } from "zod";
import {
  guestbookParamsSchema,
  insertGuestbookSchema,
  selectGuestbookSchema,
  updateGuestbookSchema,
} from "../../db/schema";
import {
  createGuestbookEntryInDb,
  deleteGuestbookEntryInDb,
  fetchGuestbookEntries,
  updateGuestbookEntryInDb,
} from "./helpers";
import { ListGuestbookInputSchema } from "./types";

export const listGuestbookEntries = os
  .input(ListGuestbookInputSchema)
  .output(
    z.object({
      data: z.array(selectGuestbookSchema),
      pagination: z.object({
        limit: z.number(),
        offset: z.number(),
        total: z.number(),
      }),
    })
  )
  .handler(async ({ input }) => {
    const entries = await fetchGuestbookEntries(input);

    return {
      data: entries,
      pagination: {
        limit: input.limit,
        offset: input.offset,
        total: entries.length,
      },
    };
  });

export const createGuestbookEntry = os
  .input(insertGuestbookSchema)
  .output(selectGuestbookSchema)
  .handler(async ({ input }) => {
    return await createGuestbookEntryInDb(input);
  });

export const updateGuestbookEntry = os
  .input(
    z.object({
      id: z.uuid(),
      data: updateGuestbookSchema,
    })
  )
  .output(selectGuestbookSchema)
  .handler(async ({ input }) => {
    const { id, data } = input;
    return await updateGuestbookEntryInDb(id, data);
  });

export const deleteGuestbookEntry = os
  .input(guestbookParamsSchema)
  .output(selectGuestbookSchema)
  .handler(async ({ input }) => {
    const { id } = input;
    return await deleteGuestbookEntryInDb(id);
  });