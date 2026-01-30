import type { IncomingMessage, ServerResponse } from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../routers";

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => ({}),
  basePath: "/api/trpc",
});

export default function vercelHandler(req: IncomingMessage, res: ServerResponse): void {
  // Add CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  handler(req, res);
}
