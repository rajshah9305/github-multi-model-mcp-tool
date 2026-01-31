import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { getUserCredentials, upsertCredentials } from "../lib/db";
import { encryptValue } from "../lib/encryption";

export const credentialsRouter = router({
  /**
   * Get current user's credentials (returns decrypted values for display)
   */
  get: publicProcedure.query(async () => {
    const creds = await getUserCredentials(1);
    if (!creds) {
      return null;
    }

    return {
      id: creds.id,
      githubPat: creds.githubPat ? "••••••••••••••••" : null,
      llmApiKey: creds.llmApiKey ? "••••••••••••••••" : null,
      llmModel: creds.llmModel,
      llmBaseUrl: creds.llmBaseUrl,
      createdAt: creds.createdAt,
      updatedAt: creds.updatedAt,
    };
  }),

  /**
   * Save or update user credentials
   */
  save: publicProcedure
    .input(
      z.object({
        githubPat: z.string().optional(),
        llmApiKey: z.string().optional(),
        llmModel: z.string().optional(),
        llmBaseUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData: Record<string, string | null> = {};

      if (input.githubPat !== undefined) {
        updateData.githubPat = input.githubPat ? encryptValue(input.githubPat) : null;
      }

      if (input.llmApiKey !== undefined) {
        updateData.llmApiKey = input.llmApiKey ? encryptValue(input.llmApiKey) : null;
      }

      if (input.llmModel !== undefined) {
        updateData.llmModel = input.llmModel;
      }

      if (input.llmBaseUrl !== undefined) {
        updateData.llmBaseUrl = input.llmBaseUrl;
      }

      await upsertCredentials(1, updateData);

      return {
        success: true,
        message: "Credentials saved successfully",
      };
    }),

  /**
   * Check if user has GitHub PAT configured
   */
  hasGitHubPat: publicProcedure.query(async () => {
    const creds = await getUserCredentials(1);
    return !!creds?.githubPat;
  }),

  /**
   * Check if user has LLM API key configured
   */
  hasLLMKey: publicProcedure.query(async () => {
    const creds = await getUserCredentials(1);
    return !!creds?.llmApiKey;
  }),
});
