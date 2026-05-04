import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { previewHabitLogs, previewHabits, previewMutationResult } from "./previewData";
import {
  findHabitsByUser,
  createHabit,
  updateHabit,
  deleteHabit,
  findHabitLogs,
  findHabitLogsForDate,
  logHabit,
  unlogHabit,
} from "./queries/habits";

export const habitRouter = createRouter({
  list: authedQuery.query(({ ctx }) =>
    ctx.previewMode ? previewHabits : findHabitsByUser(ctx.user.id),
  ),
  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
        targetCount: z.number().min(1).optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : createHabit({ ...input, userId: ctx.user.id }),
    ),
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
        targetCount: z.number().optional(),
        color: z.string().optional(),
        streak: z.number().optional(),
        bestStreak: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : updateHabit(input.id, input),
    ),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : deleteHabit(input.id),
    ),
  logs: authedQuery
    .input(z.object({ habitId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.previewMode ? previewHabitLogs : findHabitLogs(input.habitId),
    ),
  log: authedQuery
    .input(
      z.object({
        habitId: z.number(),
        logDate: z.string(),
        count: z.number().optional(),
        note: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.previewMode
        ? previewMutationResult
        : logHabit({ ...input, logDate: new Date(input.logDate) }),
    ),
  unlog: authedQuery
    .input(z.object({ habitId: z.number(), date: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : unlogHabit(input.habitId, new Date(input.date)),
    ),
  todayLog: authedQuery
    .input(z.object({ habitId: z.number(), date: z.string() }))
    .query(({ ctx, input }) =>
      ctx.previewMode
        ? previewHabitLogs.filter((log) => log.habitId === input.habitId)
        : findHabitLogsForDate(input.habitId, new Date(input.date)),
    ),
});
