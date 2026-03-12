import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@features/admin": "/src/features/admin",
      "@features/cart": path.resolve(__dirname, "./src/features/cart"),
      "@features/buyer": path.resolve(__dirname, "./src/features/buyer"),
    },
  },
});
