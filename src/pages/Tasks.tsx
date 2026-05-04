import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";

const priorityColors = {
  low: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  medium: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  high: "bg-red-100 text-red-700 hover:bg-red-200",
};

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date | null;
  categoryId: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
};

export default function Tasks() {
  const utils = trpc.useUtils();
  const { data: tasks, isLoading } = trpc.task.list.useQuery();
  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      setDialogOpen(false);
      resetForm();
    },
  });
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.list.invalidate();
      setDialogOpen(false);
      setEditingTask(null);
      resetForm();
    },
  });
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => utils.task.list.invalidate(),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo");
  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description ?? "");
    setPriority(task.priority);
    setStatus(task.status);
    setDueDate(task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "");
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    resetForm();
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingTask) {
      updateTask.mutate({
        id: editingTask.id,
        title,
        description: description || undefined,
        priority,
        status,
        dueDate: dueDate || undefined,
        completedAt: status === "done" ? new Date() : undefined,
      });
    } else {
      createTask.mutate({
        title,
        description: description || undefined,
        priority,
        status,
        dueDate: dueDate || undefined,
      });
    }
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTask.mutate({
      id: task.id,
      status: newStatus,
      completedAt: newStatus === "done" ? new Date() : undefined,
    });
  };

  const filteredTasks = (filterStatus: string) =>
    tasks?.filter((t) => (filterStatus === "all" ? true : t.status === filterStatus)) ?? [];

  const renderTaskList = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No tasks found. Add one to get started!
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {taskList.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
              task.status === "done" ? "bg-muted/50" : "hover:bg-muted/50"
            }`}
          >
            <Checkbox
              checked={task.status === "done"}
              onCheckedChange={() => toggleStatus(task)}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-sm text-muted-foreground truncate">{task.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <Badge className={`text-xs ${priorityColors[task.priority]}`}>
                  {task.priority}
                </Badge>
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                )}
                <Badge variant="outline" className="text-xs">
                  {statusLabels[task.status]}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(task)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => deleteTask.mutate({ id: task.id })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your to-dos and priorities</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="done">Done</TabsTrigger>
              </TabsList>
              <TabsContent value="all">{renderTaskList(filteredTasks("all") as Task[])}</TabsContent>
              <TabsContent value="todo">{renderTaskList(filteredTasks("todo") as Task[])}</TabsContent>
              <TabsContent value="in_progress">{renderTaskList(filteredTasks("in_progress") as Task[])}</TabsContent>
              <TabsContent value="done">{renderTaskList(filteredTasks("done") as Task[])}</TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={(v) => setStatus(v as "todo" | "in_progress" | "done")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
