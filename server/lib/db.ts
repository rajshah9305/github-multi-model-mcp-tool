import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { eq } from "drizzle-orm";
import { credentials } from "./schema";

const connectionString = process.env.DATABASE_URL || "";

let dbInstance: any = null;
let connectionPool: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  if (!connectionString) {
    console.warn("DATABASE_URL not configured. Database operations will fail.");
    return null;
  }

  try {
    // Create connection pool for better performance
    if (!connectionPool) {
      connectionPool = mysql.createPool({
        uri: connectionString,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    
    dbInstance = drizzle(connectionPool, { schema, mode: "default" });
    
    // Test the connection
    await connectionPool.execute('SELECT 1');
    
    return dbInstance;
  } catch (e) {
    console.error("Failed to connect to database:", e);
    return null;
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
  } catch (error) {
    console.error("Error upserting credentials:", error);
    throw new Error("Failed to save credentials");
  }
}

