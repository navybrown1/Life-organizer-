import { getDb } from "./connection";
import { habits, habitLogs } from "@db/schema";
import { eq, and } from "drizzle-orm";

export async function findHabitsByUser(userId: number) {
  return getDb().query.habits.findMany({
    where: eq(habits.userId, userId),
    orderBy: (habits, { desc }) => [desc(habits.createdAt)],
  });
}

export async function createHabit(data: {
  name: string;
  description?: string;
  frequency?: "daily" | "weekly" | "monthly";
  targetCount?: number;
  color?: string;
  userId: number;
}) {
  const [{ id }] = await getDb().insert(habits).values(data).$returningId();
  return getDb().query.habits.findFirst({ where: eq(habits.id, id) });
}

export async function updateHabit(id: number, data: Partial<typeof habits.$inferInsert>) {
  await getDb().update(habits).set(data).where(eq(habits.id, id));
  return getDb().query.habits.findFirst({ where: eq(habits.id, id) });
}

export async function deleteHabit(id: number) {
  await getDb().delete(habitLogs).where(eq(habitLogs.habitId, id));
  await getDb().delete(habits).where(eq(habits.id, id));
}

export async function findHabitLogs(habitId: number) {
  return getDb().query.habitLogs.findMany({
    where: eq(habitLogs.habitId, habitId),
    orderBy: (habitLogs, { desc }) => [desc(habitLogs.logDate)],
  });
}

export async function findHabitLogsForDate(habitId: number, date: Date) {
  return getDb().query.habitLogs.findFirst({
    where: and(eq(habitLogs.habitId, habitId), eq(habitLogs.logDate, date)),
  });
}

export async function logHabit(data: { habitId: number; logDate: Date; count?: number; note?: string }) {
  const [{ id }] = await getDb().insert(habitLogs).values(data).$returningId();
  return getDb().query.habitLogs.findFirst({ where: eq(habitLogs.id, id) });
}

export async function unlogHabit(habitId: number, date: Date) {
  await getDb()
    .delete(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.logDate, date)));
}
