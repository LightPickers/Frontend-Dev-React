import { createHashRouter, Link, NavLink } from "react-router-dom";

import {
  HomePage,
  RegisterPage,
  LoginPage,
  GoogleRedirectPage,
  GoogleRegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  AccountDashboardPage,
  AccountSettingsPage,
  OrderHistoryPage,
  WishlistPage,
  CartPage,
  CheckoutPage,
  OrderConfirmationPage,
  OrderStatusPage,
  ProductCatalogPage,
  ProductDetailPage,
  SellProcessPage,
  SellFormPage,
  SellConfirmationPage,
  SellApplyStatusPage,
  ErrorPage,
  ProductDescriptionPanel,
  ProductSpecificationsPanel,
  SellerReviewPanel,
  ContactUsPage,
  FAQPage,
} from "@pages"; // @pages/index.js
import LightPickersApp from "@/LightPickersApp";
import ProtectedRoute from "@components/ProtectedRoute";
import AccountLayout from "@layouts/AccountLayout";
import { TextMedium } from "@components/TextTypography";
import { productApi } from "@features/products/productApi";
import store from "@/store";

const ROUTES = {
  HOME: "/", // 首頁
  AUTH: {
    REGISTER: "/register", // 註冊
    LOGIN: "/login", // 登入
    GOOGLE_REDIRECT: "/google-callback", // google 登入用
    GOOGLE_REGISTER: "/google-register", // google 註冊用
    FORGOT_PASSWORD: "/forgot-password", // 忘記密碼
    RESET_PASSWORD: "/reset-password", // 重設密碼
  },
  ACCOUNT: {
    ROOT: "/account/profile", // 會員中心首頁（目前沒線稿）
    SETTINGS: "settings", // 會員資料管理
    ORDERS: "orders", // 訂單管理
    WISHLISTS: "wishlists", // 收藏列表
  },
  SHOPPING: {
    PRODUCTS: "/products", // 產品列表頁
    PRODUCT_DETAIL: "/products/:productId", // 產品資訊頁
    PRODUCT_DESCRIPTION: "description",
    PRODUCT_SPECIFICATIONS: "specification",
    SELLER_REVIEW: "review",
  },
  CHECKOUT: {
    CART: "/cart", // 購物車 //
    CHECKOUT: "/checkout", // 結帳頁面 //
    CONFIRMATION: "/checkout/confirmation/", // 確認結帳頁面
    STATUS: "/checkout/status/:orderId", // 結帳結果頁面
  },
  SELL: {
    ROOT: "/sell", // 出售流程
    // 注意：子路由現在在受保護路由中需要完整路徑
    FORM: "form", // 出售列表
    CONFIRMATION: "confirmation/:applicationId", // 確認出售資訊頁
    STATUS: "status/:applicationId", // 出售狀態頁
  },
  CONTACT_US: "/contact", // 聯絡我們
  FAQ: "/faq", // 常見問題
};

// 註冊、登入 (公開路由)
const authRoutes = [
  {
    path: ROUTES.AUTH.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.AUTH.GOOGLE_REDIRECT,
    element: <GoogleRedirectPage />,
  },
  {
    path: ROUTES.AUTH.GOOGLE_REGISTER,
    element: <GoogleRegisterPage />,
  },
  {
    path: ROUTES.AUTH.FORGOT_PASSWORD,
    element: <ForgotPasswordPage />,
  },
  {
    path: ROUTES.AUTH.RESET_PASSWORD,
    element: <ResetPasswordPage />,
  },
];

