import { z } from "zod";
import { router, publicProcedure } from "./trpc-server";
import { getUserCredentials } from "./db";
import { createLLMClient, generateCode } from "./llm";

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
      const creds = await getUserCredentials(1);
      if (!creds?.llmApiKey) {
        throw new Error("LLM API key not configured");
      }
      const client = createLLMClient(creds.llmApiKey, creds.llmBaseUrl || undefined);
      const model = input.model || creds.llmModel || "gpt-4o";
      const code = await generateCode(client, input.prompt, input.context, model);
      return { code };
    }),

  getConfig: publicProcedure.query(async () => {
    const creds = await getUserCredentials(1);
    return {
      model: creds?.llmModel,
      baseUrl: creds?.llmBaseUrl,
    };
  }),
});
