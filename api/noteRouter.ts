import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { previewMutationResult, previewNotes } from "./previewData";
import {
  findNotesByUser,
  createNote,
  updateNote,
  deleteNote,
} from "./queries/notes";

export const noteRouter = createRouter({
  list: authedQuery.query(({ ctx }) =>
    ctx.previewMode ? previewNotes : findNotesByUser(ctx.user.id),
  ),
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().optional(),
        tags: z.string().optional(),
        pinned: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : createNote({ ...input, userId: ctx.user.id }),
    ),
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        tags: z.string().optional(),
        pinned: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : updateNote(input.id, input),
    ),
  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      ctx.previewMode ? previewMutationResult : deleteNote(input.id),
    ),
});
