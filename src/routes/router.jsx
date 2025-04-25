import { createHashRouter } from "react-router-dom";
import {
  HomePage,
  RegisterPage,
  LoginPage,
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
} from "@pages"; // @pages/index.js

import LightPickersApp from "@/LightPickersApp";

const ROUTES = {
  HOME: "/",
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
  },
  ACCOUNT: {
    ROOT: "/account/:userId",
    SETTINGS: "settings",
    ORDERS: "orders",
    WISHLISTS: "wishlists",
  },
  SHOPPING: {
    PRODUCTS: "/products",
    PRODUCT_DETAIL: "/products/:productId",
    CART: "/cart/:cartId",
  },
  CHECKOUT: {
    CHECKOUT: "/checkout/:cartId",
    CONFIRMATION: "/checkout/confirmation/:orderId",
    STATUS: "/checkout/status/:orderId",
  },
  SELL: {
    ROOT: "/sell",
    FORM: "form",
    CONFIRMATION: "confirmation/:applicationId",
    STATUS: "status/:applicationId",
  },
};

// 註冊、登入
const authRoutes = [
  {
    path: ROUTES.AUTH.REGISTER,
    element: <RegisterPage />,
  },
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LoginPage />,
  },
];

// 會員中心
const accountRoutes = [
  {
    path: ROUTES.ACCOUNT.ROOT,
    element: <AccountDashboardPage />,
    children: [
      {
        path: ROUTES.ACCOUNT.SETTINGS,
        element: <AccountSettingsPage />,
      },
      {
        path: ROUTES.ACCOUNT.ORDERS,
        element: <OrderHistoryPage />,
      },
      {
        path: ROUTES.ACCOUNT.WISHLISTS,
        element: <WishlistPage />,
      },
    ],
  },
];

// 商品、購物車
const shoppingRoutes = [
  {
    path: ROUTES.SHOPPING.PRODUCTS,
    element: <ProductCatalogPage />,
  },
  {
    path: ROUTES.SHOPPING.PRODUCT_DETAIL,
    element: <ProductDetailPage />,
  },
  {
    path: ROUTES.SHOPPING.CART,
    element: <CartPage />,
  },
];

// 結帳
const checkoutRoutes = [
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

// 出售流程
const sellRoutes = [
  {
    path: ROUTES.SELL.ROOT,
    element: <SellProcessPage />,
    children: [
      {
        path: ROUTES.SELL.FORM,
        element: <SellFormPage />,
      },
      {
        path: ROUTES.SELL.CONFIRMATION,
        element: <SellConfirmationPage />,
      },
      {
        path: ROUTES.SELL.STATUS,
        element: <SellApplyStatusPage />,
      },
    ],
  },
];

// 首頁 & 路徑彙整
const sitePages = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  ...authRoutes,
  ...accountRoutes,
  ...shoppingRoutes,
  ...checkoutRoutes,
  ...sellRoutes,
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
