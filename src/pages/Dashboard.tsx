import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, CalendarDays, Target, ArrowRight, Loader2 } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { useNavigate } from "react-router";

const priorityColors = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your life organization</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tasks.today ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.tasks.todo ?? 0} total pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tasks.inProgress ?? 0}</div>
            <p className="text-xs text-muted-foreground">Active tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcomingEvents?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">Next 5 scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeGoals?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <Card className="min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today's Tasks</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.todayTasks && stats.todayTasks.length > 0 ? (
              stats.todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-sm text-muted-foreground truncate">{task.description}</p>
                    )}
                  </div>
                  <Badge className={`ml-2 shrink-0 ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No tasks due today. You're all caught up!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Events</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div
                    className="h-10 w-1 rounded-full shrink-0"
                    style={{ backgroundColor: event.color ?? "#3b82f6" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {isToday(event.startTime)
                        ? "Today"
                        : isTomorrow(event.startTime)
                          ? "Tomorrow"
                          : format(event.startTime, "MMM d")}
                      {" at "}
                      {format(event.startTime, "h:mm a")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events scheduled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Active Goals & Habits */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Active Goals</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/goals")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.activeGoals && stats.activeGoals.length > 0 ? (
              stats.activeGoals.map((goal) => (
                <div key={goal.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{goal.title}</p>
                    <span className="text-sm text-muted-foreground">{goal.progress ?? 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${goal.progress ?? 0}%`,
                        backgroundColor: goal.color ?? "#f59e0b",
                      }}
                    />
                  </div>
                  {goal.targetDate && (
                    <p className="text-xs text-muted-foreground">
                      Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No active goals. Start one today!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="min-h-[300px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Habits</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/goals")}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.habits && stats.habits.length > 0 ? (
              stats.habits.slice(0, 5).map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: habit.color ?? "#22c55e" }}
                    />
                    <span className="font-medium">{habit.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{habit.streak ?? 0} day streak</span>
                    {habit.bestStreak ? (
                      <span className="text-xs">(best: {habit.bestStreak})</span>
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No habits tracked yet. Build consistency!
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
