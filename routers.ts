import { publicProcedure, router } from "./trpc-server";
import { credentialsRouter } from "./credentials";
import { githubRouter } from "./routers_github";
import { aiRouter } from "./routers_ai";

export const appRouter = router({
  // Mock auth router
  auth: router({
    me: publicProcedure.query(() => {
        return { id: 1, name: "User", email: "user@example.com" };
    }),
    logout: publicProcedure.mutation(() => {
      return { success: true };
    }),
  }),

  credentials: credentialsRouter,
  github: githubRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
