import { router } from "./trpc-server";
import { credentialsRouter } from "./credentials";
import { githubRouter } from "./routers_github";
import { aiRouter } from "./routers_ai";

export const appRouter = router({
  credentials: credentialsRouter,
  github: githubRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
