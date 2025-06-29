import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ADMIN_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token; // 根據你的 Redux 結構取得 token
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getCoupons: builder.query({
      query: ({ page, per }) => ({
        url: "/coupons",
        params: { page, per },
      }),
    }),
  }),
});

export const { useGetCouponsQuery } = couponApi;
