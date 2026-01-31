import { router } from "./trpc";
import { credentialsRouter } from "./routers/credentials";
import { githubRouter } from "./routers/github";
import { aiRouter } from "./routers/ai";

export const appRouter = router({
  credentials: credentialsRouter,
  github: githubRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
