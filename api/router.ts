import { authRouter } from "./auth-router";
import { categoryRouter } from "./categoryRouter";
import { createRouter, publicQuery } from "./middleware";
import { taskRouter } from "./taskRouter";
import { eventRouter } from "./eventRouter";
import { habitRouter } from "./habitRouter";
import { goalRouter } from "./goalRouter";
import { noteRouter } from "./noteRouter";
import { dashboardRouter } from "./dashboardRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  category: categoryRouter,
  task: taskRouter,
  event: eventRouter,
  habit: habitRouter,
  goal: goalRouter,
  note: noteRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
