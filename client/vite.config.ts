import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/ai-proof-career1/" : "/",
  plugins: [react()],
  server: {
    port: 5173
  }
});
