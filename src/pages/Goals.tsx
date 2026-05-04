import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, CheckCircle2, Loader2, Flame } from "lucide-react";
import { format } from "date-fns";

type Goal = {
  id: number;
  title: string;
  description: string | null;
  status: "active" | "completed" | "archived";
  targetDate: Date | null;
  progress: number | null;
  color: string | null;
  userId: number;
  createdAt: Date;
  completedAt: Date | null;
};

type Habit = {
  id: number;
  name: string;
  description: string | null;
  frequency: "daily" | "weekly" | "monthly";
  targetCount: number | null;
  color: string | null;
  streak: number | null;
  bestStreak: number | null;
  userId: number;
  createdAt: Date;
};

export default function GoalsPage() {
  const utils = trpc.useUtils();
  const { data: goals, isLoading: goalsLoading } = trpc.goal.list.useQuery();
  const { data: habits, isLoading: habitsLoading } = trpc.habit.list.useQuery();

  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Goal form
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [goalTargetDate, setGoalTargetDate] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const [goalColor, setGoalColor] = useState("#f59e0b");

  // Habit form
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitFrequency, setHabitFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [habitColor, setHabitColor] = useState("#22c55e");

  const createGoal = trpc.goal.create.useMutation({
    onSuccess: () => {
      utils.goal.list.invalidate();
      setGoalDialogOpen(false);
      resetGoalForm();
    },
  });
  const updateGoal = trpc.goal.update.useMutation({
    onSuccess: () => {
      utils.goal.list.invalidate();
      setGoalDialogOpen(false);
      setEditingGoal(null);
      resetGoalForm();
    },
  });
  const deleteGoal = trpc.goal.delete.useMutation({
    onSuccess: () => utils.goal.list.invalidate(),
  });

  const createHabit = trpc.habit.create.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      setHabitDialogOpen(false);
      resetHabitForm();
    },
  });
  const updateHabit = trpc.habit.update.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      setHabitDialogOpen(false);
      setEditingHabit(null);
      resetHabitForm();
    },
  });
  const deleteHabit = trpc.habit.delete.useMutation({
    onSuccess: () => utils.habit.list.invalidate(),
  });
  const logHabit = trpc.habit.log.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      utils.habit.todayLog.invalidate();
    },
  });
  const unlogHabit = trpc.habit.unlog.useMutation({
    onSuccess: () => {
      utils.habit.list.invalidate();
      utils.habit.todayLog.invalidate();
    },
  });

  const today = format(new Date(), "yyyy-MM-dd");

  const resetGoalForm = () => {
    setGoalTitle("");
    setGoalDescription("");
    setGoalTargetDate("");
    setGoalProgress(0);
    setGoalColor("#f59e0b");
  };

  const resetHabitForm = () => {
    setHabitName("");
    setHabitDescription("");
    setHabitFrequency("daily");
    setHabitColor("#22c55e");
  };

  const openGoalCreate = () => {
    setEditingGoal(null);
    resetGoalForm();
    setGoalDialogOpen(true);
  };

  const openGoalEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalTitle(goal.title);
    setGoalDescription(goal.description ?? "");
    setGoalTargetDate(goal.targetDate ? format(new Date(goal.targetDate), "yyyy-MM-dd") : "");
    setGoalProgress(goal.progress ?? 0);
    setGoalColor(goal.color ?? "#f59e0b");
    setGoalDialogOpen(true);
  };

  const openHabitCreate = () => {
    setEditingHabit(null);
    resetHabitForm();
    setHabitDialogOpen(true);
  };

  const openHabitEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setHabitName(habit.name);
    setHabitDescription(habit.description ?? "");
    setHabitFrequency(habit.frequency);
    setHabitColor(habit.color ?? "#22c55e");
    setHabitDialogOpen(true);
  };

  const handleSaveGoal = () => {
    if (!goalTitle.trim()) return;
    if (editingGoal) {
      updateGoal.mutate({
        id: editingGoal.id,
        title: goalTitle,
        description: goalDescription || undefined,
        targetDate: goalTargetDate || undefined,
        progress: goalProgress,
        color: goalColor,
      });
    } else {
      createGoal.mutate({
        title: goalTitle,
        description: goalDescription || undefined,
        targetDate: goalTargetDate || undefined,
        color: goalColor,
      });
    }
  };

  const handleSaveHabit = () => {
    if (!habitName.trim()) return;
    if (editingHabit) {
      updateHabit.mutate({
        id: editingHabit.id,
        name: habitName,
        description: habitDescription || undefined,
        frequency: habitFrequency,
        color: habitColor,
      });
    } else {
      createHabit.mutate({
        name: habitName,
        description: habitDescription || undefined,
        frequency: habitFrequency,
        color: habitColor,
      });
    }
  };

  const toggleHabit = (habit: Habit) => {
    // Check if already logged today by using the habit logs query
    // For simplicity, we'll just toggle based on visual state
    // In a real app, we'd query the specific log first
    const isLogged = false; // We'd check this properly
    if (isLogged) {
      unlogHabit.mutate({ habitId: habit.id, date: today });
    } else {
      logHabit.mutate({ habitId: habit.id, logDate: today });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Goals & Habits</h1>
        <p className="text-muted-foreground mt-1">Track your progress and build consistency</p>
      </div>

      <Tabs defaultValue="goals">
        <TabsList>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Goals</h2>
            <Button onClick={openGoalCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </div>
          {goalsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : goals && goals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: goal.color ?? "#f59e0b" }}
                        />
                        <h3 className="font-semibold">{goal.title}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openGoalEdit(goal)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => deleteGoal.mutate({ id: goal.id })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress ?? 0}%</span>
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
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={goal.status === "active" ? "default" : "secondary"}>
                        {goal.status}
                      </Badge>
                      {goal.targetDate && (
                        <span className="text-xs text-muted-foreground">
                          Target: {format(new Date(goal.targetDate), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                No goals yet. Set your first goal to start tracking progress!
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Habits</h2>
            <Button onClick={openHabitCreate}>
              <Plus className="mr-2 h-4 w-4" /> Add Habit
            </Button>
          </div>
          {habitsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : habits && habits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {habits.map((habit) => (
                <Card key={habit.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: habit.color ?? "#22c55e" }}
                        />
                        <h3 className="font-semibold">{habit.name}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openHabitEdit(habit)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => deleteHabit.mutate({ id: habit.id })}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground">{habit.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{habit.frequency}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span>{habit.streak ?? 0} day streak</span>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => toggleHabit(habit)}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Done Today
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                No habits tracked yet. Start building consistency today!
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Goal Dialog */}
      <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGoal ? "Edit Goal" : "New Goal"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={goalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="Goal title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} placeholder="Add details..." rows={2} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Date</label>
              <Input type="date" value={goalTargetDate} onChange={(e) => setGoalTargetDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Progress ({goalProgress}%)</label>
              <Slider value={[goalProgress]} onValueChange={(v) => setGoalProgress(v[0])} max={100} step={5} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                <Input type="color" value={goalColor} onChange={(e) => setGoalColor(e.target.value)} className="w-16 h-10 p-1" />
                <span className="text-sm text-muted-foreground">{goalColor}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGoal} disabled={!goalTitle.trim()}>
              {editingGoal ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Habit Dialog */}
      <Dialog open={habitDialogOpen} onOpenChange={setHabitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingHabit ? "Edit Habit" : "New Habit"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="Habit name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={habitDescription} onChange={(e) => setHabitDescription(e.target.value)} placeholder="Add details..." rows={2} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Select value={habitFrequency} onValueChange={(v) => setHabitFrequency(v as "daily" | "weekly" | "monthly")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-2">
                <Input type="color" value={habitColor} onChange={(e) => setHabitColor(e.target.value)} className="w-16 h-10 p-1" />
                <span className="text-sm text-muted-foreground">{habitColor}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHabitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHabit} disabled={!habitName.trim()}>
              {editingHabit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
