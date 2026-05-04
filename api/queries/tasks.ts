import { getDb } from "./connection";
import { tasks } from "@db/schema";
import { eq, and, gte, count, sql } from "drizzle-orm";

export async function findTasksByUser(userId: number) {
  return getDb().query.tasks.findMany({
    where: eq(tasks.userId, userId),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
}

export async function findTasksByStatus(userId: number, status: "todo" | "in_progress" | "done") {
  return getDb().query.tasks.findMany({
    where: and(eq(tasks.userId, userId), eq(tasks.status, status)),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
}

export async function findTodayTasks(userId: number) {
  const today = new Date().toISOString().split("T")[0];
  return getDb().query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.status, "todo"),
      sql`DATE(${tasks.dueDate}) = ${today}`,
    ),
    orderBy: (tasks, { asc }) => [asc(tasks.priority)],
  });
}

export async function findUpcomingTasks(userId: number, limit = 5) {
  const today = new Date();
  return getDb().query.tasks.findMany({
    where: and(
      eq(tasks.userId, userId),
      eq(tasks.status, "todo"),
      gte(tasks.dueDate, today),
    ),
    orderBy: (tasks, { asc }) => [asc(tasks.dueDate)],
    limit,
  });
}

export async function createTask(data: {
  title: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  categoryId?: number;
  userId: number;
}) {
  const [{ id }] = await getDb().insert(tasks).values(data).$returningId();
  return getDb().query.tasks.findFirst({ where: eq(tasks.id, id) });
}

export async function updateTask(id: number, data: Partial<typeof tasks.$inferInsert>) {
  await getDb().update(tasks).set(data).where(eq(tasks.id, id));
  return getDb().query.tasks.findFirst({ where: eq(tasks.id, id) });
}

export async function deleteTask(id: number) {
  await getDb().delete(tasks).where(eq(tasks.id, id));
}

export async function countTasksByStatus(userId: number) {
  const result = await getDb()
    .select({ status: tasks.status, count: count() })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .groupBy(tasks.status);
  return result;
}
