import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { getUserCredentials } from "../lib/db";
import { createLLMClient, generateCode } from "../lib/llm";

export const aiRouter = router({
  generateCode: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        context: z.string().optional(),
        model: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const creds = await getUserCredentials(1);
        if (!creds?.llmApiKey) {
          throw new Error("LLM API key not configured. Please add your API key in Settings.");
        }
        const client = createLLMClient(creds.llmApiKey, creds.llmBaseUrl || undefined);
        const model = input.model || creds.llmModel || "gpt-4o";
        const code = await generateCode(client, input.prompt, input.context, model);
        return { code };
      } catch (error) {
        console.error("Error generating code:", error);
        throw error;
      }
    }),

  getConfig: publicProcedure.query(async () => {
    try {
      const creds = await getUserCredentials(1);
      return {
        model: creds?.llmModel,
        baseUrl: creds?.llmBaseUrl,
      };
    } catch (error) {
      console.error("Error getting AI config:", error);
      return {
        model: null,
        baseUrl: null,
      };
    }
  }),
});
