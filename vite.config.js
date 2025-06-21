/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
// import svgr from "vite-plugin-svgr";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: env.VITE_APP_BASE || "/",
    plugins: [
      react({
        // 針對 React 19 的優化配置
        jsxRuntime: "automatic",
        babel: {
          plugins: [],
        },
      }),
      // svgr({
      //   // SVGR 配置優化
      //   include: "**/*.svg?react",
      // }),
      eslint({
        include: ["src/**/*.{js,jsx,ts,tsx}"],
        exclude: ["node_modules", "dist"],
        cache: false, // 暫時關閉快取避免問題
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
          api: "modern-compiler", // 使用現代 SCSS 編譯器
        },
      },
    },
    // 優化依賴處理
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "react-redux",
        "@reduxjs/toolkit",
        "form-data",
      ],
      exclude: ["@vitejs/plugin-react"],
    },
    // 開發伺服器配置
    server: {
      port: 5173,
      open: true,
      hmr: {
        overlay: true, // 有錯誤時可以暫時關閉
      },
    },
    // 建構配置
    build: {
      target: "esnext",
      minify: "esbuild",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
            redux: ["react-redux", "@reduxjs/toolkit"],
          },
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
