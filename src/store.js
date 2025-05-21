import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "@features/auth/authSlice";
import cartReducer from "@features/cart/cartSlice";
import checkoutPageReducer from "@/features/cart/checkoutPageSlice";
import { userApi } from "@features/users/userApi";
import { productApi } from "@features/products/productApi";
import { cartApi } from "@features/cart/cartApi";
import { orderApi } from "@features/orders/orderApi";
import { wishlistApi } from "@features/wishlist/wishlistApi";
import { couponApi } from "@features/coupons/couponApi";

const apiReducers = {
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [cartApi.reducerPath]: cartApi.reducer,
  [couponApi.reducerPath]: couponApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [wishlistApi.reducerPath]: wishlistApi.reducer,
};

const apiMiddleware = [
  userApi.middleware,
  productApi.middleware,
  cartApi.middleware,
  couponApi.middleware,
  orderApi.middleware,
  wishlistApi.middleware,
];

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkoutPage: checkoutPageReducer,
    ...apiReducers,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiMiddleware),
});

setupListeners(store.dispatch);

export default store;
