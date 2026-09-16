import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/analytics-api": {
        target: "https://posthog-api.lockated.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/analytics-api/, ""),
        headers: {
          Origin: "https://rental-uat.lockated.com",
        },
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            if (proxyRes.headers["access-control-allow-origin"]) {
              proxyRes.headers["access-control-allow-origin"] = "*";
            }
          });
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
