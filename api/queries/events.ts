import { getDb } from "./connection";
import { events } from "@db/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export async function findEventsByUser(userId: number) {
  return getDb().query.events.findMany({
    where: eq(events.userId, userId),
    orderBy: (events, { desc }) => [desc(events.startTime)],
  });
}

export async function findEventsByDateRange(userId: number, start: Date, end: Date) {
  return getDb().query.events.findMany({
    where: and(
      eq(events.userId, userId),
      gte(events.startTime, start),
      lte(events.endTime, end),
    ),
    orderBy: (events, { asc }) => [asc(events.startTime)],
  });
}

export async function findUpcomingEvents(userId: number, limit = 5) {
  const now = new Date();
  return getDb().query.events.findMany({
    where: and(
      eq(events.userId, userId),
      gte(events.startTime, now),
    ),
    orderBy: (events, { asc }) => [asc(events.startTime)],
    limit,
  });
}

export async function createEvent(data: {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  allDay?: boolean;
  color?: string;
  categoryId?: number;
  userId: number;
}) {
  const [{ id }] = await getDb().insert(events).values(data).$returningId();
  return getDb().query.events.findFirst({ where: eq(events.id, id) });
}

export async function updateEvent(id: number, data: Partial<typeof events.$inferInsert>) {
  await getDb().update(events).set(data).where(eq(events.id, id));
  return getDb().query.events.findFirst({ where: eq(events.id, id) });
}

export async function deleteEvent(id: number) {
  await getDb().delete(events).where(eq(events.id, id));
}
