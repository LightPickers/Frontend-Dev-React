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

export default ROUTES;

// Route helpers
export const getAccountRootPath = userId => `/account/${userId}`;
export const getAccountSettingsPath = userId => `/account/${userId}/settings`;
export const getAccountOrdersPath = userId => `/account/${userId}/orders`;
export const getAccountWishlistsPath = userId => `/account/${userId}/wishlists`;

export const getCartPath = cartId => `/cart/${cartId}`;
export const getCheckoutPath = cartId => `/checkout/${cartId}`;
export const getOrderConfirmationPath = orderId => `/checkout/confirmation/${orderId}`;
export const getOrderStatusPath = orderId => `/checkout/status/${orderId}`;

export const getProductDetailPath = productId => `/products/${productId}`;
export const getSellConfirmationPath = applicationId => `/sell/confirmation/${applicationId}`;
export const getSellStatusPath = applicationId => `/sell/status/${applicationId}`;