// 商品目錄 (公開路由)
const shoppingRoutes = [
  {
    path: ROUTES.SHOPPING.PRODUCTS,
    element: <ProductCatalogPage />,
    handle: {
      crumb: () => (
        <TextMedium as={Link} to={ROUTES.SHOPPING.PRODUCTS}>
          商品總覽
        </TextMedium>
      ),
    },
  },
  {
    path: ROUTES.SHOPPING.PRODUCT_DETAIL,
    element: <ProductDetailPage />,
    id: "product_detail",
    loader: async ({ params }) => {
      try {
        const result = await store.dispatch(
          productApi.endpoints.getProductById.initiate(params.productId)
        );
        return result;
      } catch (err) {
        console.error("Loader error:", err);
        // throw new Response("Not Found", { status: 404 });
      }
    },
    handle: {
      crumb: ({ data, params, isCurrentPage }) => (
        <TextMedium
          as={Link}
          to={`/products/${params.productId}`}
          className={isCurrentPage ? "fw-bolder" : "fw-normal"}
        >
          {data?.data?.data.name ?? `商品 #${params.productId}`}
        </TextMedium>
      ),
    },
    children: [
      {
        index: true,
        // path: ROUTES.SHOPPING.PRODUCT_DESCRIPTION,
        element: <ProductDescriptionPanel />,
        handle: {
          crumb: ({ isCurrentPage }) => (
            <TextMedium className={isCurrentPage ? "fw-bold" : "fw-normal"}>商品描述</TextMedium>
          ),
        },
      },
      {
        path: ROUTES.SHOPPING.PRODUCT_SPECIFICATIONS,
        element: <ProductSpecificationsPanel />,
        handle: {
          crumb: ({ isCurrentPage }) => (
            <TextMedium className={isCurrentPage ? "fw-bolder" : "fw-normal"}>商品規格</TextMedium>
          ),
        },
      },
      {
        path: ROUTES.SHOPPING.SELLER_REVIEW,
        element: <SellerReviewPanel />,
        handle: {
          crumb: ({ isCurrentPage }) => (
            <TextMedium className={isCurrentPage ? "fw-bolder" : "fw-normal"}>賣家評論</TextMedium>
          ),
        },
      },
    ],
  },
];

// 需要保護的路由 (需要登入)
// 會員中心路由
const accountRoutes = [
  {
    path: ROUTES.ACCOUNT.ROOT,
    element: <AccountLayout />,
    handle: {
      crumb: () => (
        <TextMedium as={Link} to="/account/profile">
          會員中心
        </TextMedium>
      ),
    },
    children: [
      // {
      //   element: <AccountDashboardPage />,
      // },
      {
        index: true,
        path: ROUTES.ACCOUNT.SETTINGS,
        element: <AccountSettingsPage />,
        handle: {
          crumb: () => <TextMedium>我的帳戶</TextMedium>,
        },
      },
      {
        path: ROUTES.ACCOUNT.ORDERS,
        element: <OrderHistoryPage />,
        handle: {
          crumb: () => <TextMedium>訂單資訊</TextMedium>,
        },
      },
      {
        path: ROUTES.ACCOUNT.WISHLISTS,
        element: <WishlistPage />,
        handle: {
          crumb: () => <TextMedium>收藏資訊</TextMedium>,
        },
      },
    ],
  },
];

// 結帳路由
const checkoutRoutes = [
  {
    path: ROUTES.CHECKOUT.CART,
    element: <CartPage />,
  },
  {
    path: ROUTES.CHECKOUT.CHECKOUT,
    element: <CheckoutPage />,
  },
  {
    path: ROUTES.CHECKOUT.CONFIRMATION,
    element: <OrderConfirmationPage />,
  },
  {
    path: ROUTES.CHECKOUT.STATUS,
    element: <OrderStatusPage />,
  },
];

// 出售流程相關路由
// 主頁面是公開的，但表單和狀態頁面需要保護
const sellPublicRoute = {
  path: ROUTES.SELL.ROOT,
  element: <SellProcessPage />,
};

// 出售流程子路由：因與父元素分離關係，放上完整路徑
const sellProtectedRoutes = [
  {
    path: `${ROUTES.SELL.ROOT}/${ROUTES.SELL.FORM}`,
    element: <SellFormPage />,
  },
  {
    path: `${ROUTES.SELL.ROOT}/${ROUTES.SELL.CONFIRMATION}`,
    element: <SellConfirmationPage />,
  },
  {
    path: `${ROUTES.SELL.ROOT}/${ROUTES.SELL.STATUS}`,
    element: <SellApplyStatusPage />,
  },
];

// 整合所有需要保護的路由
const protectedRoutes = [...accountRoutes, ...checkoutRoutes, ...sellProtectedRoutes];

// 首頁與公開路由
const publicRoutes = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    handle: {
      crumb: () => (
        <TextMedium as={NavLink} end to={ROUTES.HOME}>
          首頁
        </TextMedium>
      ),
    },
  },
  {
    path: ROUTES.CONTACT_US,
    element: <ContactUsPage />,
  },
  {
    path: ROUTES.FAQ,
    element: <FAQPage />,
  },
  sellPublicRoute,
  ...authRoutes,
  ...shoppingRoutes,
];

// 整合所有路由
const sitePages = [
  ...publicRoutes,
  {
    element: <ProtectedRoute />,
    children: protectedRoutes,
  },
];

const appRoutes = [
  {
    path: "",
    element: <LightPickersApp />,
    errorElement: <ErrorPage />,
    children: sitePages,
  },
];

const appRouter = createHashRouter(appRoutes);
export default appRouter;
