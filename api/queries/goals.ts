import { getDb } from "./connection";
import { goals } from "@db/schema";
import { eq, and } from "drizzle-orm";

export async function findGoalsByUser(userId: number) {
  return getDb().query.goals.findMany({
    where: eq(goals.userId, userId),
    orderBy: (goals, { desc }) => [desc(goals.createdAt)],
  });
}

export async function findActiveGoals(userId: number) {
  return getDb().query.goals.findMany({
    where: and(eq(goals.userId, userId), eq(goals.status, "active")),
    orderBy: (goals, { desc }) => [desc(goals.createdAt)],
  });
}

export async function createGoal(data: {
  title: string;
  description?: string;
  targetDate?: Date;
  color?: string;
  userId: number;
}) {
  const [{ id }] = await getDb().insert(goals).values(data).$returningId();
  return getDb().query.goals.findFirst({ where: eq(goals.id, id) });
}

export async function updateGoal(id: number, data: Partial<typeof goals.$inferInsert>) {
  await getDb().update(goals).set(data).where(eq(goals.id, id));
  return getDb().query.goals.findFirst({ where: eq(goals.id, id) });
}

export async function deleteGoal(id: number) {
  await getDb().delete(goals).where(eq(goals.id, id));
}
