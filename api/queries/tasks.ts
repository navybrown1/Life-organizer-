import { getDb } from "./connection";
import { tasks } from "@db/schema";
import { eq, and, gte, count, sql } from "drizzle-orm";
import { env } from "../lib/env";
import { previewMutationResult, previewTasks } from "../previewData";

export async function findTasksByUser(userId: number) {
  if (env.previewMode) return previewTasks.filter((task) => task.userId === userId);
  return getDb().query.tasks.findMany({
    where: eq(tasks.userId, userId),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
}

export async function findTasksByStatus(userId: number, status: "todo" | "in_progress" | "done") {
  if (env.previewMode) return previewTasks.filter((task) => task.userId === userId && task.status === status);
  return getDb().query.tasks.findMany({
    where: and(eq(tasks.userId, userId), eq(tasks.status, status)),
    orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
  });
}

export async function findTodayTasks(userId: number) {
  if (env.previewMode) return previewTasks.filter((task) => task.userId === userId);
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
  if (env.previewMode) return previewTasks.filter((task) => task.userId === userId).slice(0, limit);
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
  if (env.previewMode) return { ...previewTasks[0], ...data, id: Date.now() };
  const [{ id }] = await getDb().insert(tasks).values(data).$returningId();
  return getDb().query.tasks.findFirst({ where: eq(tasks.id, id) });
}

export async function updateTask(id: number, data: Partial<typeof tasks.$inferInsert>) {
  if (env.previewMode) return { ...previewTasks.find((task) => task.id === id), ...data, id };
  await getDb().update(tasks).set(data).where(eq(tasks.id, id));
  return getDb().query.tasks.findFirst({ where: eq(tasks.id, id) });
}

export async function deleteTask(id: number) {
  if (env.previewMode) return previewMutationResult;
  await getDb().delete(tasks).where(eq(tasks.id, id));
}

export async function countTasksByStatus(userId: number) {
  if (env.previewMode) {
    return ["todo", "in_progress", "done"].map((status) => ({
      status: status as "todo" | "in_progress" | "done",
      count: previewTasks.filter((task) => task.userId === userId && task.status === status).length,
    }));
  }
  const result = await getDb()
    .select({ status: tasks.status, count: count() })
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .groupBy(tasks.status);
  return result;
}
