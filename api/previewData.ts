const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export const previewUser = {
  id: 1,
  unionId: "preview-user",
  name: "Preview User",
  email: "preview@example.com",
  avatar: null,
  role: "admin" as const,
  createdAt: today,
  updatedAt: today,
  lastSignInAt: today,
};

export const previewCategories = [
  {
    id: 1,
    name: "Family",
    color: "#8b5cf6",
    icon: "heart",
    userId: 1,
    createdAt: today,
  },
  {
    id: 2,
    name: "Growth",
    color: "#06b6d4",
    icon: "sparkles",
    userId: 1,
    createdAt: today,
  },
  {
    id: 3,
    name: "Work",
    color: "#f97316",
    icon: "briefcase",
    userId: 1,
    createdAt: today,
  },
];

export const previewTasks = [
  {
    id: 1,
    title: "Review weekly priorities",
    description: "Preview task showing the planner layout.",
    status: "todo" as const,
    priority: "high" as const,
    dueDate: today,
    categoryId: 2,
    userId: 1,
    createdAt: today,
    updatedAt: today,
    completedAt: null,
  },
  {
    id: 2,
    title: "Plan family time",
    description: "Block intentional time for the kids.",
    status: "in_progress" as const,
    priority: "medium" as const,
    dueDate: tomorrow,
    categoryId: 1,
    userId: 1,
    createdAt: today,
    updatedAt: today,
    completedAt: null,
  },
  {
    id: 3,
    title: "Clean up dashboard design",
    description: "Use gradients, better spacing, and sharper cards.",
    status: "done" as const,
    priority: "medium" as const,
    dueDate: today,
    categoryId: 3,
    userId: 1,
    createdAt: today,
    updatedAt: today,
    completedAt: today,
  },
];

export const previewEvents = [
  {
    id: 1,
    title: "Morning reset",
    description: "Start the day with priorities and habit review.",
    location: "Home",
    startTime: today,
    endTime: new Date(today.getTime() + 30 * 60 * 1000),
    allDay: false,
    color: "#06b6d4",
    categoryId: 2,
    userId: 1,
    createdAt: today,
  },
  {
    id: 2,
    title: "Family evening block",
    description: "Protected time for dinner, homework, and bedtime rhythm.",
    location: "Home",
    startTime: tomorrow,
    endTime: new Date(tomorrow.getTime() + 90 * 60 * 1000),
    allDay: false,
    color: "#8b5cf6",
    categoryId: 1,
    userId: 1,
    createdAt: today,
  },
];

export const previewHabits = [
  {
    id: 1,
    name: "Read 20 minutes",
    description: "Daily learning streak preview.",
    frequency: "daily" as const,
    targetCount: 1,
    color: "#22c55e",
    streak: 5,
    bestStreak: 14,
    userId: 1,
    createdAt: today,
  },
  {
    id: 2,
    name: "Workout",
    description: "Move the body before the brain negotiates.",
    frequency: "weekly" as const,
    targetCount: 3,
    color: "#ef4444",
    streak: 2,
    bestStreak: 8,
    userId: 1,
    createdAt: today,
  },
];

export const previewHabitLogs = [
  {
    id: 1,
    habitId: 1,
    logDate: today,
    count: 1,
    note: "Preview completion",
    createdAt: today,
  },
];

export const previewGoals = [
  {
    id: 1,
    title: "Launch Life Organizer preview",
    description: "Get the app visible on Render before wiring persistence.",
    status: "active" as const,
    targetDate: nextWeek,
    progress: 65,
    color: "#f59e0b",
    userId: 1,
    createdAt: today,
    completedAt: null,
  },
];

export const previewNotes = [
  {
    id: 1,
    title: "Preview mode note",
    content:
      "This app is running without a database. Changes are not saved yet, but the interface can be reviewed on Render.",
    tags: "preview,render,no-database",
    pinned: true,
    userId: 1,
    createdAt: today,
    updatedAt: today,
  },
];

export const previewMutationResult = {
  success: true,
  previewOnly: true,
  message: "Preview mode is active. Database writes are disabled.",
};
