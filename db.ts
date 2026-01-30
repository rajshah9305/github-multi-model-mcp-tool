import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { credentials } from "./schema";

const connectionString = process.env.DATABASE_URL || "";

let dbInstance: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  if (!connectionString) return null;

  try {
    const connection = await mysql.createConnection(connectionString);
    dbInstance = drizzle(connection, { schema, mode: "default" });
    return dbInstance;
  } catch (e) {
    console.error("Failed to connect to DB", e);
    return null;
  }
}

export async function getUserCredentials(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(credentials).where(eq(credentials.userId, userId));
  return result[0] || null;
}

export async function upsertCredentials(userId: number, data: any) {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const existing = await getUserCredentials(userId);
    if (existing) {
        await db.update(credentials).set({...data, updatedAt: new Date()}).where(eq(credentials.userId, userId));
    } else {
        await db.insert(credentials).values({userId, ...data});
    }
}

