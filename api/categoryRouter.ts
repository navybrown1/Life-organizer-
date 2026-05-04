import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { findCategoriesByUser, createCategory, deleteCategory } from "./queries/categories";

export const categoryRouter = createRouter({
  list: authedQuery.query(({ ctx }) => findCategoriesByUser(ctx.user.id)),
  create: authedQuery
    .input(z.object({ name: z.string().min(1), color: z.string().optional(), icon: z.string().optional() }))
    .mutation(({ ctx, input }) => createCategory({ ...input, userId: ctx.user.id })),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCategory(input.id)),
});
