import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["framer-motion", "styled-components", "react-transition-group"],
          "vendor-query": ["react-query"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-mui": ["@mui/material", "@mui/icons-material", "@mui/joy", "@mui/x-date-pickers"],
        },
      },
    },
  },
});
