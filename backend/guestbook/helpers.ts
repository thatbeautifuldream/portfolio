import { desc, eq } from "drizzle-orm";
import { db } from "../../db/drizzle";
import {
  guestbook,
  type TInsertGuestbook,
  type TUpdateGuestbook,
} from "../../db/schema";
import type { TListGuestbookInput } from "./types";

export async function fetchGuestbookEntries(input: TListGuestbookInput) {
  const { limit, offset } = input;

  const entries = await db
    .select()
    .from(guestbook)
    .orderBy(desc(guestbook.createdAt))
    .limit(limit)
    .offset(offset);

  return entries;
}

export async function getTotalGuestbookCount(): Promise<number> {
  const result = await db
    .select({ count: db.$count(guestbook) })
    .from(guestbook);

  return result[0]?.count ?? 0;
}

export async function createGuestbookEntryInDb(input: TInsertGuestbook) {
  const [newEntry] = await db.insert(guestbook).values(input).returning();
  return newEntry;
}

export async function updateGuestbookEntryInDb(
  id: string,
  data: TUpdateGuestbook
) {
  const [updatedEntry] = await db
    .update(guestbook)
    .set(data)
    .where(eq(guestbook.id, id))
    .returning();

  if (!updatedEntry) {
    throw new Error("Guestbook entry not found");
  }

  return updatedEntry;
}

export async function deleteGuestbookEntryInDb(id: string) {
  const [deletedEntry] = await db
    .delete(guestbook)
    .where(eq(guestbook.id, id))
    .returning();

  if (!deletedEntry) {
    throw new Error("Guestbook entry not found");
  }

  return deletedEntry;
}