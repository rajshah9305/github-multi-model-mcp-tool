  userId: number,
  data: Omit<InsertRepositoryCache, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getRepositoryCache(userId, data.repoName);

  if (existing) {
    await db
      .update(repositoryCache)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(repositoryCache.userId, userId),
          eq(repositoryCache.repoName, data.repoName)
        )
      );
  } else {
    await db.insert(repositoryCache).values({
      userId,
      ...data,
    });
  }
}

/**
 * Get all cached repositories for a user
 */
export async function getUserRepositories(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(repositoryCache)
    .where(eq(repositoryCache.userId, userId));
}
