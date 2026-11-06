import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [fileURLToPath(new URL("./src/styles", import.meta.url))],
      },
    },
  },
  base: "./",
  build: {
    outDir: "out",
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
    strictPort: true,
  },
});
