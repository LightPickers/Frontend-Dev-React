import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@features/auth/authSlice";
import { userApi } from "@features/users/userApi";
import { productApi } from "@/features/products/productApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [userApi.reducerPath]: userApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(userApi.middleware).concat(productApi.middleware),
});

export default store;
