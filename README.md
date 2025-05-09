# Frontend-Dev-React 專案開發環境與目錄結構介紹

以 **React + Vite** 為建設

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

## 注意事項
### 環境變數
- 分別設置 .env、.env.production 檔案，並創建環境變數 VITE_APP_BASE 作為部屬路徑使用
- .env.production 的部屬路徑請設置 repo 名稱
- 環境變數請用 VITE_ 開頭，使用時須加上 import.meta.env.環境變數名稱
- 使用 public 靜態資料時，請用部屬路徑作為前綴

### 路由
- 創建頁面流程：
  1. 在 src/pages/ 找到該頁面的分類資料夾中創建，沒有所屬類別資料夾就創一個
  2. 在 src/pages/index.js 匯入並匯出
  3. 到 src/routes/router.jsx 匯入 index 的地方添加該頁面
  4. 在 src/routes/router.jsx 的目錄 (ROUTES) 物件上找到對應處設定路徑，沒有就自訂一個
  5. 在 src/routes/router.jsx，根據該頁面是否公開、頁面種類來找創建路由
  6. 在 src/routes/router.jsx，若是新增的種類，則需要在整合處另外添加