import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
  }),
  tagTypes: ["Product"],
  endpoints: builder => ({
    // 取得產品列表
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
  }),
});
