import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getUserCredentials } from "../lib/db";
import { createGitHubClient, listRepositories, listBranches, getFileContent, listDirectoryContents, updateFile } from "../lib/github";

export const githubRouter = router({
  listRepositories: publicProcedure.query(async () => {
    try {
      const creds = await getUserCredentials(1);
      if (!creds?.githubPat) {
        throw new Error("GitHub PAT not configured. Please add your GitHub Personal Access Token in Settings.");
      }
      const octokit = createGitHubClient(creds.githubPat);
      const data = await listRepositories(octokit);
      return data.map((repo: { id: number; name: string; full_name?: string; fullName?: string; description?: string | null }) => ({
        ...repo,
        fullName: repo.full_name ?? repo.fullName ?? "",
      }));
    } catch (error) {
      console.error("Error listing repositories:", error);
      throw error;
    }
  }),

  listBranches: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string() }))
    .query(async ({ input }) => {
      try {
        const creds = await getUserCredentials(1);
        if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
        const octokit = createGitHubClient(creds.githubPat);
        return await listBranches(octokit, input.owner, input.repo);
      } catch (error) {
        console.error("Error listing branches:", error);
        throw error;
      }
    }),

  getFileContent: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), path: z.string(), branch: z.string() }))
    .query(async ({ input }) => {
      try {
        const creds = await getUserCredentials(1);
        if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
        const octokit = createGitHubClient(creds.githubPat);
        return await getFileContent(octokit, input.owner, input.repo, input.path, input.branch);
      } catch (error) {
        console.error("Error getting file content:", error);
        throw error;
      }
    }),

  listDirectoryContents: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), path: z.string().optional(), branch: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        const creds = await getUserCredentials(1);
        if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
        const octokit = createGitHubClient(creds.githubPat);
        return await listDirectoryContents(octokit, input.owner, input.repo, input.path || "", input.branch);
      } catch (error) {
        console.error("Error listing directory contents:", error);
        throw error;
      }
    }),

  updateFile: publicProcedure
    .input(z.object({
        owner: z.string(),
        repo: z.string(),
        path: z.string(),
        content: z.string(),
        message: z.string(),
        sha: z.string(),
        branch: z.string()
    }))
    .mutation(async ({ input }) => {
        try {
          const creds = await getUserCredentials(1);
          if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
          const octokit = createGitHubClient(creds.githubPat);
          return await updateFile(octokit, input.owner, input.repo, input.path, input.content, input.message, input.sha, input.branch);
        } catch (error) {
          console.error("Error updating file:", error);
          throw error;
        }
    })
});
