import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  build: {
    target: "ES2020",
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-ui": ["@radix-ui/react-tabs", "@radix-ui/react-tooltip", "lucide-react", "sonner"],
          "vendor-trpc": ["@trpc/client", "@trpc/react-query"],
          "vendor-data": ["@tanstack/react-query", "drizzle-orm"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
