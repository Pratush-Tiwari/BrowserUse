import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, "src/options"),
  build: {
    outDir: resolve(__dirname, "dist/options"),
    emptyOutDir: true,
  },
  server: {
    port: 5174,
    open: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
