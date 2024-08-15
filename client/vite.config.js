import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Use a default value if the environment variable is not set
// eslint-disable-next-line no-undef
const backend_url = process.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backend_url,
        changeOrigin: true,
        rewrite: (path) => path,
      },
    },
  },
  resolve: {
    alias: {
      "@/utils": "/src/utils",
      "@/components": "/src/components",
      "@/pages": "/src/pages",
      "@/lib": "/src/lib",
      "@/features": "/src/features",
    },
  }
});



