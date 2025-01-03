import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    host: "::",
    proxy: {
      // Redirect all 404s to index.html for client-side routing
      "*": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => "/index.html",
      },
    },
  },
  preview: {
    port: 8080,
  },
}));