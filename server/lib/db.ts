import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { credentials } from "./schema";
import fs from "fs";

const dbPath = process.env.DATABASE_URL || "sqlite.db";

let dbInstance: any = null;
let sqlJsDb: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  try {
    const SQL = await initSqlJs();

    let buffer;
    try {
      if (fs.existsSync(dbPath)) {
        buffer = fs.readFileSync(dbPath);
      }
    } catch (e) {
      console.warn("Failed to read database file, creating new one.", e);
    }
    
    if (buffer) {
      sqlJsDb = new SQL.Database(buffer);
    } else {
      sqlJsDb = new SQL.Database();
      saveDb(); // Initialize file
    }
    
    dbInstance = drizzle(sqlJsDb, { schema });
    
    return dbInstance;
  } catch (e) {
    console.error("Failed to connect to database:", e);
    return null;
  }
}

export function saveDb() {
  if (!sqlJsDb) return;
  try {
    const data = sqlJsDb.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  } catch (e) {
    console.error("Failed to save database:", e);
  }
}

export async function getUserCredentials(userId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(credentials).where(eq(credentials.userId, userId));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user credentials:", error);
    return null;
  }
}

export async function upsertCredentials(userId: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const existing = await getUserCredentials(userId);
    if (existing) {
      await db.update(credentials).set({...data, updatedAt: new Date()}).where(eq(credentials.userId, userId));
    } else {
      await db.insert(credentials).values({userId, ...data});
    }
    saveDb();
  } catch (error) {
    console.error("Error upserting credentials:", error);
    throw new Error("Failed to save credentials");
  }
}
