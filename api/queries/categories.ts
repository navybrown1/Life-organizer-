import { getDb } from "./connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";
import { env } from "../lib/env";
import { previewCategories, previewMutationResult } from "../previewData";

export async function findCategoriesByUser(userId: number) {
  if (env.previewMode) return previewCategories.filter((category) => category.userId === userId);
  return getDb().query.categories.findMany({
    where: eq(categories.userId, userId),
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
  });
}

export async function createCategory(data: { name: string; color?: string; icon?: string; userId: number }) {
  if (env.previewMode) return { ...previewCategories[0], ...data, id: Date.now() };
  const [{ id }] = await getDb().insert(categories).values(data).$returningId();
  return getDb().query.categories.findFirst({ where: eq(categories.id, id) });
}

export async function deleteCategory(id: number) {
  if (env.previewMode) return previewMutationResult;
  await getDb().delete(categories).where(eq(categories.id, id));
}
