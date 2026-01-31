import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Credentials table for storing encrypted GitHub PAT and LLM API keys per user.
 * All sensitive values are encrypted before storage.
 */
export const credentials = mysqlTable("credentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Encrypted GitHub Personal Access Token */
  githubPat: text("githubPat"),
  /** Encrypted LLM API Key (e.g., OpenAI key) */
  llmApiKey: text("llmApiKey"),
  /** LLM model name (e.g., gpt-4o, claude-3-opus) */
  llmModel: varchar("llmModel", { length: 128 }).default("gpt-4o"),
  /** LLM API base URL */
  llmBaseUrl: varchar("llmBaseUrl", { length: 512 }).default("https://api.openai.com/v1"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Credentials = typeof credentials.$inferSelect;
export type InsertCredentials = typeof credentials.$inferInsert;

/**
 * Repository metadata cache for quick access without hitting GitHub API every time.
 */
export const repositoryCache = mysqlTable("repositoryCache", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Full repository name (owner/repo) */
  repoName: varchar("repoName", { length: 256 }).notNull(),
  /** Repository description */
  description: text("description"),
  /** Default branch name */
  defaultBranch: varchar("defaultBranch", { length: 128 }).default("main"),
  /** Repository URL */
  url: varchar("url", { length: 512 }),
  /** Last time this cache was updated */
  lastSyncedAt: timestamp("lastSyncedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RepositoryCache = typeof repositoryCache.$inferSelect;
export type InsertRepositoryCache = typeof repositoryCache.$inferInsert;