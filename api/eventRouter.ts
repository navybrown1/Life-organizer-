import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findEventsByUser,
  findEventsByDateRange,
  findUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./queries/events";

export const eventRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findEventsByUser(ctx.user.id)),
  upcoming: authedQuery.query(({ ctx }) => findUpcomingEvents(ctx.user.id)),
  byRange: authedQuery
    .input(z.object({ start: z.date(), end: z.date() }))
    .query(({ ctx, input }) => findEventsByDateRange(ctx.user.id, input.start, input.end)),
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        location: z.string().optional(),
        startTime: z.date(),
        endTime: z.date(),
        allDay: z.boolean().optional(),
        color: z.string().optional(),
        categoryId: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) => createEvent({ ...input, userId: ctx.user.id })),
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        location: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
        allDay: z.boolean().optional(),
        color: z.string().optional(),
        categoryId: z.number().optional(),
      }),
    )
    .mutation(({ input }) => updateEvent(input.id, input)),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteEvent(input.id)),
});
