# Frontend-Dev-React 專案開發環境與目錄結構介紹

以 **React + Vite** 為基礎

- 樣式： **SCSS、CSS**
- 驗證： **JWT 身份驗證機制**
- 表單： **React Hook Form + Zod 驗證**
- 路由管理： **React Router**
- 狀態管理： **Redux & RTK**

---

## 主要架構

src/
├── assets/                // SCSS 樣式模組（依 base, mixins, components 分類）
├── components/            // 共用元件（如 Button、FormGroup 等）
├── data/                  // 靜態資料、常數定義
├── features/              // 特定頁面的功能模組 （含 Redux slice）
│ ├── auth/                    // 登入、註冊
│ └── users/                   // 使用者資訊...
├── hooks/                 // 自定義 Hook
├── layouts/               // 頁面佈局元件（如 Layout、Header、Footer）
├── pages/                 // 路由頁面
│ ├── AuthPages/               // 登入、註冊頁面
│ ├── MemberAccountPages/      // 會員中心頁面
│ ├── CheckoutPages/           // 結帳流程頁面
│ ├── SellPages/               // 販售相關頁面
│ └── ShoppingPages/           // 商品瀏覽、加入購物車等頁面
├── routes/                // React Router 路由定義
├── schemas/               // 表單 Zod 驗證 schema 定義
├── utils/                 // 通用工具函式
├── LightPickersApp.jsx    // 入口元件（App）
├── main.jsx               // React 應用程式進入點
├── store.js               // Redux Toolkit 的 store 建立與整合

## 根目錄

├── .env, .env.production           // 環境變數管理
├── vite.config.js                  // Vite 設定檔
├── eslint.config.js                // ESLint 規則設定
├── .prettierrc, .prettierignore    // Prettier 格式化規則
├── index.html                      // 應用程式渲染 root 檔案
├── package.json                    // 專案依賴套件與 script 設定
├── README.md                       // 專案說明文件
