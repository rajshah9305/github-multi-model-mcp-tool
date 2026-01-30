import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../routers";

const server = createHTTPServer({
  router: appRouter,
  createContext: () => ({}),
  basePath: "/api/trpc",
});

const port = Number(process.env.PORT) || 8787;
server.listen(port);
console.log(`tRPC server listening on http://127.0.0.1:${port}/api/trpc`);
