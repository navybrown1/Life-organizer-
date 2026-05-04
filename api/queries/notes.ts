import { getDb } from "./connection";
import { notes } from "@db/schema";
import { eq } from "drizzle-orm";

export async function findNotesByUser(userId: number) {
  return getDb().query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: (notes, { desc }) => [desc(notes.pinned), desc(notes.updatedAt)],
  });
}

export async function createNote(data: {
  title: string;
  content?: string;
  tags?: string;
  pinned?: boolean;
  userId: number;
}) {
  const [{ id }] = await getDb().insert(notes).values(data).$returningId();
  return getDb().query.notes.findFirst({ where: eq(notes.id, id) });
}

export async function updateNote(id: number, data: Partial<typeof notes.$inferInsert>) {
  await getDb().update(notes).set(data).where(eq(notes.id, id));
  return getDb().query.notes.findFirst({ where: eq(notes.id, id) });
}

export async function deleteNote(id: number) {
  await getDb().delete(notes).where(eq(notes.id, id));
}
