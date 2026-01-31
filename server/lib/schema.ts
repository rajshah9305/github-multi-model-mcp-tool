import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey({ autoIncrement: true }),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Credentials table for storing encrypted GitHub PAT and LLM API keys per user.
 * All sensitive values are encrypted before storage.
 */
export const credentials = sqliteTable("credentials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Encrypted GitHub Personal Access Token */
  githubPat: text("githubPat"),
  /** Encrypted LLM API Key (e.g., OpenAI key) */
  llmApiKey: text("llmApiKey"),
  /** LLM model name (e.g., gpt-4o, claude-3-opus) */
  llmModel: text("llmModel").default("gpt-4o"),
  /** LLM API base URL */
  llmBaseUrl: text("llmBaseUrl").default("https://api.openai.com/v1"),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type Credentials = typeof credentials.$inferSelect;
export type InsertCredentials = typeof credentials.$inferInsert;

/**
 * Repository metadata cache for quick access without hitting GitHub API every time.
 */
export const repositoryCache = sqliteTable("repositoryCache", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  /** Full repository name (owner/repo) */
  repoName: text("repoName").notNull(),
  /** Repository description */
  description: text("description"),
  /** Default branch name */
  defaultBranch: text("defaultBranch").default("main"),
  /** Repository URL */
  url: text("url"),
  /** Last time this cache was updated */
  lastSyncedAt: integer("lastSyncedAt", { mode: "timestamp" }).defaultNow(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export type RepositoryCache = typeof repositoryCache.$inferSelect;
export type InsertRepositoryCache = typeof repositoryCache.$inferInsert;
