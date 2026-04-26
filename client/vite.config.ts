import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/ai-proof-career1/" : "/",
  plugins: [react()],
  server: {
    port: 5173
  }
}));
