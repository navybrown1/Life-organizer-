import { createRouter, authedQuery } from "./middleware";
import { previewEvents, previewGoals, previewHabits, previewTasks } from "./previewData";
import { findTodayTasks, findUpcomingTasks, countTasksByStatus } from "./queries/tasks";
import { findUpcomingEvents } from "./queries/events";
import { findActiveGoals } from "./queries/goals";
import { findHabitsByUser } from "./queries/habits";

function previewStats() {
  const todoCount = previewTasks.filter((task) => task.status === "todo").length;
  const inProgressCount = previewTasks.filter((task) => task.status === "in_progress").length;
  const doneCount = previewTasks.filter((task) => task.status === "done").length;

  return {
    tasks: {
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
      today: previewTasks.length,
    },
    todayTasks: previewTasks,
    upcomingTasks: previewTasks,
    upcomingEvents: previewEvents,
    activeGoals: previewGoals,
    habits: previewHabits,
  };
}

export const dashboardRouter = createRouter({
  stats: authedQuery.query(async ({ ctx }) => {
    if (ctx.previewMode) return previewStats();

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
