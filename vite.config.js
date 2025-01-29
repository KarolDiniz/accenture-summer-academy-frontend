import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@css": "/src/assets/css",
      "@img": "/src/assets/img",
      "@theme": "/src/assets/theme",
      "@comp": "/src/components",
      "@form": "/src/components/form",
      "@ui": "/src/components/ui",
      "@pages": "/src/pages",
      "@utils": "/src/utils",
      "@services": "/src/services",
      "@api": "/src/api",
      "@repository": "/src/repository",
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          floatPrecision: 2,
        },
      },
    }),
  ],
});
