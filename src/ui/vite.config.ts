import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // For Shadcn UI path alias
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../../ui-build'), // Output to root ui-build/ to avoid conflict with src/ui
    // The output from this will need to be copied into the final extension's 'ui' directory
    // or the manifest/HTML files adjusted.
    // Let's assume a build step will copy from 'ui-build' to 'ui' at the root.
    // For now, let's make it output to a place that popup.html expects: `../../ui`
    // This means the output will be in `/app/ui/`
    // vite.config.ts is in /app/src/ui. So ../../ui is /app/ui.

    // Corrected outDir to place files where popup.html and options.html expect them:
    // manifest.json specifies "popup.html" which has <script src="ui/popup.js">
    // So the JS files should end up in a folder named "ui" at the root of the extension.
    outDir: path.resolve(__dirname, '../../', 'ui'),


    rollupOptions: {
      input: {
        // These names (popup, options) will be used for [name].js
        popup: path.resolve(__dirname, 'src/popupEntry.tsx'),
        options: path.resolve(__dirname, 'src/optionsEntry.tsx'),
      },
      output: {
        entryFileNames: `[name].js`, // Generates popup.js, options.js
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[ext]`, // Other assets like CSS
      }
    },
    emptyOutDir: true, // Clean the output directory before build
  },
  // Ensure the base path is correct for resolving assets within the extension
  base: './',
})
