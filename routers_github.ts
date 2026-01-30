import { z } from "zod";
import { router, publicProcedure } from "./trpc-server";
import { getUserCredentials } from "./db";
import { createGitHubClient, listRepositories, listBranches, getFileContent, listDirectoryContents, updateFile } from "./github";

export const githubRouter = router({
  listRepositories: publicProcedure.query(async () => {
    const creds = await getUserCredentials(1);
    if (!creds?.githubPat) {
      throw new Error("GitHub PAT not configured");
    }
    const octokit = createGitHubClient(creds.githubPat);
    const data = await listRepositories(octokit);
    return data.map((repo: { id: number; name: string; full_name?: string; fullName?: string; description?: string | null }) => ({
      ...repo,
      fullName: repo.full_name ?? repo.fullName ?? "",
    }));
  }),

  listBranches: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string() }))
    .query(async ({ input }) => {
      const creds = await getUserCredentials(1);
      if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
      const octokit = createGitHubClient(creds.githubPat);
      return listBranches(octokit, input.owner, input.repo);
    }),

  getFileContent: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), path: z.string(), branch: z.string() }))
    .query(async ({ input }) => {
      const creds = await getUserCredentials(1);
      if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
      const octokit = createGitHubClient(creds.githubPat);
      return getFileContent(octokit, input.owner, input.repo, input.path, input.branch);
    }),

  listDirectoryContents: publicProcedure
    .input(z.object({ owner: z.string(), repo: z.string(), path: z.string().optional(), branch: z.string().optional() }))
    .query(async ({ input }) => {
      const creds = await getUserCredentials(1);
      if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
      const octokit = createGitHubClient(creds.githubPat);
      return listDirectoryContents(octokit, input.owner, input.repo, input.path || "", input.branch);
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
        const creds = await getUserCredentials(1);
        if (!creds?.githubPat) throw new Error("GitHub PAT not configured");
        const octokit = createGitHubClient(creds.githubPat);
        return updateFile(octokit, input.owner, input.repo, input.path, input.content, input.message, input.sha, input.branch);
    })
});
