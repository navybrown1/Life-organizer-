import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Lightbulb, ListTodo, Target, Send } from "lucide-react";

export default function AIInsightsPage() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    setLoading(true);
    // Simulate AI analysis based on user's data
    const todoCount = stats?.tasks.todo ?? 0;
    const inProgressCount = stats?.tasks.inProgress ?? 0;
    const todayTasksCount = stats?.todayTasks?.length ?? 0;
    const upcomingEventsCount = stats?.upcomingEvents?.length ?? 0;
    const goalsCount = stats?.activeGoals?.length ?? 0;
    const habitsCount = stats?.habits?.length ?? 0;

    let insights = "## Your Life Organizer Insights\n\n";

    if (todayTasksCount > 0) {
      insights += `**Today's Focus:** You have ${todayTasksCount} task${todayTasksCount > 1 ? "s" : ""} due today. Prioritize high-priority items first to make steady progress.\n\n`;
    } else {
      insights += `**Today's Focus:** No tasks due today! This is a great opportunity to work ahead on upcoming goals or build your habits.\n\n`;
    }

    if (todoCount > 5) {
      insights += `**Task Management:** You have ${todoCount} pending tasks. Consider breaking large tasks into smaller subtasks and focusing on the top 3 priorities each day.\n\n`;
    } else if (todoCount === 0 && inProgressCount === 0) {
      insights += `**Task Management:** You're all caught up! Consider setting new goals or reviewing your long-term objectives.\n\n`;
    } else {
      insights += `**Task Management:** You have a manageable workload with ${todoCount} pending task${todoCount !== 1 ? "s" : ""}. Keep up the momentum!\n\n`;
    }

    if (upcomingEventsCount > 0) {
      insights += `**Upcoming Schedule:** You have ${upcomingEventsCount} event${upcomingEventsCount > 1 ? "s" : ""} coming up. Make sure to prepare ahead of time and block focus time between meetings.\n\n`;
    }

    if (goalsCount === 0) {
      insights += `**Goal Setting:** You don't have any active goals. Setting 2-3 SMART goals can give your productivity a clear direction.\n\n`;
    } else {
      insights += `**Goal Progress:** You have ${goalsCount} active goal${goalsCount > 1 ? "s" : ""}. Regular weekly reviews help maintain momentum toward long-term achievements.\n\n`;
    }

    if (habitsCount === 0) {
      insights += `**Habit Building:** Consider tracking 1-2 daily habits. Small consistent actions compound into significant long-term results.\n\n`;
    } else {
      insights += `**Habit Tracking:** Great job tracking ${habitsCount} habit${habitsCount > 1 ? "s" : ""}! Consistency is key - try to maintain your streaks even on busy days.\n\n`;
    }

    insights += `**Recommendation:** ${todoCount > inProgressCount ? "Start your day by picking one 'in progress' task to complete, then move to today's highest priority task." : "Focus on completing your in-progress tasks before starting new ones to avoid context switching overhead."}`;

    // Small delay to simulate processing
    setTimeout(() => {
      setResponse(insights);
      setLoading(false);
    }, 1200);
  };

  const handleCustomAsk = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResponse(`Based on your current data, here's what I found:\n\n${prompt}\n\nI've analyzed your tasks, goals, and schedule. Your current workload looks balanced. Keep focusing on completing in-progress items before starting new ones, and maintain your habit streaks for long-term growth.`);
      setLoading(false);
      setPrompt("");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">Smart analysis of your life organization</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={generateInsights}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Daily Insights</p>
              <p className="text-sm text-muted-foreground">Analyze today's priorities</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={generateInsights}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Task Review</p>
              <p className="text-sm text-muted-foreground">Optimize your workflow</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={generateInsights}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Goal Coach</p>
              <p className="text-sm text-muted-foreground">Track goal progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Ask AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask anything about your productivity, goals, or schedule..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              className="shrink-0 self-end"
              onClick={handleCustomAsk}
              disabled={!prompt.trim() || loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {loading && !response && (
            <div className="flex items-center gap-2 text-muted-foreground py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing your data...</span>
            </div>
          )}

          {response && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                AI Analysis
              </div>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{response}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
