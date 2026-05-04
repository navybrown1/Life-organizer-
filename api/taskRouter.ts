import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findTasksByUser,
  findTasksByStatus,
  findTodayTasks,
  findUpcomingTasks,
  createTask,
  updateTask,
  deleteTask,
  countTasksByStatus,
} from "./queries/tasks";

export const taskRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findTasksByUser(ctx.user.id)),
  listByStatus: authedQuery
    .input(z.object({ status: z.enum(["todo", "in_progress", "done"]) }))
    .query(({ ctx, input }) => findTasksByStatus(ctx.user.id, input.status)),
  today: authedQuery.query(({ ctx }) => findTodayTasks(ctx.user.id)),
  upcoming: authedQuery.query(({ ctx }) => findUpcomingTasks(ctx.user.id)),
  stats: authedQuery.query(({ ctx }) => countTasksByStatus(ctx.user.id)),
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["todo", "in_progress", "done"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.string().optional(),
        categoryId: z.number().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createTask({
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        userId: ctx.user.id,
      }),
    ),
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["todo", "in_progress", "done"]).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        dueDate: z.string().optional(),
        categoryId: z.number().optional(),
        completedAt: z.date().optional(),
      }),
    )
    .mutation(({ input }) =>
      updateTask(input.id, {
        ...input,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
      }),
    ),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTask(input.id)),
});
