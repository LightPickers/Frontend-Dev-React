import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "@features/auth/authSlice";
import cartReducer from "@features/cart/cartSlice";
import checkoutPageReducer from "@/features/cart/checkoutPageSlice";
import { userApi } from "@features/users/userApi";
import { productApi } from "@features/products/productApi";
import { cartApi } from "@features/cart/cartApi";
import { couponApi } from "./features/coupons/couponApi";
import { orderApi } from "@features/orders/orderApi";
import { wishlistApi } from "@features/wishlist/wishlistApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkoutPage: checkoutPageReducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [wishlistApi.reducerPath]: wishlistApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(productApi.middleware)
      .concat(cartApi.middleware)
      .concat(couponApi.middleware)
      .concat(orderApi.middleware)
      .concat(wishlistApi.middleware),
});

setupListeners(store.dispatch);

export default store;
