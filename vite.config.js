/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_APP_BASE,
    plugins: [
      react(),
      svgr(),
      eslint({
        include: ["src/**/*.{js,jsx,ts,tsx}"],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "@pages": resolve(__dirname, "./src/pages"),
        "@components": resolve(__dirname, "./src/components"),
        "@layouts": resolve(__dirname, "./src/layouts"),
        "@routes": resolve(__dirname, "./src/routes"),
        "@assets": resolve(__dirname, "./src/assets"),
        "@features": resolve(__dirname, "./src/features"),
        "@hooks": resolve(__dirname, "./src/hooks"),
        "@schemas": resolve(__dirname, "./src/schemas"),
        "@utils": resolve(__dirname, "./src/utils"),
        "@data": resolve(__dirname, "./src/data"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [resolve(__dirname, "src/assets")],
        },
      },
    },
  };
});

/* 
- path.reslove(): 將相對路徑轉為絕對路徑
- __dirname: 當前執行文件的目錄路徑
- alias: 物件的每個鍵值對定義了一個別名及其對應的實際路徑
*/
