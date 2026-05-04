import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import {
  findGoalsByUser,
  findActiveGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "./queries/goals";

export const goalRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findGoalsByUser(ctx.user.id)),
  active: authedQuery.query(({ ctx }) => findActiveGoals(ctx.user.id)),
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        targetDate: z.string().optional(),
        color: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createGoal({
        ...input,
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
        userId: ctx.user.id,
      }),
    ),
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "completed", "archived"]).optional(),
        targetDate: z.string().optional(),
        progress: z.number().min(0).max(100).optional(),
        color: z.string().optional(),
        completedAt: z.date().optional(),
      }),
    )
    .mutation(({ input }) =>
      updateGoal(input.id, {
        ...input,
        targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
      }),
    ),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteGoal(input.id)),
});
