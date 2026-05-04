import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  boolean,
  date,
  index,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 50 }).default("#3b82f6"),
  icon: varchar("icon", { length: 50 }).default("folder"),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const tasks = mysqlTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["todo", "in_progress", "done"]).default("todo").notNull(),
    priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
    dueDate: date("dueDate"),
    categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    userIdIdx: index("tasks_userId_idx").on(table.userId),
    statusIdx: index("tasks_status_idx").on(table.status),
    dueDateIdx: index("tasks_dueDate_idx").on(table.dueDate),
  }),
);

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

export const events = mysqlTable(
  "events",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    location: varchar("location", { length: 255 }),
    startTime: timestamp("startTime").notNull(),
    endTime: timestamp("endTime").notNull(),
    allDay: boolean("allDay").default(false),
    color: varchar("color", { length: 50 }).default("#3b82f6"),
    categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("events_userId_idx").on(table.userId),
    startTimeIdx: index("events_startTime_idx").on(table.startTime),
  }),
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const habits = mysqlTable(
  "habits",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly"]).default("daily").notNull(),
    targetCount: int("targetCount").default(1),
    color: varchar("color", { length: 50 }).default("#22c55e"),
    streak: int("streak").default(0),
    bestStreak: int("bestStreak").default(0),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("habits_userId_idx").on(table.userId),
  }),
);

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;

export const habitLogs = mysqlTable(
  "habitLogs",
  {
    id: serial("id").primaryKey(),
    habitId: bigint("habitId", { mode: "number", unsigned: true }).notNull(),
    logDate: date("logDate").notNull(),
    count: int("count").default(1),
    note: text("note"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    habitIdIdx: index("habitLogs_habitId_idx").on(table.habitId),
    logDateIdx: index("habitLogs_logDate_idx").on(table.logDate),
  }),
);

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = typeof habitLogs.$inferInsert;

export const goals = mysqlTable(
  "goals",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["active", "completed", "archived"]).default("active").notNull(),
    targetDate: date("targetDate"),
    progress: int("progress").default(0),
    color: varchar("color", { length: 50 }).default("#f59e0b"),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
  },
  (table) => ({
    userIdIdx: index("goals_userId_idx").on(table.userId),
    statusIdx: index("goals_status_idx").on(table.status),
  }),
);

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

export const notes = mysqlTable(
  "notes",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    tags: text("tags"),
    pinned: boolean("pinned").default(false),
    userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("notes_userId_idx").on(table.userId),
  }),
);

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;
