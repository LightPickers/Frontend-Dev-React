import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@features/auth/authSlice";
import cartReducer from "@features/cart/cartSlice";
// import wishlistReducer from "@features/wishlist/wishlistSlice";
import checkoutPageReducer from "@/features/cart/checkoutPageSlice";
import { userApi } from "@features/users/userApi";
import { productApi } from "@features/products/productApi";
import { cartApi } from "@features/cart/cartApi";
import { orderApi } from "@features/orders/orderApi";
import { wishlistApi } from "@features/wishlist/wishlistApi";
import { couponApi } from "@features/coupons/couponApi";

// API reducers 配置
const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
};

// API middleware 配置
const apiMiddleware = [
  userApi.middleware,
  productApi.middleware,
  cartApi.middleware,
  couponApi.middleware,
  orderApi.middleware,
  wishlistApi.middleware,
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

// 創建持久化的 reducers（不包含 auth）
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
// const persistedWishlistReducer = persistReducer(wishlistPersistConfig, wishlistReducer);

// 合併所有 reducers
const rootReducer = combineReducers({
  auth: authReducer, // 保持原有的 auth reducer，不使用 persist
  cart: persistedCartReducer,
  // wishlist: persistedWishlistReducer,
  checkoutPage: checkoutPageReducer, // checkout 頁面狀態不需要持久化
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
  //devTools: process.env.NODE_ENV !== "production", // 只在開發環境啟用 DevTools
});

// 設置 RTK Query 監聽器
setupListeners(store.dispatch);

export const persistor = persistStore(store);
export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import persistReducer from "redux-persist/es/persistReducer";
// import storage from "redux-persist/lib/storage";
// import persistStore from "redux-persist/es/persistStore";

// import authReducer from "@features/auth/authSlice";
// import cartReducer from "@features/cart/cartSlice";
// import wishlistReducer from "@features/wishlist/wishlistSlice";
// import checkoutPageReducer from "@/features/cart/checkoutPageSlice";
// import { userApi } from "@features/users/userApi";
// import { productApi } from "@features/products/productApi";
// import { cartApi } from "@features/cart/cartApi";
// import { orderApi } from "@features/orders/orderApi";
// import { wishlistApi } from "@features/wishlist/wishlistApi";
// import { couponApi } from "@features/coupons/couponApi";

// const apiReducers = {
//   [userApi.reducerPath]: userApi.reducer,
//   [productApi.reducerPath]: productApi.reducer,
//   [cartApi.reducerPath]: cartApi.reducer,
//   [couponApi.reducerPath]: couponApi.reducer,
//   [orderApi.reducerPath]: orderApi.reducer,
//   [wishlistApi.reducerPath]: wishlistApi.reducer,
// };

// const apiMiddleware = [
//   userApi.middleware,
//   productApi.middleware,
//   cartApi.middleware,
//   couponApi.middleware,
//   orderApi.middleware,
//   wishlistApi.middleware,
// ];

// // Redux-persist 配置
// const cartPersistConfig = {
//   key: "cart",
//   storage,
//   // 只持久化 productIds，其他數據從 API 獲取
//   whitelist: ["productIds"],
// };

// const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // cart: cartReducer,
//     cart: persistedCartReducer,
//     wishlist: wishlistReducer,
//     checkoutPage: checkoutPageReducer,
//     ...apiReducers,
//   },
//   middleware: getDefaultMiddleware =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//         ignoredPaths: ["cart.productIds", "wishlist.productIds"], // 忽略 Set 對象的序列化檢查
//       },
//     }).concat(apiMiddleware),
// });

// setupListeners(store.dispatch);

// export const persistor = persistStore(store);
// export default store;
