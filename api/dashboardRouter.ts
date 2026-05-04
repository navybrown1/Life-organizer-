import { createRouter, authedQuery } from "./middleware";
import { findTodayTasks, findUpcomingTasks, countTasksByStatus } from "./queries/tasks";
import { findUpcomingEvents } from "./queries/events";
import { findActiveGoals } from "./queries/goals";
import { findHabitsByUser } from "./queries/habits";

export const dashboardRouter = createRouter({
  stats: authedQuery.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const [taskStats, todayTasks, upcomingTasks, upcomingEvents, activeGoals, habits] = await Promise.all([
      countTasksByStatus(userId),
      findTodayTasks(userId),
      findUpcomingTasks(userId, 5),
      findUpcomingEvents(userId, 5),
      findActiveGoals(userId),
      findHabitsByUser(userId),
    ]);

    const todoCount = taskStats.find((s) => s.status === "todo")?.count ?? 0;
    const inProgressCount = taskStats.find((s) => s.status === "in_progress")?.count ?? 0;
    const doneCount = taskStats.find((s) => s.status === "done")?.count ?? 0;

    return {
      tasks: {
        todo: todoCount,
        inProgress: inProgressCount,
        done: doneCount,
        today: todayTasks.length,
      },
      todayTasks,
      upcomingTasks,
      upcomingEvents,
      activeGoals,
      habits,
    };
  }),
});
