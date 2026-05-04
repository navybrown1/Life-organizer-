import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { previewEvents, previewMutationResult } from "./previewData";
import {
  findEventsByUser,
  findEventsByDateRange,
  findUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./queries/events";

export const eventRouter = createRouter({
  list: authedQuery.query(({ ctx }) =>
    ctx.previewMode ? previewEvents : findEventsByUser(ctx.user.id),
  ),
  upcoming: authedQuery.query(({ ctx }) =>
    ctx.previewMode ? previewEvents : findUpcomingEvents(ctx.user.id),
  ),
  byRange: authedQuery
    .input(z.object({ start: z.date(), end: z.date() }))
    .query(({ ctx, input }) =>
      ctx.previewMode
        ? previewEvents
        : findEventsByDateRange(ctx.user.id, input.start, input.end),
    ),
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
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : createEvent({ ...input, userId: ctx.user.id }),
    ),
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
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : updateEvent(input.id, input),
    ),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : deleteEvent(input.id),
    ),
});
