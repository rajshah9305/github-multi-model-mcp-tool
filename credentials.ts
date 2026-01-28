import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getUserCredentials, upsertCredentials } from "../db";
import { encryptValue, decryptValue } from "../encryption";

export const credentialsRouter = router({
  /**
   * Get current user's credentials (returns decrypted values for display)
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const creds = await getUserCredentials(ctx.user.id);
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
  save: protectedProcedure
    .input(
      z.object({
        githubPat: z.string().optional(),
        llmApiKey: z.string().optional(),
        llmModel: z.string().optional(),
        llmBaseUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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

      await upsertCredentials(ctx.user.id, updateData);

      return {
        success: true,
        message: "Credentials saved successfully",
      };
    }),

  /**
   * Check if user has GitHub PAT configured
   */
  hasGitHubPat: protectedProcedure.query(async ({ ctx }) => {
    const creds = await getUserCredentials(ctx.user.id);
    return !!creds?.githubPat;
  }),

  /**
   * Check if user has LLM API key configured
   */
  hasLLMKey: protectedProcedure.query(async ({ ctx }) => {
    const creds = await getUserCredentials(ctx.user.id);
    return !!creds?.llmApiKey;
  }),
});
