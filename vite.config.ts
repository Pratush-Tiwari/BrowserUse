import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/popup/index.html"),
          options: resolve(__dirname, "src/options/index.html"),
          background: resolve(__dirname, "src/background/background.ts"),
          content: resolve(__dirname, "src/content/content.ts"),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            if (chunkInfo.name === "background") {
              return "background.js";
            }
            if (chunkInfo.name === "content") {
              return "content.js";
            }
            return "assets/[name]-[hash].js";
          },
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
      outDir: "dist",
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: isDev
      ? {
          port: 5173,
          open: "/src/popup/index.html",
        }
      : undefined,
  };
});
