import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CalendarDays, CheckSquare, Clock, Target, ArrowRight, Loader2, Sparkles, Zap, type LucideIcon } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";

const priorityColors = {
  low: "border-blue-200 bg-blue-50/80 text-blue-700",
  medium: "border-amber-200 bg-amber-50/80 text-amber-700",
  high: "border-red-200 bg-red-50/80 text-red-700",
};

const statCards = [
  { key: "today", label: "Today's Tasks", icon: CheckSquare, caption: "total pending", gradient: "from-violet-500 to-indigo-500" },
  { key: "progress", label: "In Progress", icon: Clock, caption: "active tasks", gradient: "from-cyan-500 to-blue-500" },
  { key: "events", label: "Upcoming Events", icon: CalendarDays, caption: "next scheduled", gradient: "from-fuchsia-500 to-pink-500" },
  { key: "goals", label: "Active Goals", icon: Target, caption: "in progress", gradient: "from-amber-500 to-orange-500" },
] as const;

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="glass-card flex items-center gap-3 rounded-2xl px-6 py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="font-semibold text-muted-foreground">Loading your command center...</span>
        </div>
      </div>
    );
  }

  const statValues = {
    today: stats?.tasks.today ?? 0,
    progress: stats?.tasks.inProgress ?? 0,
    events: stats?.upcomingEvents?.length ?? 0,
    goals: stats?.activeGoals?.length ?? 0,
  };

  return (
    <div className="space-y-8 fade-in-up">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/50 p-6 shadow-soft mesh-bg text-white sm:p-8">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl float" />
        <div className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl float" style={{ animationDelay: "1.3s" }} />
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              Life Organizer Preview
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Welcome back.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Your tasks, habits, calendar, goals, and notes are arranged into one clean command center so you can move with purpose.
            </p>
          </div>
          <Button variant="gradient" size="lg" className="pulse-glow" onClick={() => navigate("/tasks")}>
            Plan the next move
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = statValues[card.key];
          const caption = card.key === "today" ? `${stats?.tasks.todo ?? 0} ${card.caption}` : card.caption;
          return (
            <Card key={card.key} className="hover-lift overflow-hidden border-white/70 bg-white/80">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground">{card.label}</CardTitle>
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black tracking-tight text-gradient">{value}</div>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{caption}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PremiumPanel title="Today's Tasks" action="View All" icon={Zap} onAction={() => navigate("/tasks")}>
          {stats?.todayTasks && stats.todayTasks.length > 0 ? (
            stats.todayTasks.map((task) => (
              <div key={task.id} className="group flex items-center justify-between rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold tracking-tight">{task.title}</p>
                  {task.description && <p className="truncate text-sm text-muted-foreground">{task.description}</p>}
                </div>
                <Badge className={`ml-3 shrink-0 rounded-full border px-3 py-1 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
              </div>
            ))
          ) : (
            <EmptyState icon={CheckSquare} title="Clear runway" text="No tasks due today. That is tactical breathing room." />
          )}
        </PremiumPanel>

        <PremiumPanel title="Upcoming Events" action="View All" icon={CalendarDays} onAction={() => navigate("/calendar")}>
          {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
            stats.upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
                <div className="h-14 w-2 rounded-full shadow-sm" style={{ backgroundColor: event.color ?? "#7c3aed" }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold tracking-tight">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {isToday(event.startTime) ? "Today" : isTomorrow(event.startTime) ? "Tomorrow" : format(event.startTime, "MMM d")}{" at "}{format(event.startTime, "h:mm a")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={CalendarDays} title="Open calendar" text="No upcoming events yet. Your future self has room to breathe." />
          )}
        </PremiumPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PremiumPanel title="Active Goals" action="View All" icon={Target} onAction={() => navigate("/goals")}>
          {stats?.activeGoals && stats.activeGoals.length > 0 ? (
            stats.activeGoals.map((goal) => (
              <div key={goal.id} className="rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold tracking-tight">{goal.title}</p>
                  <span className="text-sm font-black text-gradient">{goal.progress ?? 0}%</span>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${goal.progress ?? 0}%` }} />
                </div>
                {goal.targetDate && <p className="mt-2 text-xs font-medium text-muted-foreground">Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}</p>}
              </div>
            ))
          ) : (
            <EmptyState icon={Target} title="No active goals" text="Start one meaningful target and make the dashboard earn its rent." />
          )}
        </PremiumPanel>

        <PremiumPanel title="Habits" action="View All" icon={Award} onAction={() => navigate("/goals")}>
          {stats?.habits && stats.habits.length > 0 ? (
            stats.habits.slice(0, 5).map((habit) => (
              <div key={habit.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: habit.color ?? "#22c55e" }} />
                  <span className="font-bold tracking-tight">{habit.name}</span>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p className="font-bold text-foreground">{habit.streak ?? 0} day streak</p>
                  {habit.bestStreak ? <p className="text-xs">best: {habit.bestStreak}</p> : null}
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon={Award} title="No habits yet" text="Pick one tiny repeatable win. Boring consistency beats dramatic chaos." />
          )}
        </PremiumPanel>
      </div>
    </div>
  );
}

function PremiumPanel({ title, action, icon: Icon, onAction, children }: { title: string; action: string; icon: LucideIcon; onAction: () => void; children: ReactNode }) {
  return (
    <Card className="hover-lift min-h-[320px] border-white/70 bg-white/80">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/25">
            <Icon className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onAction} className="group">
          {action} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-primary/25 bg-primary/5 px-6 py-10 text-center">
      <div className="gradient-primary mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-glow">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-black tracking-tight">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}
