import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/Frontend-Dev-React/" : "/",
  plugins: [react()],
  resolve: {
    alias: {
      // 定義別名 => 實際路徑的映射
      "@": path.resolve(__dirname, "./src"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
    },
  },
});

/* 
- path.reslove(): 將相對路徑轉為絕對路徑
- __dirname: 當前執行文件的目錄路徑
- alias: 物件的每個鍵值對定義了一個別名及其對應的實際路徑
*/
