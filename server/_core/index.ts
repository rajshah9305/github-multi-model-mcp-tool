import type { IncomingMessage, ServerResponse } from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../routers";

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
  basePath: "/api/trpc",
});

export default function vercelHandler(req: IncomingMessage, res: ServerResponse): void {
  handler(req, res);
}
