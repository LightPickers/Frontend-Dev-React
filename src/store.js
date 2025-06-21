import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@features/auth/authSlice";
import loadingReducer from "@features/loading/loadingSlice";
import cartReducer from "@features/cart/cartSlice";
// import wishlistReducer from "@features/wishlist/wishlistSlice";
import checkoutPageReducer from "@features/cart/checkoutPageSlice";
import { userApi } from "@features/users/userApi";
import { productApi } from "@features/products/productApi";
import { cartApi } from "@features/cart/cartApi";
import { orderApi } from "@features/orders/orderApi";
import { wishlistApi } from "@features/wishlist/wishlistApi";
import { couponApi } from "@features/coupons/couponApi";
import { uploadApi } from "@features/upload/uploadApi";
import { aiCustomerServiceApi } from "@features/aiCustomerService/aiCustomerServiceApi";

// API reducers 配置
const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
  [uploadApi.reducerPath]: uploadApi.reducer,
  [aiCustomerServiceApi.reducerPath]: aiCustomerServiceApi.reducer,
};

// API middleware 配置
const apiMiddleware = [
  userApi.middleware,
  productApi.middleware,
  cartApi.middleware,
  couponApi.middleware,
  orderApi.middleware,
  wishlistApi.middleware,
  uploadApi.middleware,
  aiCustomerServiceApi.middleware,
];

// 自定義 transform 來處理 Set 對象
const setTransform = {
  in: (state, key) => {
    // 序列化時將 Set 轉換為 Array
    if (key === "productIds" && state instanceof Set) {
      return Array.from(state);
    }
    return state;
  },
  out: (state, key) => {
    // 反序列化時將 Array 轉換為 Set
    if (key === "productIds" && Array.isArray(state)) {
      return new Set(state);
    }
    return state;
  },
};

const cartPersistConfig = {
  key: "cart",
  storage,
  // 只持久化 productIds 和一些基本狀態，其他數據從 API 獲取
  whitelist: ["productIds", "isCartOpen"],
  // 使用自定義 transform 處理 Set 對象
  transforms: [setTransform],
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
  // 只持久化 productIds
  whitelist: ["productIds"],
  // 使用自定義 transform 處理 Set 對象
  transforms: [setTransform],
};

const checkoutPersistConfig = {
  key: "checkoutPage",
  storage,
  // 持久化所有 checkout 相關的狀態
  whitelist: [
    "shippingMethod",
    "recipient",
    "paymentMethod",
    "deliveryDate",
    "deliveryTime",
    "couponCode",
  ],
};

// 創建持久化的 reducers（不包含 auth）
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
// const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);
const persistedCheckoutReducer = persistReducer(checkoutPersistConfig, checkoutPageReducer);

// 合併所有 reducers
const rootReducer = combineReducers({
  auth: authReducer, // 保持原有的 auth reducer，不使用 persist
  loading: loadingReducer,
  cart: persistedCartReducer,
  // wishlist: persistedWishlistReducer,
  checkoutPage: persistedCheckoutReducer,
  ...apiReducers,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 的 actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE",
        ],
        // 由於使用了 transforms，理論上不需要忽略 Set 對象
        // 但如果還有問題，可以添加以下配置：
        ignoredPaths: ["cart.productIds"],
        // ignoredPaths: ["cart.productIds", "wishlist.productIds"],
      },
    }).concat(apiMiddleware),
  devTools: import.meta.env.DEV, // 只在開發環境啟用 DevTools
});

// 設置 RTK Query 監聽器
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;
