import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";
import legacy from "@vitejs/plugin-legacy";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy(), nodePolyfills()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    port: 3004,
    proxy: {
      "/api": {
        target: "http://192.168.3.74",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  build: {
    rollupOptions: {
      plugins: [
        visualizer({
          open: true, // it will open the report in default browser after build.
          filename: "bundle-report.html",
        }),
      ],
    },
  },
});
