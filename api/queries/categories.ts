import { getDb } from "./connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";

export async function findCategoriesByUser(userId: number) {
  return getDb().query.categories.findMany({
    where: eq(categories.userId, userId),
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
  });
}

export async function createCategory(data: { name: string; color?: string; icon?: string; userId: number }) {
  const [{ id }] = await getDb().insert(categories).values(data).$returningId();
  return getDb().query.categories.findFirst({ where: eq(categories.id, id) });
}

export async function deleteCategory(id: number) {
  await getDb().delete(categories).where(eq(categories.id, id));
}
